-- 0015_admin_staff_booking_financials.sql
-- Read-only, scoped access into public.bookings financial columns for the admin
-- panel's staff, without adding a raw SELECT policy to the table.
--
-- Run FIFTEENTH, after 0014_admin_staff_access.sql.
-- Idempotent: safe to re-run.
--
-- ---------------------------------------------------------------------------
-- Why this exists
-- ---------------------------------------------------------------------------
-- The admin panel dashboard needs booking counts, revenue, and stay-duration
-- breakdowns filtered by a "last N days" window (filtered on created_at, not
-- the stay's own date range — that's admin_booking_roster()'s job). None of
-- that is financial PII, but a plain RLS SELECT policy on public.bookings
-- would still expose every column of a matching row — including access_code
-- (the self-check-in code: see ADMIN-PANEL-CONTEXT.md, "perlakukan seperti
-- data sensitif ringan") and guest_id. RLS filters ROWS, not COLUMNS, so
-- column-level restriction needs the same tool 0014 already established for
-- guests: a `security definer` function that only ever selects the columns
-- it means to return.
--
-- ---------------------------------------------------------------------------
-- Why filtered by created_at, not start_date/end_date
-- ---------------------------------------------------------------------------
-- admin_booking_roster() answers "who is arriving/departing in this date
-- range" (an operational, forward-looking question). This function answers
-- "how much did we book / how many nights did we sell in the last N days"
-- (a historical, filed-on question) — the same semantics the old
-- getBookingsAfterDate()/getStaysAfterDate() had before the project pointed
-- at the real Seaspace schema. Filtering on created_at is what makes "Last
-- 7/30/90 days" in the dashboard UI mean the same thing it always meant.
--
-- ---------------------------------------------------------------------------
-- Why no guest data
-- ---------------------------------------------------------------------------
-- This function never joins public.guests — it doesn't need to. Revenue and
-- occupancy are per-booking/per-stay numbers; nothing here identifies a
-- guest. Keeping the join out entirely means there's no guest-facing column
-- to accidentally widen later.

create or replace function public.admin_booking_financials(p_from date, p_to date)
returns table (
    booking_id  bigint,
    stay_id     bigint,
    stay_name   text,
    start_date  date,
    end_date    date,
    num_nights  integer,
    total_price integer,
    status      text,
    created_at  timestamptz
)
language sql
security definer
set search_path = public
as $$
    select b.id, s.id, s.name, b.start_date, b.end_date, b.num_nights,
           b.total_price, b.status, b.created_at
    from public.bookings b
    join public.stays s on s.id = b.stay_id
    where exists (select 1 from public.staff st where st.id = auth.uid())
      and b.created_at::date >= p_from
      and b.created_at::date <= p_to
    order by b.created_at;
$$;

revoke all on function public.admin_booking_financials(date, date) from public;
grant execute on function public.admin_booking_financials(date, date) to authenticated;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------

-- Expect one row: admin_booking_financials, prosecdef = true.
select proname, prosecdef
from pg_proc
where proname = 'admin_booking_financials';

-- Read the function body and confirm by eye that neither guest_id,
-- access_code, nor any public.guests column is selected anywhere.
select proname, pg_get_functiondef(oid)
from pg_proc
where proname = 'admin_booking_financials';

-- Manual smoke test (run as an authenticated staff session — a row
-- must already exist in public.staff for the caller, provisioned in 0014):
--
-- select * from public.admin_booking_financials(current_date - 30, current_date);
-- -- A non-staff authenticated caller gets 0 rows, not an error, same as the
-- -- functions in 0014.
