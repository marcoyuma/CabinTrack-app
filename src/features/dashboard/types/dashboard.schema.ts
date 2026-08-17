import z from "zod";
import { safeString } from "../../../shared/utils/helpers";

// Return shape of public.admin_booking_roster(p_from, p_to) — see
// ADMIN-PANEL-CONTEXT.md § "Akses baca staff/manager ke data guest". Deliberately does NOT
// include total_price/num_nights/nationality/avatar_path.
export const bookingRosterRowSchema = z.object({
    booking_id: z.number(),
    stay_name: z.string(),
    guest_name: z.string(),
    phone_country_code: z.string().nullable(),
    phone: z.string().nullable(),
    start_date: z.string(),
    end_date: z.string(),
    status: safeString("unknown"),
});

export type BookingRosterRow = z.infer<typeof bookingRosterRowSchema>;

export const bookingRosterSchema = z.array(bookingRosterRowSchema);

// Return shape of public.admin_booking_financials(p_from, p_to) — see
// 0015_admin_staff_booking_financials.sql. Filtered by created_at, never joins
// public.guests. Feeds Stats/SalesChart/DurationChart (restored to their original meaning,
// just re-sourced from the Seaspace schema).
export const bookingFinancialRowSchema = z.object({
    booking_id: z.number(),
    stay_id: z.number(),
    stay_name: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    num_nights: z.number(),
    total_price: z.number(),
    status: safeString("unknown"),
    created_at: z.string(),
});

export type BookingFinancialRow = z.infer<typeof bookingFinancialRowSchema>;

export const bookingFinancialsSchema = z.array(bookingFinancialRowSchema);

// Booking statuses that count as an actual stay (arrived at least once) — mirrors the old
// "checked-in"/"checked-out" concept, now against the real Seaspace status vocabulary
// (confirmed | checked_in | checked_out | cancelled | no_show — see
// ADMIN-PANEL-CONTEXT.md § "public.bookings").
export const CONFIRMED_STAY_STATUSES = ["checked_in", "checked_out"] as const;

export const isConfirmedStay = (row: BookingFinancialRow) =>
    (CONFIRMED_STAY_STATUSES as readonly string[]).includes(row.status);

// "All time" (DashboardFilter's `last=all`) resolves to a fixed lookback instead of an
// unbounded range — keeps the per-day Sales chart and date-range RPCs bounded to a sane size.
export const ALL_TIME_LOOKBACK_DAYS = 3650;

export function resolveNumDays(lastParam: string | null): number {
    if (!lastParam) return 7;
    if (lastParam === "all") return ALL_TIME_LOOKBACK_DAYS;
    return Number(lastParam);
}
