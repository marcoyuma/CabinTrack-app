-- 0018_drop_manager_role.sql
-- Collapses the two-tier staff/manager model into a single tier: any row in
-- public.staff has full authority in the admin panel.
--
-- Run EIGHTEENTH, after 0017_admin_new_guests_count.sql.
-- Idempotent: safe to re-run.
--
-- ---------------------------------------------------------------------------
-- Why one tier, not two
-- ---------------------------------------------------------------------------
-- 0014 split staff into 'staff' and 'manager', where the manager tier bought
-- exactly three things: deleting a villa, reading aggregate nationality
-- stats, and exporting guest contacts. For a single-property panel run by a
-- handful of hand-provisioned internal accounts, that split cost more than it
-- bought — every account that was trusted enough to be inserted into
-- public.staff at all was trusted with all three anyway, so the tier only
-- produced dead buttons and functions that silently returned nothing.
--
-- public.staff is now purely a membership list: "is this auth.users id
-- allowed into the admin panel". Authority does not vary within it.
--
-- What this migration does NOT relax:
--   * Non-staff callers still get zero rows from every admin_* function.
--   * The k-anonymity fold in admin_guest_nationality_stats() stays. That is
--     a guest-privacy rule, not an authorization rule — nationality paired
--     with a public review quote can single out one person regardless of who
--     is looking.
--   * admin_export_guests() still writes to admin_export_log. A full contact
--     export that leaves no trace was never acceptable, and widening who may
--     run it makes the log more useful, not less.

-- ---------------------------------------------------------------------------
-- admin_guest_nationality_stats() — now any staff row
-- ---------------------------------------------------------------------------
create or replace function public.admin_guest_nationality_stats()
returns table (nationality text, guest_count bigint)
language sql
security definer
set search_path = public
as $$
    with counts as (
        select g.nationality, count(*) as guest_count
        from public.guests g
        where exists (
            select 1 from public.staff st where st.id = auth.uid()
        )
        group by g.nationality
    )
    select case when guest_count >= 5 then nationality else 'Other' end as nationality,
           sum(guest_count) as guest_count
    from counts
    group by 1;
$$;

revoke all on function public.admin_guest_nationality_stats() from public;
grant execute on function public.admin_guest_nationality_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- admin_export_guests() — now any staff row, still logged
-- ---------------------------------------------------------------------------
-- Still plpgsql rather than sql: the log insert is a side effect the two
-- read-only functions deliberately avoid.
create or replace function public.admin_export_guests()
returns table (
    guest_id            uuid,
    full_name           text,
    phone_country_code  text,
    phone               text,
    nationality         text,
    created_at          timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_count int;
begin
    -- Not an exception: a non-staff caller gets zero rows, the same shape as
    -- the other admin_* functions, rather than an error the admin panel would
    -- have to special-case.
    if not exists (select 1 from public.staff where id = auth.uid()) then
        return;
    end if;

    return query
        select g.id, g.full_name, g.phone_country_code, g.phone,
               g.nationality, g.created_at
        from public.guests g;

    get diagnostics v_count = row_count;

    insert into public.admin_export_log (staff_id, exported_at, row_count)
    values (auth.uid(), now(), v_count);
end;
$$;

revoke all on function public.admin_export_guests() from public;
grant execute on function public.admin_export_guests() to authenticated;

-- ---------------------------------------------------------------------------
-- Drop the column
-- ---------------------------------------------------------------------------
-- Dropped last, so the two functions above no longer reference it by the time
-- it disappears. The check constraint from 0014 goes with the column.
alter table public.staff drop column if exists role;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------

-- The column is gone. Expect exactly: id, display_name, created_at.
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'staff';

-- Neither function mentions 'manager' any more. Expect two rows, both false.
select proname, pg_get_functiondef(oid) ilike '%manager%' as still_mentions_manager
from pg_proc
where proname in ('admin_guest_nationality_stats', 'admin_export_guests');

-- Manual smoke test from a logged-in staff session (NOT the SQL Editor, which
-- runs as the service role and answers differently):
--
-- select count(*) from public.admin_guest_nationality_stats(); -- expect > 0
-- select count(*) from public.admin_export_guests();           -- expect > 0
-- select * from public.admin_export_log order by exported_at desc limit 1;
