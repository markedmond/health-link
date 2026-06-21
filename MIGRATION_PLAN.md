Migration Plan — React + Vite + TypeScript migration

Goal
----
Migrate the existing static front-end in `public/` to a modern React + Vite + TypeScript client with Tailwind + DaisyUI components, while keeping the Express backend unchanged and enabling an incremental migration (page-by-page).

High-level approach
-------------------
1. Scaffold: create a new `client/` Vite project (done).
2. Build output: configure Vite to write production files to `public/client` so the Express server can continue serving static assets without immediate server changes.
3. Incremental migration strategy:
   - Start by building shared primitives: `api` adapter, auth wrapper, layout components, global styles (Tailwind).
   - Migrate pages one at a time: Dashboard → Patients → Vaccination → Consultation → Medicine → others.
   - For each page: port markup to a React component, wire up the existing API endpoints via the adapter, and add unit/integration tests if possible.
4. Integration and switch-over:
   - Once a critical subset of pages is migrated and tested, either:
     a) replace `public/index.html` with the client build index (recommended for full SPA), or
     b) mount the client at `/client` and gradually redirect links (less disruptive).
5. Production considerations:
   - Serve the built `public/client` assets via the Express static middleware (already serves `public/`).
   - Update `PUBLIC_APP_URL` env var if necessary for QR code links.
   - Ensure server-side routes used by the client (API endpoints) remain CORS-friendly when the client is served from a different host.

Developer workflow & PR guidance
-------------------------------
1. Create a feature branch: `feature/migrate-ui-vite`.
2. Commit the scaffold (the `client/` folder) and the `MIGRATION_PLAN.md`.
3. Open a PR describing the incremental plan and which pages will be migrated first.
4. For each migrated page, open a small focused PR: "Migrate Dashboard to React (client/src/pages/Dashboard.tsx)". Keep PRs small and testable.
5. Add CI (optional): run TypeScript checks and eslint, and optionally a quick build step of client.

Rollback and fallback
---------------------
- Keep `public/` as the canonical fallback. The server will continue to serve existing HTML while the client is developed.
- If the client build introduces regressions, revert the PR that replaces the server root index and continue migrating incrementally.

Next immediate tasks I can do for you
------------------------------------
- Wire a basic route in the Express server to serve `public/client/index.html` at `/app` for testing.
- Implement the next migrated page (Patients) in the client as a working example.
- Add a small GitHub Actions workflow to build the client on PRs.
