import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth, format } from "date-fns";
import supabase from "../../../supabase/supabase";
import {
    bookingRosterSchema,
    BookingRosterRow,
} from "../types/dashboard.schema";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

// Same admin_booking_roster() RPC as useBookingRoster, but scoped to a whole month instead of
// a single day — one call per visible month is enough to drive both the calendar's "has
// booking" dot indicators and the selected date's list, since the RPC already does start/end
// overlap filtering server-side. See ADMIN-PANEL-CONTEXT.md § "Akses baca staff/manager ke
// data guest".
const getMonthBookingRoster = async (
    monthAnchor: Date,
): Promise<BookingRosterRow[]> => {
    const p_from = toDateString(startOfMonth(monthAnchor));
    const p_to = toDateString(endOfMonth(monthAnchor));
    const { data, error } = await supabase.rpc("admin_booking_roster", {
        p_from,
        p_to,
    });

    if (error) {
        console.error(error);
        throw new Error("server error, booking calendar could not be loaded");
    }

    return bookingRosterSchema.parse(data);
};

export const useMonthBookingRoster = (monthAnchor: Date) => {
    const monthKey = format(monthAnchor, "yyyy-MM");

    const { isPending, data, error } = useQuery({
        queryKey: ["booking-roster", "month", monthKey],
        queryFn: () => getMonthBookingRoster(monthAnchor),
    });

    return { isPending, monthBookings: data ?? [], error };
};
