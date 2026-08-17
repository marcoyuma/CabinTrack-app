import { useMemo, useState } from "react";
import { Stay } from "../types/stay.schema";

export type StaySortKey = "name" | "price_per_night" | "capacity" | "created_at";
export type SortDirection = "asc" | "desc";

export interface StayFilters {
    onlyFeatured: boolean;
    onlyNew: boolean;
    priceMin: number | null;
    priceMax: number | null;
    capacityMin: number | null;
    onlyIncomplete: boolean;
}

const DEFAULT_FILTERS: StayFilters = {
    onlyFeatured: false,
    onlyNew: false,
    priceMin: null,
    priceMax: null,
    capacityMin: null,
    onlyIncomplete: false,
};

export const STAY_SORT_OPTIONS: { value: StaySortKey; label: string }[] = [
    { value: "name", label: "Name" },
    { value: "price_per_night", label: "Price per night" },
    { value: "capacity", label: "Capacity" },
    { value: "created_at", label: "Date added" },
];

/**
 * Client-side sort + filter over the already-fetched stays array. Deliberately not backed by
 * URL search params (unlike the old cabins/bookings tables' Filter/SortBy) — useStays() reads
 * the whole catalog unpaginated, and the filter panel here needs several criteria active at
 * once (flag + price range + capacity + completeness), which the existing single-select
 * Filter component wasn't built for. See STAYS-TABLE-DECISIONS.md for the full rationale.
 */
export const useStayTableState = (stays: Stay[], imageCounts: Record<number, number>) => {
    const [sortKey, setSortKey] = useState<StaySortKey>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [filters, setFilters] = useState<StayFilters>(DEFAULT_FILTERS);
    const [search, setSearch] = useState("");

    const toggleSort = (key: StaySortKey) => {
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

        const filtered = stays.filter((stay) => {
            // Matches name or location, so "canggu" finds every villa in that area — the two
            // fields staff actually recognise a villa by.
            if (
                query &&
                !stay.name.toLowerCase().includes(query) &&
                !stay.location.toLowerCase().includes(query)
            )
                return false;
            if (filters.onlyFeatured && !stay.is_featured) return false;
            if (filters.onlyNew && !stay.is_new) return false;
            if (filters.priceMin !== null && stay.price_per_night < filters.priceMin)
                return false;
            if (filters.priceMax !== null && stay.price_per_night > filters.priceMax)
                return false;
            if (filters.capacityMin !== null && stay.capacity < filters.capacityMin)
                return false;
            if (filters.onlyIncomplete && (imageCounts[stay.id] ?? 0) > 0) return false;
            return true;
        });

        const direction = sortDirection === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue) * direction;
            }
            return ((aValue as number) - (bValue as number)) * direction;
        });
    }, [stays, filters, imageCounts, sortKey, sortDirection, search]);

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
