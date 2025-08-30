import { useQuery } from "@tanstack/react-query";
import { readCabins } from "../../../services/apiCabins/readCabins";

// hooks for cabins query
export const useCabins = () => {
    const { isPending, data: cabins } = useQuery({
        // this will uniquely identify this data that we're gonna query. IT NEETS TO BE AN ARRAY
        queryKey: ["cabins"],
        // basically for fetching data from API and must return a promise
        // in this case is we call the async function 'getCabins' and the 'cabins' data from database is fetched and return the promise data
        queryFn: getCabins,
    });
    return { isPending, cabins };
};
