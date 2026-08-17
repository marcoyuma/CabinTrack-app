import { useState } from "react";
import { HiOutlineBarsArrowDown } from "react-icons/hi2";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { formatRupiahCompact } from "../../../shared/utils/helpers";
import { BookingDateRange } from "../hooks/useBookings";
import { TOP_SELLING_SORT_OPTIONS, useTopSellingVillas } from "../hooks/useTopSellingVillas";
import {
    RevenueValue,
    SortOption,
    SortPanel,
    SortPanelLabel,
    SortPillButton,
    SortWrapper,
    TopSellingBody,
    TopSellingCard,
    TopSellingEmpty,
    TopSellingHeader,
    TopSellingHeaderBar,
    TopSellingRow,
    TopSellingTitle,
    VillaName,
} from "./topSellingVillas.styles";

interface TopSellingVillasProps {
    dateRange: BookingDateRange;
}

/**
 * "Top-Selling Villas" leaderboard — sits beside BookingsOverTimeChart at the same
 * half-column width and shares its `dateRange`, so the ranking always reflects whatever range
 * the chart/table below are currently showing rather than an independent all-time view.
 * Layout replicates the reference design (title left, "Sort by" pill right, scrollable rows)
 * with one deliberate deviation: no "Destination" column, since BookingRow doesn't carry a
 * per-booking location (see booking.types.ts) — only `stayName` is available to group by.
 */
export function TopSellingVillas({ dateRange }: TopSellingVillasProps) {
    const { rows, isPending, sortKey, sortDirection, toggleSort } =
        useTopSellingVillas(dateRange);
    const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
    const sortPanelRef = useOutsideClick<HTMLDivElement>(
        () => setIsSortPanelOpen(false),
        false,
    );

    const activeSortLabel = TOP_SELLING_SORT_OPTIONS.find(
        (option) => option.value === sortKey,
    )?.label;

    return (
        <TopSellingCard>
            <TopSellingHeader>
                <TopSellingTitle>Top-Selling Villas</TopSellingTitle>
                <SortWrapper ref={sortPanelRef}>
                    <SortPillButton
                        type="button"
                        onClick={() => setIsSortPanelOpen((open) => !open)}
                    >
                        <span>Sort by</span>
                        <HiOutlineBarsArrowDown />
                    </SortPillButton>

                    {isSortPanelOpen && (
                        <SortPanel>
                            <SortPanelLabel>
                                Sorted by {activeSortLabel} (
                                {sortDirection === "asc" ? "ascending" : "descending"})
                            </SortPanelLabel>
                            {TOP_SELLING_SORT_OPTIONS.map((option) => (
                                <SortOption
                                    key={option.value}
                                    type="button"
                                    $active={sortKey === option.value}
                                    onClick={() => toggleSort(option.value)}
                                >
                                    {option.label}
                                </SortOption>
                            ))}
                        </SortPanel>
                    )}
                </SortWrapper>
            </TopSellingHeader>

            <TopSellingHeaderBar>
                <span>Villa</span>
                <span>Total Bookings</span>
                <span>Revenue Generated</span>
            </TopSellingHeaderBar>

            {isPending ? (
                <Spinner />
            ) : rows.length === 0 ? (
                <TopSellingEmpty>No bookings in this date range.</TopSellingEmpty>
            ) : (
                <TopSellingBody>
                    {rows.map((row) => (
                        <TopSellingRow key={row.stayName}>
                            <VillaName title={row.stayName}>{row.stayName}</VillaName>
                            <span>{row.totalBookings}</span>
                            <RevenueValue>{formatRupiahCompact(row.revenue)}</RevenueValue>
                        </TopSellingRow>
                    ))}
                </TopSellingBody>
            )}
        </TopSellingCard>
    );
}
