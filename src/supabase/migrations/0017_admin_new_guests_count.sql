-- 0017_admin_new_guests_count.sql
-- Count-only, PII-free read of how many public.guests signed up in a date range, for the
-- Dashboard "New Customers" stat card.
--
-- Run SEVENTEENTH, after 0016_admin_staff_catalog_writes.sql.
-- Idempotent: safe to re-run.
--
-- ---------------------------------------------------------------------------
-- Why this exists
-- ---------------------------------------------------------------------------
-- ADMIN-PANEL-CONTEXT.md rules out `SELECT * FROM public.guests` from the admin panel under
-- any circumstance, and the three functions 0014_admin_staff_access.sql already introduced
-- (admin_booking_roster, admin_guest_nationality_stats, admin_export_guests) don't fit this
-- job: admin_booking_roster is scoped to booking/stay-date overlap, not guest signup date;
-- admin_guest_nationality_stats and admin_export_guests are manager-only and either aggregate
-- something unrelated (nationality) or return full per-guest PII logged to
-- admin_export_log — using either just to put a number on a dashboard card would be misusing
-- a manager-gated, audited PII export for a job that needs zero PII at all.
--
-- ---------------------------------------------------------------------------
-- Why this is safe where the others aren't a fit
-- ---------------------------------------------------------------------------
-- This function returns a single integer. No name, no phone, no row of any kind ever leaves
-- Postgres — same "function only selects the columns/shape it means to return" pattern as
-- 0014's roster function, just narrowed all the way to a count. Because there's no PII in the
-- response, this does not need the admin_export_log treatment admin_export_guests() has: there
-- is nothing here for that log to meaningfully audit.
--
-- ---------------------------------------------------------------------------
-- Why staff AND manager, not manager-only
-- ---------------------------------------------------------------------------
-- The gate that matters for public.guests is "does this response expose anything a guest would
-- consider private" — a count has nothing to expose, so there's no reason to restrict it past
-- the baseline "is this caller staff at all" check every other staff-facing function uses.

create or replace function public.admin_new_guests_count(p_from date, p_to date)
returns bigint
language sql
security definer
set search_path = public
as $$
    select count(*)
    from public.guests g
    where exists (select 1 from public.staff st where st.id = auth.uid())
      and g.created_at::date >= p_from
      and g.created_at::date <= p_to;
$$;

revoke all on function public.admin_new_guests_count(date, date) from public;
grant execute on function public.admin_new_guests_count(date, date) to authenticated;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------

-- Function exists with the right owner-side security. Expect 1 row, prosecdef = true.
select proname, prosecdef
from pg_proc
where proname = 'admin_new_guests_count';

-- Read the function body and confirm by eye that nothing but count(*) is ever selected —
-- no guest column reaches the return value.
select proname, pg_get_functiondef(oid)
from pg_proc
where proname = 'admin_new_guests_count';

-- Manual smoke test with a staff account's token (not service role):
-- select admin_new_guests_count(current_date - 7, current_date); -- expect a plain integer
-- Manual smoke test with a non-staff authenticated token: expect 0, not an error (mirrors
-- admin_booking_roster's "unauthorized caller gets zero, not an error" behavior).
