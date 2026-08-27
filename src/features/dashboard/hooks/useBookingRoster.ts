import { useQuery } from "@tanstack/react-query";
import supabase from "../../../supabase/supabase";
import {
    bookingRosterSchema,
    BookingRosterRow,
} from "../types/dashboard.schema";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

// Calls public.admin_booking_roster(p_from, p_to) — a security-definer function, not a
// direct table query. It runs on the SAME client (anon key + the staff's own auth session)
// already used everywhere else in this app; no second Supabase client is needed. A caller
// without a public.staff row gets 0 rows back (not an error) — see
// ADMIN-PANEL-CONTEXT.md § "Akses baca staff/manager ke data guest".
const getBookingRoster = async (
    today: Date,
): Promise<BookingRosterRow[]> => {
    const day = toDateString(today);
    const { data, error } = await supabase.rpc("admin_booking_roster", {
        p_from: day,
        p_to: day,
    });

    if (error) {
        console.error(error);
        throw new Error("server error, booking roster could not be loaded");
    }

    return bookingRosterSchema.parse(data);
};

/**
 * "Today" panel — replaces the now-deleted TodayActivity (which queried `bookings`/`guests`
 * directly, outside admin panel authority). Always today, independent of the
 * DashboardFilter "Last N days" — matches the original behavior, which was never tied to
 * that filter either.
 */
export const useBookingRoster = () => {
    const today = new Date();

    const { isPending, data, error } = useQuery({
        queryKey: ["booking-roster", "today"],
        queryFn: () => getBookingRoster(today),
    });

    return { isPending, roster: data ?? [], error };
};
