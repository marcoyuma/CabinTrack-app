import { useMemo, useState } from "react";
import { useBookings, BookingDateRange } from "./useBookings";

export type TopSellingSortKey = "revenue" | "totalBookings";
export type SortDirection = "asc" | "desc";

export interface TopSellingVillaRow {
    stayName: string;
    totalBookings: number;
    revenue: number;
}

export const TOP_SELLING_SORT_OPTIONS: { value: TopSellingSortKey; label: string }[] = [
    { value: "revenue", label: "Revenue generated" },
    { value: "totalBookings", label: "Total bookings" },
];

/**
 * Groups the same bookings shown in BookingsOverTimeChart/BookingTable (same `dateRange`) by
 * stayName, so the leaderboard always reflects whatever range the rest of the page is looking
 * at rather than an independent all-time view. `totalPrice` is null for roster-only rows (see
 * booking.types.ts) and counted as 0 revenue — the booking still counts toward totalBookings.
 */
export function useTopSellingVillas(dateRange: BookingDateRange) {
    const { bookings, isPending } = useBookings(dateRange);
    const [sortKey, setSortKey] = useState<TopSellingSortKey>("revenue");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    // Unlike useBookingTableState's toggleSort, a newly picked key here defaults to "desc" —
    // this is a ranking, so "highest first" is the useful default, not "asc" like a plain list.
    const toggleSort = (key: TopSellingSortKey) => {
        if (key === sortKey) {
            setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("desc");
        }
    };

    const rows = useMemo(() => {
        const byStay = new Map<string, TopSellingVillaRow>();

        for (const booking of bookings) {
            const revenue = booking.totalPrice ?? 0;
            const existing = byStay.get(booking.stayName);

            if (existing) {
                existing.totalBookings += 1;
                existing.revenue += revenue;
            } else {
                byStay.set(booking.stayName, {
                    stayName: booking.stayName,
                    totalBookings: 1,
                    revenue,
                });
            }
        }

        const direction = sortDirection === "asc" ? 1 : -1;
        return [...byStay.values()].sort(
            (a, b) => (a[sortKey] - b[sortKey]) * direction,
        );
    }, [bookings, sortKey, sortDirection]);

    return { rows, isPending, sortKey, sortDirection, toggleSort };
}
