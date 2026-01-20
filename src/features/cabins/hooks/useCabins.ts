/**
 * Custom React Query hook to fetch cabins with filtering, sorting, pagination,
 * and prefetching for smoother navigation and up-to-date UI state
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import { readCabins } from "../../../services/apiCabins/readCabins";
import {
    CabinFilterValue,
    CabinSortDirectionProperty,
    CabinSortFieldProperty,
} from "../types/cabin.ui.types";

import { DATA_PER_PAGE_SIZE } from "../../../shared/utils/constants";
import { CabinsDataType } from "../types/cabin.schema";

// hooks for cabins query
export const useCabins = () => {
    // query client instance
    const queryClient = useQueryClient();

    // params for filtering purpose
    const [params] = useBatchSearchParams();
    const discountParam = params.get("discount");
    const sortByParam = params.get("sortBy");
    const pageParams = params.get("page");

    // dynamic filter value
    const filter =
        discountParam === "all"
            ? null
            : ({
                  field: "discount",
                  value: discountParam ?? undefined,
              } as {
                  field: "discount";
                  value: CabinFilterValue;
              });

    // dynamic sortBy value
    const sortedValue = sortByParam || "name-asc";
    const [field, direction] = sortedValue.split("-") as [
        CabinSortFieldProperty,
        CabinSortDirectionProperty
    ];
    const sortBy = { field, direction };

    // pagination
    const page = pageParams ? Number(pageParams) : 1;

    // query
    const { isPending, data } = useQuery({
        queryKey: ["cabins", filter, sortBy, page],
        queryFn: () => readCabins(filter, sortBy, page),
    });

    // safely extract cabins data
    const { cabins, cabinsLength } = (data as CabinsDataType) ?? {
        cabins: [],
        cabinsLength: 0,
    };

    // prefetch next page
    const totalPagination = Math.ceil(cabinsLength / DATA_PER_PAGE_SIZE);
    if (page < totalPagination) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", filter, sortBy, page + 1],
            queryFn: () => readCabins(filter, sortBy, page + 1),
        });
    }

    // prefetch previous page
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", filter, sortBy, page - 1],
            queryFn: () => readCabins(filter, sortBy, page - 1),
        });
    }

    return { isPending, cabins, cabinsLength };
};
