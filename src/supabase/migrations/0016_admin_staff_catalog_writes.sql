-- 0016_admin_staff_catalog_writes.sql
-- Write (INSERT/UPDATE/DELETE) RLS policies for the Seaspace catalog tables
-- (stays, stay_images, amenities, stay_amenities), scoped to public.staff.
--
-- Run SIXTEENTH, after 0015_admin_staff_booking_financials.sql.
-- Idempotent: safe to re-run.
--
-- ---------------------------------------------------------------------------
-- Why this exists
-- ---------------------------------------------------------------------------
-- ADMIN-PANEL-WRITE-PATH-PLAN.md settled the architecture question: this admin
-- panel stays a pure SPA using the anon key (no service-role backend), and
-- catalog writes go through RLS policies scoped to public.staff — the same
-- table 0014_admin_staff_access.sql already introduced for scoped guest
-- reads. A real test insert against amenities confirmed these four tables
-- currently have zero write policies (HTTP 401, Postgres 42501) even for an
-- authenticated staff session — this migration is what's missing before the
-- admin panel's first "Add Villa" feature can write anything.
--
-- ---------------------------------------------------------------------------
-- Why INSERT + UPDATE + DELETE together, not just INSERT
-- ---------------------------------------------------------------------------
-- This session only ships Create UI. Granting all three now (rather than
-- INSERT only, then a second migration later for edit/delete) means the next
-- feature session doesn't need another manual migration run in the Supabase
-- SQL editor — the policy shape is identical across all three commands
-- (any authenticated row in public.staff), so there's no meaningful safety
-- benefit to splitting them, only extra manual-run overhead later.
--
-- ---------------------------------------------------------------------------
-- Why `exists (select 1 from public.staff where id = auth.uid())`
-- ---------------------------------------------------------------------------
-- Membership in public.staff is the whole permission model (0018 removed the
-- one tier that ever existed above it): any provisioned staff account may
-- create/edit/delete villas. So the check only needs "is this uid a staff row
-- at all", the same predicate admin_booking_roster() already uses.
--
-- ---------------------------------------------------------------------------
-- Why per-command syntax differs
-- ---------------------------------------------------------------------------
-- Postgres RLS: INSERT policies only support `with check` (there is no
-- existing row to filter with `using` yet). DELETE policies only support
-- `using` (there's nothing to "check" about a row being removed). UPDATE
-- needs both: `using` to select which existing rows may be touched, `with
-- check` to validate the row *after* the update. Getting this wrong either
-- silently permits nothing (missing clause required by the command) or
-- accepts a broken policy Postgres rejects at creation time.

do $$
declare
    tbl text;
begin
    foreach tbl in array array['stays', 'stay_images', 'amenities', 'stay_amenities']
    loop
        execute format('drop policy if exists "staff insert %1$s" on public.%1$s', tbl);
        execute format('drop policy if exists "staff update %1$s" on public.%1$s', tbl);
        execute format('drop policy if exists "staff delete %1$s" on public.%1$s', tbl);

        execute format(
            'create policy "staff insert %1$s" on public.%1$s for insert to authenticated ' ||
            'with check (exists (select 1 from public.staff where id = auth.uid()))',
            tbl
        );
        execute format(
            'create policy "staff update %1$s" on public.%1$s for update to authenticated ' ||
            'using (exists (select 1 from public.staff where id = auth.uid())) ' ||
            'with check (exists (select 1 from public.staff where id = auth.uid()))',
            tbl
        );
        execute format(
            'create policy "staff delete %1$s" on public.%1$s for delete to authenticated ' ||
            'using (exists (select 1 from public.staff where id = auth.uid()))',
            tbl
        );
    end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------

-- Expect 12 rows: 3 policies (insert/update/delete) x 4 tables.
select tablename, policyname, cmd
from pg_policies
where tablename in ('stays', 'stay_images', 'amenities', 'stay_amenities')
  and policyname like 'staff %'
order by tablename, cmd;

-- Manual smoke test once a staff account exists (replace the dummy row's
-- fields as needed; delete it again immediately after this test succeeds —
-- see ADMIN-PANEL-WRITE-PATH-PLAN.md's guardrail on cleaning up test rows):
--
-- insert into public.amenities (slug, label, detail, is_shared)
--   values ('__connectivity_test__', 'test', 'test', false)
--   returning id;
-- -- expect success (a returned id) when run with a staff session's token,
-- -- and still 401/42501 when run with a non-staff authenticated session.
-- delete from public.amenities where slug = '__connectivity_test__';
