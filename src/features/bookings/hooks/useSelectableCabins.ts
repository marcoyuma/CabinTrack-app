import { useQuery } from "@tanstack/react-query";
import { getSelectableCabins, getSpecificBooking } from "./apiBookings";

export function useSelectableCabins() {
    const { data, isPending } = useQuery({
        queryKey: ["selectableCabins"],
        queryFn: getSpecificBooking,
    });
    console.log(data);

    return { data, isPending };
}
