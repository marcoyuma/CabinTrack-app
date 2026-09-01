# Seaspace Admin Panel — Portfolio Breakdown

This document is a detailed technical breakdown of the project, written for portfolio and
interview purposes. It goes deeper than the README: what the app does, why specific technical
choices were made, and what real problems came up while building it. Everything here is drawn
directly from the codebase and from decision-record notes kept alongside it during
development — nothing here is speculative.

## What this project is

Seaspace Admin Panel is the internal, staff-only counterpart to a public villa-booking website
("Seaspace"). The two are **separate repositories that never import from each other** — the
only thing they share is a Supabase project (Postgres + Storage). The customer site is
read-only and public; this admin panel is read-write and gated behind staff login.

The admin panel's job is narrow and deliberately so: manage the villa catalogue — 4 tables
(`stays`, `stay_images`, `amenities`, `stay_amenities`) and one storage bucket (`stays`) — for a
handful of internal staff. It explicitly does **not** create user accounts, guests, or bookings;
those are owned entirely by the customer site's own booking flow. That boundary shows up
throughout the codebase as much as it shows up in the docs — there's no code path anywhere that
writes to `guests`, `reviews`, or `bookings`.

Because both apps hit the same Supabase project, a cross-repo contract had to be written down
somewhere neither team could miss it: table schemas, write authority, the image upload pipeline,
and — critically — a lot of "the database won't stop you from doing this, but it'll break the
customer site if you do" conventions. That contract lives in `ADMIN-PANEL-CONTEXT2.md` at the
root of this repo, and most of the "why" behind decisions below traces back to it.

## Tech stack, and why

| Choice | Why (with evidence) |
|---|---|
| **React 19 + Vite 6**, not Next.js | Documented explicitly in `CLAUDE.md`: the app is internal, sits behind auth, and is never indexed by search engines — so Next.js App Router's main selling points (SSR/ISR, SEO, image optimization for public visitors) don't apply here. Migrating would mean rewriting routing, data-fetching, and `styled-components` (which needs a special registry under React Server Components) for zero functional gain. |
| **`styled-components` v6**, not Tailwind | Explicit repo convention — the customer site uses Tailwind, this one deliberately doesn't, to keep the two codebases' styling approaches from bleeding into each other. |
| **`@tanstack/react-query` v5** for all server state | No global client-state library at all — no Redux, no Zustand. Server state (Supabase data) goes through React Query; the only other state that exists is either local component state or scoped to a specific UI compound-component (see Architecture below). |
| **`react-hook-form` + `zod` + `@hookform/resolvers`** | Every form schema doubles as the TypeScript type via `z.infer<>`, and several schemas deliberately re-implement the *same* constraints as the Postgres tables (see `src/features/stays/types/stay.schema.ts`) — so a bad input is rejected client-side before it ever reaches a Postgres constraint violation. |
| **Anon/publishable Supabase key + RLS**, not a service-role key | This is the single biggest architectural decision in the project's history — see the dedicated section below. |
| **`leaflet` / `react-leaflet`** | Needed for two features: a location picker (drag a pin to correct geocoded coordinates) in the create/edit villa form, and rendering `lat`/`lng` at street-level zoom to match how the customer site renders its own map. |
| **No test framework** | No vitest/jest/cypress/playwright anywhere in the repo. Correctness is enforced by TypeScript strict mode (`tsc -b`) plus a documented set of manual SQL verification queries that must be run before any catalogue write is considered "done" (see `ADMIN-PANEL-CONTEXT2.md § Cara menguji dari sisi Anda`) — a pragmatic trade-off for a small internal tool with no CI pipeline. |

## Architecture & design patterns

### Feature-based folder structure with a consistent internal layering

Every feature under `src/features/{authentication,bookings,check-in-out,dashboard,stays}/`
follows the same internal shape: `services/` → `hooks/` → `types/` → `components/`.

- **`services/*.ts`** — pure Supabase calls (query/RPC/storage). Every service checks
  `{ data, error }` from Supabase, logs the error, and throws a human-readable `Error` rather
  than letting `undefined` leak upward. Example: `src/features/bookings/services/readBookings.ts`
  calls two RPCs in parallel with `Promise.all()` and then validates the *shape* of what comes
  back with a Zod schema (`bookingRosterSchema.parse(...)`) — so a backend schema drift fails
  loudly and immediately instead of silently rendering garbage.
