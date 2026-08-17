import styled from "styled-components";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { BookingRow as BookingRowComponent } from "./BookingRow";
import { BookingTableOperations } from "./BookingTableOperations";
import { BookingRow as BookingRowData } from "../types/booking.types";
import {
    BookingFilters,
    BookingSortKey,
    SortDirection,
} from "../hooks/useBookingTableState";
import {
    TableCard,
    TableCount,
    TableEmpty,
    TableHeaderBar,
    TableTitle,
    TableTitleGroup,
    TableToolbar,
} from "./bookingTable.styles";

// Mirrors src/features/stays/components/StayTable.tsx — same clickable-header pattern
// (color-only active state, no arrow icons), same card/toolbar/header structure. No Menus
// wrapper around the row list: unlike StayRow, BookingRow has no per-row dropdown menu, since
// the admin panel has no write access to bookings.
const SortableLabel = styled.button<{ $active: boolean }>`
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    text-align: left;
    cursor: pointer;
    color: ${({ $active }) => ($active ? "var(--color-brand-600)" : "inherit")};

    &:hover {
        color: var(--color-brand-600);
    }
`;

interface BookingTableProps {
    bookings: BookingRowData[];
    totalCount: number;
    isPending: boolean;
    sortKey: BookingSortKey;
    sortDirection: SortDirection;
    onSort: (key: BookingSortKey) => void;
    filters: BookingFilters;
    onFiltersChange: (filters: BookingFilters) => void;
    onResetFilters: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export function BookingTable({
    bookings,
    totalCount,
    isPending,
    sortKey,
    sortDirection,
    onSort,
    filters,
    onFiltersChange,
    onResetFilters,
    search,
    onSearchChange,
}: BookingTableProps) {
    return (
        <TableCard>
            <TableToolbar>
                <TableTitleGroup>
                    <TableTitle>Booking List</TableTitle>
                    <TableCount>
                        {totalCount} {totalCount === 1 ? "booking" : "bookings"}
                    </TableCount>
                </TableTitleGroup>
                <BookingTableOperations
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onResetFilters={onResetFilters}
                    search={search}
                    onSearchChange={onSearchChange}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={onSort}
                />
            </TableToolbar>

            <TableHeaderBar>
                <SortableLabel
                    type="button"
                    $active={sortKey === "guestName"}
                    onClick={() => onSort("guestName")}
                >
                    Guest
                </SortableLabel>
                <div>Villa</div>
                <SortableLabel
                    type="button"
                    $active={sortKey === "startDate"}
                    onClick={() => onSort("startDate")}
                >
                    Stay Dates
                </SortableLabel>
                <div>Nights</div>
                <SortableLabel
                    type="button"
                    $active={sortKey === "totalPrice"}
                    onClick={() => onSort("totalPrice")}
                >
                    Total Price
                </SortableLabel>
                <div>Status</div>
            </TableHeaderBar>

            {isPending ? (
                <Spinner />
            ) : bookings.length === 0 ? (
                <TableEmpty>
                    {totalCount === 0
                        ? "No bookings in this date range."
                        : "No bookings match the current search or filters."}
                </TableEmpty>
            ) : (
                bookings.map((booking) => (
                    <BookingRowComponent key={booking.bookingId} booking={booking} />
                ))
            )}
        </TableCard>
    );
}
