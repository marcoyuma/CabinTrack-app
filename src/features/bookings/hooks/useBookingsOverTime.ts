import { eachDayOfInterval, format, isSameDay, subMonths } from "date-fns";
import { useBookings, BookingDateRange } from "./useBookings";

export interface BookingsOverTimePoint {
    label: string;
    date: Date;
    booking: number;
    lastMonth: number;
}

/**
 * Daily arrival counts for the current date range, plus the same days one month back as a
 * comparison line ("Last months"). Counted from `startDate` (check-in day) — BookingRow has
 * no `created_at` on this page (see booking.types.ts), so "over time" here means arrivals per
 * day, not bookings placed per day.
 */
export function useBookingsOverTime(dateRange: BookingDateRange) {
    const { bookings, isPending: isCurrentPending } = useBookings(dateRange);

    const previousRange: BookingDateRange = {
        from: subMonths(dateRange.from, 1),
        to: subMonths(dateRange.to, 1),
    };
    const { bookings: previousBookings, isPending: isPreviousPending } =
        useBookings(previousRange);

    const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
    });

    const data: BookingsOverTimePoint[] = days.map((day) => {
        const previousDay = subMonths(day, 1);

        const booking = bookings.filter((row) =>
            isSameDay(new Date(row.startDate), day),
        ).length;

        const lastMonth = previousBookings.filter((row) =>
            isSameDay(new Date(row.startDate), previousDay),
        ).length;

        return { label: format(day, "MMM d"), date: day, booking, lastMonth };
    });

    return { data, isPending: isCurrentPending || isPreviousPending };
}
