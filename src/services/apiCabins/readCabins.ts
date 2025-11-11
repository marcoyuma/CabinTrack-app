import supabase from "../../supabase/supabase";
import { DATA_PER_PAGE_SIZE } from "../../utils/constants";
import {
    CabinFilterValue,
    CabinsDataType,
    CabinSortValue,
} from "../../types/cabins.type";

// define get all data from 'cabins' table database
// read cabins function. used in useCabin query function
export const readCabins = async (
    filter: { field: "discount"; value: CabinFilterValue } | null,
    sortBy: CabinSortValue,
    page: number
): Promise<CabinsDataType> => {
    // indexes for getting specific cabins data
        const from = (page - 1) * DATA_PER_PAGE_SIZE;
        const to = from + DATA_PER_PAGE_SIZE - 1;
        console.log(`from: ${from}`);
        console.log(`to: ${to}`);

        // define re-assignable variablel 'query'
        let query = supabase
            .from("cabins")
            .select(
                "id, name, description, discount, image, maxCapacity, regularPrice, created_at",

                // length of the data (supabase feature of counting total rows).
                { count: "exact" }
            )
            .order(sortBy.field, {
                ascending: sortBy.direction === "asc" ? true : false,
            })
            .range(from, to);

        if (filter?.value) {
            query =
                filter.value === "no-discount"
                    ? query.eq(filter.field, 0)
                    : query.gt(filter.field, 0);
            console.log(filter.value);
            console.log("difilter....");
        }
        console.log(`INI ISI FILTER: ${filter}`);
        console.log(`INI ISI FIELD: ${filter?.field}`);
        console.log(`INI ISI VALUE: ${filter?.value}`);

        const { data, error, count } = await query;

        // handle error
        if (error) {
            throw new Error("Cabins data could not be loaded", error);
        }

        // return clean 'cabins' data
    return {
        cabins: parseCabinList(data),
        cabinsLength: parseCabinCount(count),
    };
};
