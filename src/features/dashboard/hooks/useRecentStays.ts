import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import { getStaysAfterDate } from "../../../services/apiBookings";
import { isConfirmedStays } from "../helpers/isConfirmedStays";

// query hook for get stays data values based on 'last' day params
export function useRecentStays() {
    // get url params instances
    const [params] = useBatchSearchParams();

    // get the 'last' url params value with number 7 as default
    const numDays = !params.get("last") ? 7 : Number(params.get("last"));

    // determine the starting date (N days ago) for filtering records by creation time
    const queryDate = subDays(new Date(), numDays).toISOString();

    // recent bookings data query
    const { data: recentStays, isPending: isRecentStayLoading } = useQuery({
        queryFn: () => getStaysAfterDate(queryDate),
        // save unique query key
        queryKey: ["stays", `last-${numDays}-days`],
    });

    // Type guard that filters stays to include only confirmed ones (checked-in or checked-out)
    const confirmedStays = recentStays?.filter(isConfirmedStays) ?? [];

    return { recentStays, isRecentStayLoading, confirmedStays, numDays };
}