- **`hooks/*.ts`** — wrap the service in `useQuery`/`useMutation`. Multi-step mutations use
  `onSettled` instead of `onSuccess` to invalidate queries — a deliberate choice because those
  mutations can legitimately end in a *partial* state (see the villa-creation challenge below),
  and the cache still needs refreshing either way.
- **`types/*.schema.ts`** — Zod is the single source of truth for both runtime validation and
  the TypeScript type (`z.infer<typeof schema>`). `src/features/stays/types/stay.schema.ts`
  mirrors the actual Postgres constraints (slug regex, lat/lng range, a `.refine()` that
  enforces `discount < price_per_night`) so the same rule is never defined twice and drifting
  out of sync with the database.

### Authorization: RLS as the real boundary, `StaffOnlyRoute` as UX

Routes like `/stays` and `/bookings` are wrapped in `StaffOnlyRoute` (`src/ui/StaffOnlyRoute/`),
which checks a `useIsStaff()` hook and redirects non-staff back to `/dashboard`. The code itself
documents that this is **not** the actual security boundary — it's UX polish so a non-staff user
doesn't even see a page they can't act on. The real boundary is Postgres Row-Level Security:
every write policy on the four catalogue tables checks the logged-in session's `auth.uid()`
against `public.staff`. If someone bypassed the frontend entirely and hit Supabase directly, RLS
still rejects the write.

The permission model is deliberately flat — membership in `public.staff` grants the whole panel.
An earlier two-tier design reserved villa deletion and guest exports for a `manager` role; it was
removed (`0018_drop_manager_role.sql`) because every account trusted enough to be hand-provisioned
into `public.staff` at all was trusted with those operations anyway, so the tier only produced
dead buttons.

The split that remains matters because of *what* it protects against: per the documented
contract, an unauthorized write from RLS returns **zero rows affected, not an error**. That's a
real footgun if you only build the UI-level check — a signed-in non-staff user pressing "Delete"
would see a "successful" operation that silently did nothing. The UI therefore hides the entry
points entirely rather than relying on error handling that will never fire.

### Local, scoped React Context — not a global store

`src/context/` (which held `DarkModeContext`/`DarkModeProvider`) has been removed from the
working tree entirely. What remains are Context instances scoped to individual compound
components — `src/ui/Modal/context/`, `src/ui/Menus/context/`, `src/ui/Table/context/` — used
purely to coordinate a component and its sub-parts (e.g. `Modal.Open` / `Modal.Window`), not to
hold app-wide state. Routing-driven state (filters, pagination) goes through URL search params
via custom hooks like `useBatchSearchParams` and `useURL` instead of Context.

## Best practices, with concrete examples

- **Validation duplicated on purpose, kept in one file.** `stay.schema.ts` re-encodes Postgres
  constraints (`stays_slug_format`, `stays_discount_ok`, lat/lng ranges) as Zod rules, so a
  malformed submission is rejected with a specific, user-facing message instead of a generic
  Postgres constraint-violation error surfacing in the UI.
- **Errors are translated to business language at the boundary, not left as raw Postgres codes.**
  `deleteStay.ts` catches Postgres error code `23503` (a foreign-key violation from
  `bookings_stay_id_fkey`) and turns it into "this villa has a booking and can't be deleted"
  rather than showing the raw constraint name. This directly reflects a rule from
  `ADMIN-PANEL-CONTEXT2.md`: villa deletion being blocked by an existing booking is a **business
  rule**, not a bug to debug every time it appears.
- **Ordering matters for referential integrity that the database won't enforce for you.**
  `deleteStay.ts` reads every `storage_path` for a villa's images, deletes the Storage objects
  first, *then* deletes the `stays` row (which cascades to `stay_images`/`stay_amenities` in the
  DB). Doing it in the opposite order would leave orphaned files in Storage with no database row
  left to know they exist.
