import { useQuery } from "@tanstack/react-query";
import supabase from "../../../supabase/supabase";
import { bookingFinancialsSchema } from "../types/dashboard.schema";

// Reuses admin_booking_financials() — the same RPC useBookingFinancials.ts calls scoped to the
// "Last N days" filter — but with an effectively unbounded date range, to get an all-time
// count. Deliberately not a new RPC: this stays a query-shape decision, not a schema change, so
// it doesn't touch the customer-site repo. Separate query key from useBookingFinancials so this
// cache entry never collides with (or gets invalidated alongside) the date-filtered one.
const getTotalBookingsCount = async (): Promise<number> => {
    const { data, error } = await supabase.rpc("admin_booking_financials", {
        p_from: "2000-01-01",
        p_to: new Date().toISOString().slice(0, 10),
    });

    if (error) {
        console.error(error);
        throw new Error("server error, total bookings count could not be loaded");
    }

    return bookingFinancialsSchema.parse(data).length;
};

export function useTotalBookingsCount() {
    const { data: totalBookingsCount, isPending: isTotalBookingsLoading } = useQuery({
        queryKey: ["booking-financials", "all-time"],
        queryFn: getTotalBookingsCount,
    });

    return { totalBookingsCount: totalBookingsCount ?? 0, isTotalBookingsLoading };
}
