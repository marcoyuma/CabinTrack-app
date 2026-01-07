import { subDays } from "date-fns";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import { useQuery } from "@tanstack/react-query";
import { getBookingsAfterDate } from "../../../services/apiBookings";

// query hook for get booking values based on 'last' day params
export function useRecentBookings() {
    // get url params instances
    const [params] = useBatchSearchParams();

    // get the 'last' url params value with number 7 as default
    const numDays = !params.get("last") ? 7 : Number(params.get("last"));

    // determine the starting date (N days ago) for filtering records by creation time
    const queryDate = subDays(new Date(), numDays).toISOString();

    // recent bookings data query
    const { data: recentBookings, isPending: isRecentBookingLoading } =
        useQuery({
            queryFn: () => getBookingsAfterDate(queryDate),
            // save unique query key
            queryKey: ["bookings", `last-${numDays}-days`],
        });

    return { recentBookings, isRecentBookingLoading };
}
