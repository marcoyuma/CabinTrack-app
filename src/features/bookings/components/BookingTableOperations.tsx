import { useState } from "react";
import styled, { css } from "styled-components";
import {
    HiOutlineAdjustmentsHorizontal,
    HiOutlineBarsArrowDown,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { Button } from "../../../ui/Button/Button";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import {
    BookingFilters,
    BookingSortKey,
    BOOKING_SORT_OPTIONS,
    BOOKING_STATUSES,
    SortDirection,
} from "../hooks/useBookingTableState";
import { pillStyles } from "./bookingTable.styles";
import { media } from "../../../styles/breakpoints";

// Mirrors src/features/stays/components/StayTableOperations.tsx's styled-components verbatim
// — same search box / pill / panel treatment. Adds a Date Range panel (there's no equivalent
// in Stays, which reads the whole catalog unpaginated); drops the "Add" button, since the
// admin panel has no authority to create bookings.
const Controls = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.2rem;
`;

const SearchBox = styled.div`
    ${pillStyles}
    padding-right: 1.8rem;
    flex: 1 1 16rem;

    & svg {
        width: 1.8rem;
        height: 1.8rem;
        color: var(--color-grey-400);
        flex-shrink: 0;
    }

    & input {
        border: none;
        background: none;
        outline: none;
        width: 100%;
        min-width: 0;
        font-size: 1.4rem;

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: var(--color-grey-400);
        }
    }

    ${media.tablet(css`
        flex: 0 1 auto;

        & input {
            width: 16rem;
        }
    `)}
`;

const Wrapper = styled.div`
    position: relative;
`;

const PillButton = styled.button<{ $active?: boolean }>`
    ${pillStyles}
    cursor: pointer;
    transition: all 0.2s;

    & svg {
        width: 1.7rem;
        height: 1.7rem;
        color: var(--color-grey-400);
    }

    &:hover {
        background-color: var(--color-grey-50);
    }

    ${({ $active }) =>
        $active &&
        css`
            border-color: var(--color-brand-600);
            color: var(--color-brand-600);

            & svg {
                color: var(--color-brand-600);
            }
        `}
`;

const Panel = styled.div`
    position: absolute;
    top: calc(100% + 0.8rem);
    right: 0;
    z-index: 20;
    min-width: 26rem;
    max-width: calc(100vw - 3.2rem);

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
    padding: 1.6rem;

    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`;

const PanelLabel = styled.span`
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
`;

const NumberRow = styled.div`
    display: flex;
    gap: 0.8rem;
`;

const PanelInput = styled.input`
    width: 100%;
    border: 1px solid var(--color-grey-200);
    border-radius: var(--border-radius-sm);
    padding: 0.7rem 1rem;
    font-size: 1.4rem;