- **Access gating enforced in two independent places, deliberately redundant.** UI-level
  (`StaffOnlyRoute` and the nav links both check `useIsStaff()`) and RLS-level
  (`0016_admin_staff_catalog_writes.sql`) — the UI check is explicitly documented as
  defense-in-depth, RLS is the actual enforcement.
- **Client-side vs. server-side filtering chosen based on actual data scale, not habit.** The
  villa table's sort/filter logic (`useStayTableState.ts`) is deliberately plain in-memory
  `.filter()`/`.sort()` rather than reusing the existing `useBatchSearchParams` URL-param
  pattern used by the older booking tables — because there are only a handful of villas total,
  no pagination is needed, and multiple simultaneous filter criteria (flag + price range +
  capacity + "missing photos") would have made reproducing `useBatchSearchParams` for
  multi-criteria filtering more complex than the payoff justifies at this scale.

## Technical trade-offs and their consequences

### RLS-based writes instead of a service-role backend

The single most consequential architectural decision in the project. Originally the plan assumed
the admin panel would run a thin backend server holding a Supabase **service-role key** (which
bypasses all Row-Level Security). It turned out the actual repo is a pure SPA with no backend at
all — the key it holds is the anon/publishable key, decoded from its own JWT payload
(`"role":"anon"`). Putting a service-role key in a browser-shipped SPA bundle would have been a
real security hole: that key is full, RLS-bypassing database access with nowhere safe to hide in
a client bundle.

