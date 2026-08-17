import { useQuery } from "@tanstack/react-query";
import supabase from "../../../supabase/supabase";
import {
    bookingFinancialsSchema,
    BookingFinancialRow,
} from "../../dashboard/types/dashboard.schema";

const OCCUPIED_BOOKING_STATUSES = ["confirmed", "checked_in"] as const;

const isOccupiedToday = (row: BookingFinancialRow, today: string) =>
    (OCCUPIED_BOOKING_STATUSES as readonly string[]).includes(row.status) &&
    row.start_date <= today &&
    today <= row.end_date;

// admin_booking_financials(p_from, p_to) filters by created_at, not by stay dates — a booking
// for a stay happening today could've been created weeks ago. So "who's staying today" can't be
// answered by passing today as the date range; instead this fetches the same unbounded range as
// useTotalBookingsCount.ts and filters start_date/end_date client-side.
const getStaysOccupancy = async (): Promise<BookingFinancialRow[]> => {
    const { data, error } = await supabase.rpc("admin_booking_financials", {
        p_from: "2000-01-01",
        p_to: new Date().toISOString().slice(0, 10),
    });

    if (error) {
        console.error(error);
        throw new Error("server error, stays occupancy could not be loaded");
    }

    return bookingFinancialsSchema.parse(data);
};

/**
 * Derives today's occupied-villa count from booking financials — there's no "available"/
 * "occupied" column on `stays`, so this is computed, not read. A stay counts as occupied if it
 * has a confirmed/checked_in booking whose date range covers today.
 */
export function useStaysOccupancy() {
    // Own query key, distinct from useTotalBookingsCount's ["booking-financials", "all-time"] —
    // that hook's queryFn resolves to a number (row count), this one to the raw row array.
    // Sharing a key across queryFns with different return shapes corrupts whichever cache entry
    // loses the race, so these must never collide even though both call the same RPC/params.
    const { data: bookingFinancials, isPending: isOccupancyLoading } = useQuery(
        {
            queryKey: ["booking-financials", "occupancy-today"],
            queryFn: getStaysOccupancy,
        },
    );

    const today = new Date().toISOString().slice(0, 10);
    const occupiedStayIds = new Set(
        (bookingFinancials ?? [])
            .filter((row) => isOccupiedToday(row, today))
            .map((row) => row.stay_id),
    );

    return { occupiedCount: occupiedStayIds.size, isOccupancyLoading };
}
