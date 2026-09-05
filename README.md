# Tanaw

**Acting CTO · product and platform**

[tanaw.co](https://tanaw.co) is a hiring platform for blue-collar workers moving from the Philippines into European roles. I led product and engineering as acting CTO: what we build, in what order, and how the system holds together.

This repo is a source-available snapshot for portfolio review. It is not a license to redeploy the production service.

## The problem

International hiring for skilled trades and service work is still a paper process. Workers struggle to:

- **Get documents right** — IDs, resumes, medicals, and certificates in the form agencies and employers actually accept
- **Find the right role** — openings exist, but matching is informal and workers cannot see what they qualify for
- **Move through immigration** — visa and compliance steps sit outside the hiring flow, so candidates stall after they are “selected”

Agencies and employers inherit that mess: incomplete files, unclear status, and weeks of back-and-forth before anyone can start.

## What we are building

Tanaw is the operating system for that journey — one place for the worker, the agency, and the employer.

| For workers | For agencies and employers |
| --- | --- |
| Conversational intake instead of a 20-field form | Shared candidate profiles with document status |
| Guided document collection (ID, resume, medical, credentials) | Role-based dashboards to review and verify files |
| Bilingual English / Tagalog so the product is usable, not just translated | Employer and admin views for pipeline and compliance |

The product thesis: if document readiness, role fit, and immigration steps live in one workflow, time-to-hire drops and fewer candidates fall out of the process.

## Product surfaces

- **Marketing site** — positioning for workers and European employers
- **Job-seeker chat onboarding** — collect work history and intent through a conversation, then create an account
- **Candidate dashboard** — profile and document submission with agency follow-up
- **Agency / employer / admin dashboards** — review candidates, documents, and roles
- **Public profile** — shareable candidate view

## How I approached it as acting CTO

- **Start from the worker constraint.** Forms fail this audience. Intake is a chat; language is English and Tagalog from day one.
- **Treat documents as the product.** Uploads, verification status, and agency review are first-class — not an afterthought on a profile page.
- **Separate concerns for production.** Firebase Auth for identity, PostgreSQL for profiles and roles, Cloud Storage for sensitive files, Cloud Run for the API. Secrets stay in env / Secret Manager, not in the app.
- **Ship a real multi-sided system.** Candidate, agency, employer, and admin are different products on the same data model, not one dashboard with a flag.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind, shadcn/ui |
| API | Node.js, Express, TypeScript |
| Auth | Firebase Authentication + Admin SDK |
| Data | PostgreSQL on Cloud SQL |
| Files | Google Cloud Storage |
| Hosting | Firebase Hosting (web), Cloud Run (API) |

## Local setup

**Frontend** — Node.js 20+, then:

```bash
npm install
```

Copy `.env.example` to `.env` and set Firebase plus `VITE_API_URL` (default `http://localhost:8080`). Then `npm run dev`.

**Backend** — from `backend/`:

```bash
npm install
```

Copy `backend/.env.example` to `backend/.env`, point it at PostgreSQL, and run `backend/migrations/001_initial_schema.sql` (then `002_add_accounts_roles.sql`). Then `npm run dev`.

Full GCP walkthrough: [GCP_SETUP.md](GCP_SETUP.md). Environment variable lists live in the `.env.example` files.

## License

Copyright (c) 2026. All rights reserved.

Source is published for portfolio review. You may read and study this code. You may not use, copy, modify, or distribute it for any other purpose without prior written permission.
