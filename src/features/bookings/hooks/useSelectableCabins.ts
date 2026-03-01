import { useQuery } from "@tanstack/react-query";
import { getSelectableCabins } from "./apiBookings";

export function useSelectableCabins({
    checkIn,
    checkOut,
}: {
    checkIn: string;
    checkOut: string;
}) {
    const { data, isPending } = useQuery({
        queryKey: ["selectableCabins", checkIn, checkOut],
        queryFn: () => getSelectableCabins({ checkIn, checkOut }),
    });

    console.log(checkIn);
    console.log(checkOut);
    console.log(data);

    return { data, isPending };
}
