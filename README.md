# Seaspace Admin Panel

Internal admin panel for managing the villa catalogue behind the **Seaspace** villa-booking
site. It's a staff-only tool — not a customer-facing product — used to create and edit villas,
upload and manage their photos, manage shared and per-villa amenities, and review bookings and
guest activity. It talks to the same Supabase project as the public booking site, but the two
are entirely separate codebases connected only through the database.

> A deeper technical write-up — architecture decisions, trade-offs, and the reasoning behind
> them — lives in [`PORTFOLIO-BREAKDOWN.md`](./PORTFOLIO-BREAKDOWN.md).

## Tech stack

- **React 19** + **TypeScript** (strict mode) — single-page app, no server/SSR runtime
- **Vite 6** (`@vitejs/plugin-react-swc`) — build tool
- **react-router-dom v7** — data router (`createBrowserRouter`)
- **@tanstack/react-query v5** — server-state management and caching
- **styled-components v6** — styling
- **react-hook-form + zod** — forms and validation
- **Supabase** (`@supabase/supabase-js`) — Postgres database, Auth, and Storage, accessed with
  the anon/publishable key plus a logged-in staff session (Row-Level Security enforces write
  access — see `ADMIN-PANEL-CONTEXT2.md` for the full contract)
- **react-leaflet** — interactive map for setting a villa's location
- **recharts** — dashboard charts
- **react-hot-toast**, **react-error-boundary** — feedback and error handling

## Features

- **Dashboard** — booking stats, occupancy snapshot, and sales/bookings charts
- **Stays (villa catalogue)** — create and edit villas, upload and manage photos (with an
  automatic image pipeline: resize, EXIF-safe rotation, WebP encoding, blur placeholder
  generation), pick a location via place search + draggable map pin, manage amenities, sort and
  filter the villa list
- **Bookings** — table of guest bookings with sort/filter and financial summaries
- **Check-in / Check-out** — guest check-in flow
- **Account** — staff profile, avatar, password management
- **Role-based access** — `staff` can create/edit; only `manager` can delete a villa or an
  amenity (enforced by database policy, not just the UI)

## Project structure

```
src/
├── features/            # feature-based modules: authentication, bookings,
│                         # check-in-out, dashboard, stays — each with its own
│                         # components/, hooks/, services/, types/
├── pages/                # route-level components (Dashboard, Bookings, Stays, Checkin, ...)
├── ui/                   # generic, cross-feature UI components (Modal, Table, Menus, ...)
├── hooks/                # generic cross-feature hooks
├── shared/utils/         # generic utilities
├── styles/               # global styles, breakpoints
└── supabase/             # Supabase client + generated database types + migrations
```

Each feature module follows the same internal layering: `services/` (Supabase calls) →
`hooks/` (React Query wrappers) → `types/` (Zod schemas as the single source of truth for
validation and TypeScript types) → `components/`.

## Getting started

### Prerequisites

- Node.js and npm
- A Supabase project with the `stays` / `stay_images` / `amenities` / `stay_amenities` schema
  and a `public.staff` row for the account you'll log in with

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file at the project root (there is no `.env.example` in the repo yet):

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

`VITE_SUPABASE_KEY` is the **anon/publishable key**, not the service-role key — write access is
granted through Row-Level Security policies tied to a logged-in staff session, not through a
privileged key. See `ADMIN-PANEL-CONTEXT2.md` for why.

### Run

```bash
npm run dev       # start the dev server
npm run build     # type-check (tsc -b) and build for production
npm run lint      # run ESLint
npm run preview   # preview a production build locally
```

## Testing

There is currently no automated test suite (no vitest/jest/testing-library/cypress/playwright).
Correctness is checked with TypeScript strict mode and ESLint. Database-write changes are
verified manually with a set of SQL queries documented in `ADMIN-PANEL-CONTEXT2.md` (e.g.
confirming every villa has a cover image, no duplicate `alt` text within a villa, every new
villa got its shared amenities).

## Deployment

Not deployed yet — no CI/CD pipeline or hosting configuration exists in this repo at the
moment. This section will be filled in with the actual hosting setup once deployment is
finished.

## Screenshots

<!-- TODO: add screenshots/demo once available -->

## License

Internal project — not currently published under an open-source license.
