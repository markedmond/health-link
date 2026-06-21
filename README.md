# STEMMA-JC Health Link

**Barangay Health Record and Vaccination Management System** for Barangay Junob Health Center, Dumaguete City — based on the COSCA capstone document.

## Features

| Module | Description |
|--------|-------------|
| Patient records | Registration, search by name/FSN/phone (≤3s target) |
| Immunization | BCG through MMR, auto next-dose dates, due/overdue lists |
| SMS | Semaphore integration + simulated mode without API key |
| TB monitoring | Phase 1/2 treatment enrollment |
| Pregnancy tracker | Prenatal record creation, postpartum transition API |
| Child growth | WHO-based nutritional classification |
| Newborn screening | RA 9288 48–72 hour compliance flags |
| Dashboard | Stats, Chart.js chart, medicine stock, auto insights |
| DOH reports | One-click monthly PDF (PPI, prenatal, postpartum, TB, FP) |
| QR health card | Public read-only summary page for emergencies |

## Tech stack

- **Frontend:** HTML5, CSS3, JavaScript, Chart.js
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the full script: `supabase/schema.sql`.
3. Copy **Project URL** and **service_role** key (Settings → API).

### 2. Local environment

```bash
cd C:\Users\Lottey\Projects\stemma-jc-healthlink
copy .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=use-a-long-random-string
PUBLIC_APP_URL=http://localhost:3847
SEMAPHORE_API_KEY=          # optional — for real SMS
```

### 3. Install and seed

```bash
npm install
node scripts/seed-admin.js
```

Default login: **admin** / **admin123** (change after first use).

### 4. Run (desktop use)

```bash
npm start
```

Open **http://localhost:3847** on the barangay health center PC. Pin the browser or create a desktop shortcut for daily use.

## Deployment notes

- Core UI and API run locally; only SMS needs internet.
- Set `PUBLIC_APP_URL` to the LAN IP if QR codes should work on phones on the same network (e.g. `http://192.168.1.10:3847`).
- For production, use HTTPS and rotate the default admin password.

## Project structure

```
stemma-jc-healthlink/
├── public/           # Web UI
├── server/           # Express API
├── supabase/         # Database schema
├── scripts/          # Admin seed
└── README.md
```

## Team

Developed for Colegio de Santa Catalina de Alejandria (COSCA) — Barangay Junob, Dumaguete City.

## Modern frontend build (Tailwind + DaisyUI)

This project now supports a modern utility-first UI using Tailwind CSS and DaisyUI components. To build the CSS locally:

```bash
npm install
npm run build:css    # produce public/css/tailwind.css
npm run watch:css    # development watch mode
```

The app will load `public/css/tailwind.css` automatically when present. If you prefer a faster dev server, install `vite` and wire a simple dev proxy.

Notes:
- Styles are authored in `src/styles/tailwind.css` and configured in `tailwind.config.cjs`.
- DaisyUI is included as a Tailwind plugin for ready-made components.

## Client (Vite + React + TypeScript)

A lightweight React + Vite client scaffold was added under the `client/` folder to support an incremental migration to a modern SPA.

Quick start (dev):

```bash
cd client
npm install
npm run dev
```

Build (produces static assets under `public/client` so the Express server can serve them):

```bash
cd client
npm install
npm run build
```

CI: A GitHub Actions workflow has been added at `.github/workflows/build-client.yml` to build the `client/` on pull requests targeting `main`. The workflow uploads the `public/client` build as an artifact named `client-build`.

When ready to switch over, serve `public/client/index.html` (or replace the server root) and ensure `PUBLIC_APP_URL` is updated if needed.

Testing the built client via `/app`

After running the client build (`cd client && npm run build`), the Express server will serve the production SPA at `/app` by returning `public/client/index.html`. The GitHub Actions workflow uploads the same `public/client` folder as an artifact named `client-build` — download it from the workflow run artifacts to reproduce the deployed static files locally.