Two options were weighed: **(A)** grant write access via RLS policies keyed to a `public.staff`
table, using the same anon key + session the app already had, or **(B)** add a thin backend just
to hold the service-role key safely. **A was chosen** because `public.staff` already existed and
had already been validated live for a separate read-only feature (see below), and because B
meant standing up an entire backend for the sole purpose of holding one key that the team was
actively trying to avoid exposing. The result (`0015_staff_catalog_writes.sql`, on the customer
site's repo) is a genuinely simpler system: one Supabase client, one staff session, sufficient
for both reading guest data and writing the catalogue.

**Consequence surfaced by this decision:** unauthorized deletes return 0 rows affected instead of
an error (see Architecture above) — a direct downstream effect of RLS-as-boundary that had to be
handled explicitly in the UI.

### Geocoding: Nominatim was chosen, then overturned for Photon — on policy, not accuracy

The villa location picker needed a "type a place, get coordinates" search box. The first choice
was the Nominatim (OpenStreetMap) Search API, picked specifically because it needs no API key,
account, or billing — matching the reasoning already used for the customer site's map tile
provider (CARTO, chosen for the same no-key/no-billing property).

That choice was **overturned**, not because Nominatim was inaccurate, but because its usage
policy explicitly forbids the exact interaction the UI needed: *"Auto-complete search […] you
must not implement such a service on the client side using the API."* A Nominatim-backed picker
was therefore stuck at press-a-button-and-wait, which was the actual cause of the feature feeling
unusable in its first version — not a UX bug, a policy constraint. The fix was switching to
Photon (komoot), which is also OSM-derived, also keyless, also free, and purpose-built for
search-as-you-type — so the original no-key/no-billing principle survived the swap intact.

Two smaller, related fixes came out of the same investigation:
- **Zoom level was hardcoded to 18 (building-level) for every result**, so searching a whole city
  would zoom to whatever building happened to sit at the city's centroid. Fixed by fitting the
  map to the geocoder result's actual bounding box, capped at zoom 18.
- **Results were not restricted to Indonesia**, so a local place name could lose to an unrelated
  lookalike abroad. Fixed by bounding the search.

### Dropping unvalidated free-text columns instead of adding a warning

Five columns on `stays` (`bed_type_label`, `bed_type_note`, `capacity_label`, `airport_code`,
`airport_city`) were free text, typed by hand, with no relationship enforced to the numbers that
actually mattered. The concrete failure: `capacity_label` could read "4 adults and 2 children"
while the real `capacity` column was `2` — the booking guest-stepper would still cap at 2, so the
detail page's own copy contradicted the booking flow on the same page.

The alternative considered was keeping the free-text field but warning the admin when it didn't
match the real number. That was rejected: a warning is bypassable, and the two values can drift
again the moment someone edits one field and forgets the other. The chosen fix — migration
`0016_stays_drop_unvalidated_fields.sql` — removes the columns outright and renders `capacity`,
`beds`, and `area` directly on the detail page instead. This is a good example of a
drift-elimination strategy over a drift-detection one: removing the second source of truth is
strictly stronger than flagging when it disagrees with the first.

## Technical challenges actually solved

- **`Modal.Open` silently swallowing clicks.** `Modal.Open` (`src/ui/Modal/Modal.tsx`) only
  attaches its click handler when its `children` prop is a *render function*; a plain JSX
  element child renders fine but with no handler attached. An early draft of the villa delete
  button used the plain-element form — it compiled, passed ESLint, rendered visually correct,
  and simply did nothing when clicked. This is exactly the kind of bug that neither `tsc -b` nor
  ESLint can catch, because both forms are structurally valid — it only surfaces by actually
  clicking the button. Fixed by matching the render-function pattern the older `CabinRow`
  component already used correctly.
- **A React Query cache-key collision that returned the wrong shape of data.** Two independent
  hooks (`useTotalBookingsCount` and `useStaysOccupancy`) called the *same* RPC
  (`admin_booking_financials`) with the same parameters, so an early draft gave them the same
  query key on the assumption that React Query would "dedupe" the identical fetch. That
  assumption was wrong: React Query keys its cache purely by `queryKey`, not by `queryFn`. The
  two hooks' `queryFn`s returned different shapes (`number` vs. `BookingFinancialRow[]`), so
  whichever hook populated the cache first silently determined the shape for *both* — and when
  the wrong one won, `(bookingFinancials ?? []).filter(...)` threw `filter is not a function` at
  runtime, with no compile-time warning. Fixed by giving each hook its own distinct key, and the
  incident became a documented rule going forward: never share a query key between hooks unless
  their `queryFn`s genuinely return the same shape — if deduping the request is actually the
  goal, extract one shared hook instead of aliasing keys.
- **A multi-step mutation that can legitimately half-fail.** Creating a villa is a
  create-row → upload-images → attach-amenities sequence (`useCreateStay.ts`). If the image
  upload or amenity-attach step fails after the `stays` row is already committed, there is no
  automatic rollback — the row stays in the database in a genuinely partial state (a villa with
  no photos, which the documented contract says will actually crash the customer-facing detail
  page). This was a deliberate choice, not an oversight: the mutation distinguishes "villa row
  never created" from "villa created but incomplete," and the failure mode is documented rather
  than papered over with a rollback that would need its own failure handling.

## Talking points for an interview

- **Why RLS-only architecture is enough here, and when it wouldn't be.** A pure SPA with no
  backend can be a legitimate, secure architecture *if* every meaningful authorization decision
  can be expressed as a database policy — which was true here because the entire admin surface
  is "can this session write to these four tables." The moment a feature needs logic that can't
  live in a Postgres policy (rate limiting, calling a paid third-party API with a secret,
  orchestrating multiple non-atomic steps with real rollback), that's the point where a thin
  backend becomes necessary again — the project's own docs flag the geocoder integration as
  exactly this kind of borderline case (a public, rate-limited third-party API called from the
  browser, with no secret to protect, so it stayed client-side).
- **Documented conventions that can't be caught by a database constraint at all.** A meaningful
  share of the "villa looks broken" failure modes in this app are things Postgres will happily
  accept: `sort_order` on `stay_images` doesn't need to start at 0 or have no gaps, but if it
  doesn't, the villa's cover photo silently disappears from some UI surfaces (checkout, trip
  cards) while still showing up on others (the listing grid) — because two different consumers
  pick the cover photo two different ways (`min(sort_order)` vs. `sort_order = 0` exactly). This
  is a good example of why "the database accepted my insert" and "the feature works correctly"
  are different claims, and why validating *application-level* conventions (not just DB
  constraints) matters.
- **Choosing deletion over drift-detection as a fix strategy.** The `bed_type_label` /
  `capacity_label` removal (above) is a reusable example of a general principle: when two values
  can independently drift out of sync and a warning is bypassable, removing the redundant one
  is often a stronger fix than validating the relationship between them.
