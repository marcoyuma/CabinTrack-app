import { useMemo, useState } from "react";
import { BookingRow } from "../types/booking.types";

export type BookingSortKey = "guestName" | "startDate" | "totalPrice";
export type SortDirection = "asc" | "desc";

export const BOOKING_STATUSES = [
    "confirmed",
    "checked_in",
    "checked_out",
    "cancelled",
    "no_show",
] as const;

export interface BookingFilters {
    statuses: Set<string>;
    priceMin: number | null;
    priceMax: number | null;
}

const DEFAULT_FILTERS: BookingFilters = {
    statuses: new Set(),
    priceMin: null,
    priceMax: null,
};

export const BOOKING_SORT_OPTIONS: { value: BookingSortKey; label: string }[] = [
    { value: "startDate", label: "Stay date" },
    { value: "guestName", label: "Guest name" },
    { value: "totalPrice", label: "Total price" },
];

/**
 * Client-side sort + filter over the already-fetched (server date-ranged) bookings array —
 * mirrors useStayTableState.ts. An empty `statuses` set means "no status filter applied", not
 * "match nothing".
 */
export const useBookingTableState = (bookings: BookingRow[]) => {
    const [sortKey, setSortKey] = useState<BookingSortKey>("startDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS);
    const [search, setSearch] = useState("");

    const toggleSort = (key: BookingSortKey) => {
        if (key === sortKey) {
            setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    const sortedFiltered = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = bookings.filter((booking) => {
            if (
                query &&
                !(booking.guestName ?? "").toLowerCase().includes(query) &&
                !booking.stayName.toLowerCase().includes(query)
            )
                return false;
            if (filters.statuses.size > 0 && !filters.statuses.has(booking.status))
                return false;
            if (filters.priceMin !== null) {
                if (booking.totalPrice === null || booking.totalPrice < filters.priceMin)
                    return false;
            }
            if (filters.priceMax !== null) {
                if (booking.totalPrice === null || booking.totalPrice > filters.priceMax)
                    return false;
            }
            return true;
        });

        const direction = sortDirection === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            // Rows missing the sorted field (e.g. totalPrice from a roster-only row) sink to
            // the bottom regardless of sort direction, rather than flip-flopping to the top
            // on descending sort.
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue) * direction;
            }
            return ((aValue as number) - (bValue as number)) * direction;
        });
    }, [bookings, filters, sortKey, sortDirection, search]);

    return {
        sortedFiltered,
        sortKey,
        sortDirection,
        toggleSort,
        filters,
        setFilters,
        resetFilters,
        search,
        setSearch,
    };
};
