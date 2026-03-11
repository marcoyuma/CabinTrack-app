import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readBookings } from "./apiBookings";
import {
    BookingFilterValue,
    BookingsDataType,
    BookingSortDirectionProperty,
    BookingSortFieldProperty,
    FilterValueType,
} from "../../../types/bookings.type";
import { DATA_PER_PAGE_SIZE } from "../../../shared/utils/constants";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import { useEnsureValidPage } from "../../../hooks/useEnsureValidPage";

/**
 * Reads booking data for the bookings table based on URL query params.
 *
 * This hook centralizes list behavior for bookings:
 * - builds filter/sort/page from `status`, `sortBy`, and `page` query params
 * - fetches paginated rows with React Query
 * - keeps `page` valid when total rows change
 * - prefetches previous/next pages for faster navigation
 *
 * Returned values:
 * - `isBookingsLoading`: loading state for current bookings query
 * - `bookings`: current page rows
 * - `bookingsLength`: total rows matching active filter (for pagination)
 */
export const useBookings = () => {
    // React Query client for manual prefetch calls.
    const queryClient = useQueryClient();

    // Read current table state from URL.
    const [params, setParams] = useBatchSearchParams();
    const statusParam = params.get("status");
    const sortByParam = params.get("sortBy");
    const pageParam = params.get("page");

    // `status=all` (or missing) means no status filter.
    const filter: FilterValueType =
        !statusParam || statusParam === "all"
            ? null
            : {
                  field: "status",
                  value: statusParam as BookingFilterValue,
              };

    // Default sort keeps ordering deterministic when URL has no value.
    const sortedValue = sortByParam || "startDate-asc";
    const [field, direction] = sortedValue.split("-") as [
        BookingSortFieldProperty,
        BookingSortDirectionProperty,
    ];

    // React Query key and API both use this normalized sort object.
    const sortBy = { field, direction };
    console.log(field);
    console.log(direction);

    // URL is source of truth for current page.
    const page = !pageParam ? 1 : Number(pageParam);

    // Fetch bookings for current query state.
    const { isPending: isBookingsLoading, data } = useQuery({
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => readBookings(filter, sortBy, page),
    });

    // Keep return value stable before first successful fetch.
    const { bookings, bookingsLength } = (data as BookingsDataType) ?? {
        bookings: [],
        bookingsLength: 0,
    };

    // Number of pages based on total rows returned by backend count.
    const totalPagination = Math.ceil(bookingsLength / DATA_PER_PAGE_SIZE);

    // Clamp invalid/out-of-range page values in URL.
    useEnsureValidPage(bookingsLength, page, totalPagination, setParams);

    // Warm next page cache when it exists.
    if (page < totalPagination) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page + 1],
            queryFn: () => readBookings(filter, sortBy, page + 1),
        });
    }

    // Warm previous page cache except on first page.
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1],
            queryFn: () => readBookings(filter, sortBy, page - 1),
        });
    }

    console.log(bookingsLength);

    return { isBookingsLoading, bookings, bookingsLength };
};
