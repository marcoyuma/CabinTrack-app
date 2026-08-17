import { addDays } from "date-fns";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import { BookingDateRange } from "./useBookings";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

// Default range: today through 30 days out — covers the daily-ops question staff actually
// ask ("who's checking in/out this week"). Older bookings are still reachable by moving the
// Date Range picker back; there's no unpaginated "all bookings" RPC to default to (unlike
// useStays(), which reads the whole villa catalog at once).
const defaultDateRange = (): BookingDateRange => ({
    from: new Date(),
    to: addDays(new Date(), 30),
});

/**
 * Reads/writes the Bookings page's date range as `from`/`to` URL params — same "state lives in
 * the URL, not a shared ancestor" pattern as DashboardFilter's `last` param (see
 * useBookingFinancials.ts). Lets MainNav's BookingDateRangeFilter (outside the routed page
 * tree) and the Bookings page's own data hooks (useBookings, useBookingsOverTime,
 * useTopSellingVillas) stay in sync without lifting state up to a common parent.
 */
export function useBookingDateRangeParam() {
    const [params, setParams] = useBatchSearchParams();

    const fromParam = params.get("from");
    const toParam = params.get("to");
    const fallback = defaultDateRange();

    const dateRange: BookingDateRange = {
        from: fromParam ? new Date(fromParam) : fallback.from,
        to: toParam ? new Date(toParam) : fallback.to,
    };

    const setDateRange = (range: BookingDateRange) => {
        setParams({
            from: toDateString(range.from),
            to: toDateString(range.to),
        });
    };

    return { dateRange, setDateRange };
}
