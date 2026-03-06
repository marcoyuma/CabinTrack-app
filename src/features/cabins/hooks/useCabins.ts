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
import { useEnsureValidPage } from "../../../hooks/useEnsureValidPage";

/**
 * Reads cabin data for the list page based on URL query params.
 *
 * This hook centralizes list behavior for cabins:
 * - builds filter/sort/page from `discount`, `sortBy`, and `page` query params
 * - fetches paginated rows with React Query
 * - keeps `page` valid after data changes (for example after deletion)
 * - prefetches previous/next pages for smoother navigation
 *
 * Returned values:
 * - `isPending`: loading state for the current cabins query
 * - `cabins`: current page rows
 * - `cabinsLength`: total rows matching current filter (used by pagination UI)
 */
export const useCabins = () => {
    // React Query client for manual prefetch calls.
    const queryClient = useQueryClient();

    // Read current table state from URL.
    const [params, setParams] = useBatchSearchParams();
    const discountParam = params.get("discount");
    const sortByParam = params.get("sortBy");
    const pageParams = params.get("page");

    // `discount=all` means no filter.
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

    // Default sort keeps ordering deterministic when URL has no value.
    const sortedValue = sortByParam || "name-asc";
    const [field, direction] = sortedValue.split("-") as [
        CabinSortFieldProperty,
        CabinSortDirectionProperty,
    ];
    const sortBy = { field, direction };

    // URL is source of truth for current page.
    const page = pageParams ? Number(pageParams) : 1;

    // Fetch cabins for current query state.
    const { isPending, data } = useQuery({
        queryKey: ["cabins", filter, sortBy, page],
        queryFn: () => readCabins(filter, sortBy, page),
    });

    // Keep return value stable before first successful fetch.
    const { cabins, cabinsLength } = (data as CabinsDataType) ?? {
        cabins: [],
        cabinsLength: 0,
    };

    // Number of pages based on total rows returned by backend count.
    const totalPagination = Math.ceil(cabinsLength / DATA_PER_PAGE_SIZE);

    // Clamp invalid/out-of-range page values in URL.
    useEnsureValidPage(cabinsLength, page, totalPagination, setParams);

    // Warm next page cache when it exists.
    if (page < totalPagination) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", filter, sortBy, page + 1],
            queryFn: () => readCabins(filter, sortBy, page + 1),
        });
    }

    // Warm previous page cache except on first page.
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["cabins", filter, sortBy, page - 1],
            queryFn: () => readCabins(filter, sortBy, page - 1),
        });
    }

    return { isPending, cabins, cabinsLength };
};
