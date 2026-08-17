import styled from "styled-components";
import { Menus } from "../../../ui/Menus/Menus";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { StayRow } from "./StayRow";
import { StayTableOperations } from "./StayTableOperations";
import { Stay } from "../types/stay.schema";
import {
    SortDirection,
    StayFilters,
    StaySortKey,
} from "../hooks/useStayTableState";
import {
    TableCard,
    TableEmpty,
    TableHeaderBar,
    TableTitle,
    TableToolbar,
} from "./stayTable.styles";

// Clickable header label. No arrow icons by design (explicit request) — the active sort column
// is signalled by color alone, unlike the reference screenshot's per-column up/down arrows.
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

interface StayTableProps {
    stays: Stay[];
    totalCount: number;
    isPending: boolean;
    covers: Record<number, string>;
    imageCounts: Record<number, number>;
    featuredCount: number;
    sortKey: StaySortKey;
    sortDirection: SortDirection;
    onSort: (key: StaySortKey) => void;
    filters: StayFilters;
    onFiltersChange: (filters: StayFilters) => void;
    onResetFilters: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export function StayTable({
    stays,
    totalCount,
    isPending,
    covers,
    imageCounts,
    featuredCount,
    sortKey,
    sortDirection,
    onSort,
    filters,
    onFiltersChange,
    onResetFilters,
    search,
    onSearchChange,
}: StayTableProps) {
    return (
        <TableCard>
            <TableToolbar>
                <TableTitle>Villa Listing</TableTitle>
                <StayTableOperations
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onResetFilters={onResetFilters}
                    search={search}
                    onSearchChange={onSearchChange}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={onSort}
                    featuredCount={featuredCount}
                />
            </TableToolbar>

            <TableHeaderBar>
                <SortableLabel
                    type="button"
                    $active={sortKey === "name"}
                    onClick={() => onSort("name")}
                >
                    Villa Name
                </SortableLabel>
                <SortableLabel
                    type="button"
                    $active={sortKey === "price_per_night"}
                    onClick={() => onSort("price_per_night")}
                >
                    Price
                </SortableLabel>
                <div>Discount</div>
                <SortableLabel
                    type="button"
                    $active={sortKey === "capacity"}
                    onClick={() => onSort("capacity")}
                >
                    Specs
                </SortableLabel>
                <div>Photos</div>
                <div>Status</div>
                <div />
            </TableHeaderBar>

            {isPending ? (
                <Spinner />
            ) : stays.length === 0 ? (
                <TableEmpty>
                    {totalCount === 0
                        ? "No villas yet — add one to get started."
                        : "No villas match the current search or filters."}
                </TableEmpty>
            ) : (
                <Menus>
                    {stays.map((stay) => (
                        <StayRow
                            key={stay.id}
                            stay={stay}
                            coverPath={covers[stay.id]}
                            imageCount={imageCounts[stay.id] ?? 0}
                            featuredCount={featuredCount}
                        />
                    ))}
                </Menus>
            )}
        </TableCard>
    );
}
