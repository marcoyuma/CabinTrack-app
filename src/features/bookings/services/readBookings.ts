import supabase from "../../../supabase/supabase";
import {
    bookingRosterSchema,
    bookingFinancialsSchema,
} from "../../dashboard/types/dashboard.schema";
import { BookingRow } from "../types/booking.types";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Calls admin_booking_roster() and admin_booking_financials() for the same [from, to] range
 * and merges the results by booking_id. Both are security-definer RPCs on the same client
 * (anon key + staff auth session) already used by the dashboard — see
 * ADMIN-PANEL-CONTEXT.md § "Akses baca staff/manager ke data guest". An account without a
 * public.staff row gets 0 rows from both, not an error.
 *
 * Union, not intersection: roster filters by stay-date overlap, financials by created_at, so
 * a booking can legitimately appear in only one of the two for a given range. Rows missing
 * one side are still returned, with those fields left null.
 */
export const readBookings = async (from: Date, to: Date): Promise<BookingRow[]> => {
    const p_from = toDateString(from);
    const p_to = toDateString(to);

    const [rosterResult, financialsResult] = await Promise.all([
        supabase.rpc("admin_booking_roster", { p_from, p_to }),
        supabase.rpc("admin_booking_financials", { p_from, p_to }),
    ]);

    if (rosterResult.error) {
        console.error(rosterResult.error);
        throw new Error("server error, booking roster could not be loaded");
    }
    if (financialsResult.error) {
        console.error(financialsResult.error);
        throw new Error("server error, booking financials could not be loaded");
    }

    const roster = bookingRosterSchema.parse(rosterResult.data);
    const financials = bookingFinancialsSchema.parse(financialsResult.data);

    const rows = new Map<number, BookingRow>();

    for (const entry of roster) {
        rows.set(entry.booking_id, {
            bookingId: entry.booking_id,
            stayName: entry.stay_name,
            guestName: entry.guest_name,
            phoneCountryCode: entry.phone_country_code,
            phone: entry.phone,
            startDate: entry.start_date,
            endDate: entry.end_date,
            status: entry.status,
            numNights: null,
            totalPrice: null,
        });
    }

    for (const entry of financials) {
        const existing = rows.get(entry.booking_id);
        if (existing) {
            existing.numNights = entry.num_nights;
            existing.totalPrice = entry.total_price;
            continue;
        }

        rows.set(entry.booking_id, {
            bookingId: entry.booking_id,
            stayName: entry.stay_name,
            guestName: null,
            phoneCountryCode: null,
            phone: null,
            startDate: entry.start_date,
            endDate: entry.end_date,
            status: entry.status,
            numNights: entry.num_nights,
            totalPrice: entry.total_price,
        });
    }

    return Array.from(rows.values());
};