`;

const SortOption = styled.button<{ $active: boolean }>`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: var(--border-radius-sm);
    font-size: 1.4rem;
    font-weight: 500;
    color: ${({ $active }) =>
        $active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
    background-color: ${({ $active }) =>
        $active ? "var(--color-brand-50)" : "transparent"};
    cursor: pointer;

    &:hover {
        background-color: ${({ $active }) =>
            $active ? "var(--color-brand-50)" : "var(--color-grey-50)"};
    }
`;

const Divider = styled.div`
    height: 1px;
    background-color: var(--color-grey-100);
`;

const STATUS_LABEL: Record<string, string> = {
    confirmed: "Confirmed",
    checked_in: "Checked in",
    checked_out: "Checked out",
    cancelled: "Cancelled",
    no_show: "No-show",
};

interface BookingTableOperationsProps {
    filters: BookingFilters;
    onFiltersChange: (filters: BookingFilters) => void;
    onResetFilters: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    sortKey: BookingSortKey;
    sortDirection: SortDirection;
    onSort: (key: BookingSortKey) => void;
}

/**
 * Toolbar controls to the right of the table title: search box, Filter popover, and Sort by
 * popover. The date range control used to live here too, but now lives in MainNav's
 * BookingDateRangeFilter (see MainNav.tsx) — the range that's actually sent to
 * admin_booking_roster()/admin_booking_financials() server-side, shared via URL params
 * (useBookingDateRangeParam) instead of being duplicated in this toolbar and the chart header.
 */
export function BookingTableOperations({
    filters,
    onFiltersChange,
    onResetFilters,
    search,
    onSearchChange,
    sortKey,
    sortDirection,
    onSort,
}: BookingTableOperationsProps) {
    const [openPanel, setOpenPanel] = useState<"filter" | "sort" | null>(null);
    const ref = useOutsideClick<HTMLDivElement>(() => setOpenPanel(null), false);

    const update = (patch: Partial<BookingFilters>) =>
        onFiltersChange({ ...filters, ...patch });

    const toggleStatus = (status: string) => {
        const statuses = new Set(filters.statuses);
        if (statuses.has(status)) statuses.delete(status);
        else statuses.add(status);
        update({ statuses });
    };

    const activeFilterCount =
        filters.statuses.size +
        (filters.priceMin !== null ? 1 : 0) +
        (filters.priceMax !== null ? 1 : 0);

    const activeSortLabel = BOOKING_SORT_OPTIONS.find(
        (option) => option.value === sortKey,
    )?.label;

    return (
        <Controls ref={ref}>
            <SearchBox>
                <HiOutlineMagnifyingGlass />
                <input
                    type="text"
                    placeholder="Search bookings…"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </SearchBox>

            <Wrapper>
                <PillButton
                    type="button"
                    $active={activeFilterCount > 0}
                    onClick={() =>
                        setOpenPanel((panel) => (panel === "filter" ? null : "filter"))
                    }
                >
                    <span>
                        Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                    </span>
                    <HiOutlineAdjustmentsHorizontal />
                </PillButton>

                {openPanel === "filter" && (
                    <Panel>
                        <PanelLabel>Status</PanelLabel>
                        {BOOKING_STATUSES.map((status) => (
                            <Checkbox
                                key={status}
                                id={`status-${status}`}
                                checked={filters.statuses.has(status)}
                                onChange={() => toggleStatus(status)}
                            >
                                {STATUS_LABEL[status]}
                            </Checkbox>
                        ))}

                        <Divider />

                        <PanelLabel>Total price (Rp)</PanelLabel>
                        <NumberRow>
                            <PanelInput
                                type="number"
                                placeholder="Min"
                                value={filters.priceMin ?? ""}
                                onChange={(e) =>
                                    update({
                                        priceMin: e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    })
                                }
                            />
                            <PanelInput
                                type="number"
                                placeholder="Max"
                                value={filters.priceMax ?? ""}
                                onChange={(e) =>
                                    update({
                                        priceMax: e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    })
                                }
                            />
                        </NumberRow>

                        <Button
                            variation="secondary"
                            size="small"
                            type="button"
                            onClick={onResetFilters}
                        >
                            Reset filters
                        </Button>
                    </Panel>
                )}
            </Wrapper>

            <Wrapper>
                <PillButton
                    type="button"
                    onClick={() => setOpenPanel((panel) => (panel === "sort" ? null : "sort"))}
                >
                    <span>Sort by</span>
                    <HiOutlineBarsArrowDown />
                </PillButton>

                {openPanel === "sort" && (
                    <Panel>
                        <PanelLabel>
                            Sorted by {activeSortLabel} (
                            {sortDirection === "asc" ? "ascending" : "descending"})
                        </PanelLabel>
                        {BOOKING_SORT_OPTIONS.map((option) => (
                            <SortOption
                                key={option.value}
                                type="button"
                                $active={sortKey === option.value}
                                onClick={() => onSort(option.value)}
                            >
                                {option.label}
                            </SortOption>
                        ))}
                    </Panel>
                )}
            </Wrapper>
        </Controls>
    );
}
