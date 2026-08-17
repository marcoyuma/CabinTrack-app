import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import supabase from "../../../supabase/supabase";
import {
    bookingFinancialsSchema,
    BookingFinancialRow,
    resolveNumDays,
} from "../types/dashboard.schema";

// Calls public.admin_booking_financials(p_from, p_to) — a security-definer function, same
// client (anon key + staff auth session) as everywhere else. Filtered by created_at, so
// "Last N days" means the same thing it always meant with the old getBookingsAfterDate.
const getBookingFinancials = async (
    from: Date,
    to: Date,
): Promise<BookingFinancialRow[]> => {
    const { data, error } = await supabase.rpc("admin_booking_financials", {
        p_from: from.toISOString().slice(0, 10),
        p_to: to.toISOString().slice(0, 10),
    });

    if (error) {
        console.error(error);
        throw new Error(
            "server error, booking financials could not be loaded",
        );
    }

    return bookingFinancialsSchema.parse(data);
};

/**
 * Replaces the old useRecentBookings + useRecentStays (both queried `bookings` directly,
 * outside admin panel authority). Same "last N days" URL-param contract
 * (`DashboardFilter`/`last`), one query instead of two — the new function returns
 * total_price + num_nights + status together.
 */
export function useBookingFinancials() {
    const [params] = useBatchSearchParams();
    const numDays = resolveNumDays(params.get("last"));

    const to = new Date();
    const from = subDays(to, numDays);

    const { data: bookingFinancials, isPending: isBookingFinancialsLoading } =
        useQuery({
            queryKey: ["booking-financials", `last-${numDays}-days`],
            queryFn: () => getBookingFinancials(from, to),
        });

    return { bookingFinancials, isBookingFinancialsLoading, numDays };
}
