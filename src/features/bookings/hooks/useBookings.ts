import { useQuery } from "@tanstack/react-query";
import { readBookings } from "../services/readBookings";

export interface BookingDateRange {
    from: Date;
    to: Date;
}

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Reads bookings for an explicit [from, to] range, unlike the dashboard's "last N days"
 * hooks — this page owns its own date range control (see useBookingTableState/Bookings.tsx),
 * not a shared URL param.
 */
export const useBookings = ({ from, to }: BookingDateRange) => {
    const { isPending, data, error } = useQuery({
        queryKey: ["bookings", toDateString(from), toDateString(to)],
        queryFn: () => readBookings(from, to),
    });

    return { isPending, bookings: data ?? [], error };
};
