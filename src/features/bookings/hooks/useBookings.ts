import { useQuery, useQueryClient } from "@tanstack/react-query";
import { readBookings } from "../../../services/apiBookings";
import {
    BookingFilterValue,
    BookingsDataType,
    BookingSortDirectionProperty,
    BookingSortFieldProperty,
    FilterValueType,
} from "../../../types/bookings.type";
import { DATA_PER_PAGE_SIZE } from "../../../shared/utils/constants";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";

// hooks for bookings query
export const useBookings = () => {
    // query client instance
    const queryClient = useQueryClient();

    // get value from url based on specified key
    const [params] = useBatchSearchParams();
    const statusParam = params.get("status");
    const sortByParam = params.get("sortBy");
    const pageParam = params.get("page");

    // filter value by 'status'
    // if 'statusParam' is 'null' or 'all', set 'filter' to null so that all 'bookings' are fetched

    const filter: FilterValueType =
        !statusParam || statusParam === "all"
            ? null
            : {
                  field: "status",
                  value: statusParam as BookingFilterValue,
              };

    // sort value based on url key 'sortedValue' value
    const sortedValue = sortByParam || "startDate-desc";
    const [field, direction] = sortedValue.split("-") as [
        BookingSortFieldProperty,
        BookingSortDirectionProperty
    ];

    // Combine sorting field and direction into a single configuration object
    const sortBy = { field, direction };

    // pagination
    const page = !pageParam ? 1 : Number(pageParam);

    // useQuery from fetch data from 'getBookings' including another dependency in the array so data will refetched when the anything inside is changes
    const { isPending: isBookingsLoading, data } = useQuery({
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => readBookings(filter, sortBy, page),
    });

    // destructuring and validate 'data' properties from possible undefined
    const { bookings, bookingsLength } = (data as BookingsDataType) ?? {
        bookings: [],
        bookingsLength: 0,
    };

    // prefetching next page while on the current page
    const totalPagination = Math.ceil(bookingsLength / DATA_PER_PAGE_SIZE); // total page provided
    // only executed when current page is less than total page preventing prefetching unexisting data
    if (page < totalPagination) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page + 1],
            queryFn: () => readBookings(filter, sortBy, page + 1),
        });
    }

    // prefetch previous page except on the first page
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1],
            queryFn: () => readBookings(filter, sortBy, page - 1),
        });
    }

    return { isBookingsLoading, bookings, bookingsLength };
};
