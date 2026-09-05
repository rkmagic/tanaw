# Tanaw (Bridging Talent)

A recruitment platform connecting Filipino job seekers with opportunities across Europe. Live product: [tanaw.co](https://tanaw.co).

This repository is a source-available snapshot of the app for portfolio review. It is not an invitation to redeploy the production service.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn-ui + Tailwind CSS
- **Backend**: Node.js + Express (Cloud Run)
- **Database**: PostgreSQL (Cloud SQL)
- **Authentication**: Firebase Authentication
- **Storage**: Google Cloud Storage
- **Deployment**: Google Cloud Platform

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Google Cloud Platform account
- Firebase project

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/` directory (see `backend/.env.example`)

4. Set up the database:
   - Create a Cloud SQL PostgreSQL instance
   - Run the migration: `backend/migrations/001_initial_schema.sql`

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── backend/              # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── config/      # Database, Firebase, Storage config
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
│   ├── migrations/      # Database migrations
│   └── Dockerfile       # Container configuration
├── src/                 # Frontend React app
│   ├── components/     # React components
│   ├── contexts/        # React contexts (Auth, Language)
│   ├── integrations/    # API clients (GCP)
│   └── pages/           # Page components
└── public/              # Static assets
```

## Deployment

### Backend (Cloud Run)

1. Build the Docker image:
```bash
cd backend
docker build -t gcr.io/[PROJECT-ID]/bridging-talent-api .
```

2. Push to Google Container Registry:
```bash
docker push gcr.io/[PROJECT-ID]/bridging-talent-api
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy bridging-talent-api \
  --image gcr.io/[PROJECT-ID]/bridging-talent-api \
  --platform managed \
  --region us-central1
```

### Frontend

Deploy to your preferred hosting service (Firebase Hosting, Vercel, etc.)

## Environment Variables

See `.env.example` files in both root and `backend/` directories for required environment variables.

## License

Copyright (c) 2026. All rights reserved.

Source is published for portfolio review. You may read and study this code. You may not use, copy, modify, or distribute it for any other purpose without prior written permission.
