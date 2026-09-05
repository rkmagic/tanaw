# GCP Setup Guide

This guide walks you through setting up the Google Cloud Platform infrastructure for the Bridging Talent application.

## Prerequisites

- Google Cloud Platform account
- `gcloud` CLI installed and configured
- Billing enabled on your GCP project

## Step 1: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Required APIs

Enable the following APIs in your GCP project:

```bash
gcloud services enable \
  sqladmin.googleapis.com \
  storage-component.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com
```

Or enable them via the [API Library](https://console.cloud.google.com/apis/library).

## Step 3: Create Cloud SQL PostgreSQL Instance

1. Go to [Cloud SQL](https://console.cloud.google.com/sql)
2. Click "Create Instance"
3. Choose PostgreSQL
4. Configure:
   - Instance ID: `bridging-talent-db`
   - Password: Set a strong password (save it!)
   - Region: Choose closest to your users
   - Database version: PostgreSQL 14 or 15
5. Click "Create"

After creation:
1. Note the instance connection name (format: `project-id:region:instance-id`)
2. Create a database:
   ```sql
   CREATE DATABASE bridging_talent;
   ```
3. Run migrations (see **Running migrations** below)

## Step 4: Create Cloud Storage Bucket

1. Go to [Cloud Storage](https://console.cloud.google.com/storage)
2. Click "Create Bucket"
3. Configure:
   - Name: `candidate-documents-[your-project-id]`
   - Location type: Region (same as Cloud SQL)
   - Storage class: Standard
   - Access control: Uniform
4. Click "Create"

After creation:
1. Set CORS configuration (for frontend access):
   ```json
   [
     {
       "origin": ["https://tanaw.co"],
       "method": ["GET", "POST", "PUT", "DELETE"],
       "responseHeader": ["Content-Type", "Authorization"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

## Step 5: Set Up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Add your GCP project to Firebase (or create new Firebase project)
3. Go to Authentication > Sign-in method
4. Enable "Email/Password" provider
5. Go to Project Settings > General
6. Copy your Firebase config:
   - API Key
   - Auth Domain
   - Project ID

## Step 6: Create Service Account for Backend

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Name: `bridging-talent-backend`
4. Grant roles:
   - Cloud SQL Client
   - Storage Object Admin
   - Firebase Admin SDK Administrator Service Agent
5. Create and download JSON key
6. Save the key securely (you'll need it for backend `.env`)

## Step 7: Configure Backend Environment

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in the values:
   - `DB_HOST`: Cloud SQL instance IP (from Step 3)
   - `DB_PASSWORD`: Database password
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_PRIVATE_KEY`: From service account JSON (escape newlines)
   - `FIREBASE_CLIENT_EMAIL`: From service account JSON
   - `GCS_BUCKET_NAME`: Bucket name from Step 4
   - `GCS_PROJECT_ID`: Your GCP project ID
   - `CORS_ORIGIN`: Your frontend URL

## Step 8: Configure Frontend Environment

1. Copy `.env.example` to `.env` in the root directory
2. Fill in Firebase config values from Step 5
3. Set `VITE_API_URL` to your Cloud Run URL (after deployment)

## Step 9: Deploy Backend to Cloud Run

1. Build and push Docker image:
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/[PROJECT-ID]/bridging-talent-api
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy bridging-talent-api \
     --image gcr.io/[PROJECT-ID]/bridging-talent-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="DB_HOST=[your-db-host],DB_PASSWORD=[your-db-password],..."
   ```

   Or use Secret Manager for sensitive values:
   ```bash
   # Create secrets
   echo -n "your-db-password" | gcloud secrets create db-password --data-file=-
   
   # Deploy with secrets
   gcloud run deploy bridging-talent-api \
     --image gcr.io/[PROJECT-ID]/bridging-talent-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-secrets="DB_PASSWORD=db-password:latest"
   ```

3. Note the Cloud Run URL and update frontend `.env`

## Step 10: Connect Cloud Run to Cloud SQL

1. Go to your Cloud Run service
2. Click "Edit & Deploy New Revision"
3. Go to "Connections" tab
4. Add Cloud SQL connection (select your instance)
5. Deploy

## Deploy frontend to tanaw.co (Firebase Hosting)

1. **Set production env and build**
   - Ensure root `.env` has `VITE_API_URL=https://YOUR-CLOUD-RUN-URL` (the URL shown after `gcloud run deploy`).
   - Build the frontend:
     ```bash
     npm run build
     ```
   - Output will be in the `dist/` folder.

2. **Install Firebase CLI** (if needed)
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

3. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```
   - The first time, Firebase will create a default Hosting site (e.g. `tanaw-d92d2.web.app`).

4. **Connect custom domain tanaw.co**
   - In [Firebase Console](https://console.firebase.google.com/) → your project → **Hosting**.
   - Click **Add custom domain** → enter `tanaw.co` (and optionally `www.tanaw.co`).
   - Follow the instructions to add the given **A** and **TXT** records at your domain registrar (where you bought tanaw.co).
   - After DNS propagates (up to 24–48 hours), Firebase will provision SSL and your site will be live at https://tanaw.co.

**Alternative (Vercel / Netlify):**  
If you prefer Vercel or Netlify, connect the repo, set **Build command** to `npm run build` and **Output directory** to `dist`. Then add the custom domain in that platform’s dashboard.

## Running migrations

Migrations run in order: `001_initial_schema.sql`, then `002_add_accounts_roles.sql`.

**Local (Cloud SQL via proxy):**

1. Start the Cloud SQL Auth Proxy (in a separate terminal):
   ```bash
   cloud_sql_proxy -instances=YOUR_PROJECT_ID:YOUR_REGION:YOUR_INSTANCE_ID=tcp:5432
   ```
   Replace with your instance connection name (e.g. `my-project:us-central1:bridging-talent-db`).

2. Ensure `backend/.env` has the correct DB config for local:
   - `DB_HOST=127.0.0.1`
   - `DB_PORT=5432`
   - `DB_NAME=bridging_talent`
   - `DB_USER=postgres`
   - `DB_PASSWORD=your-db-password`
   - Do **not** set `INSTANCE_CONNECTION_NAME` for local (that is for Cloud Run only).

3. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

**Docker (Cloud SQL Proxy + migrate):**

1. Add `INSTANCE_CONNECTION_NAME` to `backend/.env` (format: `project:region:instance`). Find it:
   ```bash
   gcloud sql instances describe YOUR_INSTANCE --format='value(connectionName)'
   ```
2. Log in: `gcloud auth application-default login`
3. From project root:
   ```bash
   docker compose -f backend/docker-compose.migrate.yml --profile migrate up
   ```
   The proxy uses your gcloud credentials; the migrate container connects through it.

**Alternative (Cloud SQL Studio / gcloud):**

- Connect to the instance via [Cloud SQL Studio](https://console.cloud.google.com/sql) or `gcloud sql connect INSTANCE --user=postgres --database=bridging_talent`
- Run the SQL in `backend/migrations/001_initial_schema.sql` and `backend/migrations/002_add_accounts_roles.sql` manually.

## Verification

1. Test backend health: `curl https://your-cloud-run-url/health`
2. Test authentication flow in frontend
3. Test profile creation
4. Test document upload

## Troubleshooting

- **Database connection errors**: Check Cloud SQL instance is running and IP is correct
- **Storage upload errors**: Verify service account has Storage Object Admin role
- **Firebase auth errors**: Check Firebase project is linked to GCP project
- **CORS errors**: Verify CORS configuration on Cloud Storage bucket
