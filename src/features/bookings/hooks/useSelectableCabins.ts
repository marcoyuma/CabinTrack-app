import { useQuery } from "@tanstack/react-query";
import { getSelectableCabins } from "./apiBookings";

// Input parameters used to filter available cabins.
type UseSelectableCabinsParams = {
    checkIn: string;
    checkOut: string;
    guests: number;
};

/**
 * Fetches cabins that are available for a selected date range and guest count.
 *
 * @param params - Hook parameters.
 * @param params.checkIn - Selected check-in date.
 * @param params.checkOut - Selected check-out date.
 * @param params.guests - Number of guests used for capacity filtering.
 * @returns Query result and loading state.
 */
export function useSelectableCabins({
    checkIn,
    checkOut,
    guests,
}: UseSelectableCabinsParams) {
    // Run a react-query request keyed by date range and guest count.
    const { data: selectableCabins, isPending: isSelectingCabins } = useQuery({
        queryKey: ["selectableCabins", checkIn, checkOut, guests],
        queryFn: () => getSelectableCabins({ checkIn, checkOut, guests }),
    });

    // Expose fetched cabins and loading state to consumers.
    return { selectableCabins, isSelectingCabins };
}
