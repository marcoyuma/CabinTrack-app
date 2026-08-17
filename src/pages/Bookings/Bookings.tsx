import styled, { css } from "styled-components";
import { useBookings } from "../../features/bookings/hooks/useBookings";
import { useBookingDateRangeParam } from "../../features/bookings/hooks/useBookingDateRangeParam";
import { useBookingTableState } from "../../features/bookings/hooks/useBookingTableState";
import { BookingTable } from "../../features/bookings/components/BookingTable";
import { BookingsOverTimeChart } from "../../features/bookings/components/BookingsOverTimeChart";
import { TopSellingVillas } from "../../features/bookings/components/TopSellingVillas";
import { Row } from "../../ui/Row/Row";
import { media } from "../../styles/breakpoints";

// Chart and Top-Selling Villas sit side by side, each taking half the width — matches the
// reference layout's chart/leaderboard pairing. `flex: 1 1 0` (rather than a fixed 50%) keeps
// both halves equal after the gap, and `min-width: 0` lets the chart's ResponsiveContainer
// shrink inside its flex item instead of overflowing. Gap matches the 1.2rem used between
// sibling cards elsewhere (StaysStats, dashboard Stats), not the larger 2.4rem section gap.
// Below desktop, the chart and leaderboard don't have room to shrink side by side without both
// becoming illegible, so they stack full-width instead.
const TopRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & > * {
        min-width: 0;
    }

    ${media.desktop(css`
        flex-direction: row;
        align-items: stretch;

        & > * {
            flex: 1 1 0;
        }
    `)}
`;

export function Bookings() {
    // Date range picker itself lives in MainNav's BookingDateRangeFilter, not on this page —
    // this just reads the same `from`/`to` URL params (see useBookingDateRangeParam.ts).
    const { dateRange } = useBookingDateRangeParam();

    const { bookings, isPending } = useBookings(dateRange);

    const {
        sortedFiltered,
        sortKey,
        sortDirection,
        toggleSort,
        filters,
        setFilters,
        resetFilters,
        search,
        setSearch,
    } = useBookingTableState(bookings);

    return (
        <Row>
            <TopRow>
                <BookingsOverTimeChart dateRange={dateRange} />
                <TopSellingVillas dateRange={dateRange} />
            </TopRow>

            <BookingTable
                bookings={sortedFiltered}
                totalCount={bookings.length}
                isPending={isPending}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
                filters={filters}
                onFiltersChange={setFilters}
                onResetFilters={resetFilters}
                search={search}
                onSearchChange={setSearch}
            />
        </Row>
    );
}
