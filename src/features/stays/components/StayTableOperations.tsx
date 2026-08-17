import { useState } from "react";
import styled, { css } from "styled-components";
import {
    HiOutlineAdjustmentsHorizontal,
    HiOutlineBarsArrowDown,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { Button } from "../../../ui/Button/Button";
import { Modal } from "../../../ui/Modal/Modal";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import {
    SortDirection,
    StayFilters,
    StaySortKey,
    STAY_SORT_OPTIONS,
} from "../hooks/useStayTableState";
import { CreateStayForm } from "./CreateStayForm";
import { pillStyles } from "./stayTable.styles";
import { media } from "../../../styles/breakpoints";

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

// Matches the pill radius of the Filter/Sort by buttons next to it — Button's default
// border-radius-sm otherwise makes this one look boxier than its neighbors.
const AddStayButton = styled(Button)`
    border-radius: 9999px;
`;

interface StayTableOperationsProps {
    filters: StayFilters;
    onFiltersChange: (filters: StayFilters) => void;
    onResetFilters: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    sortKey: StaySortKey;
    sortDirection: SortDirection;
    onSort: (key: StaySortKey) => void;
    featuredCount: number;
}

/**
 * Toolbar controls that sit to the right of the table title: search box, Filter popover,
 * Sort by popover, and — rightmost — the Add Villa action. The Sort by menu and the clickable
 * column headers drive the same state — the menu is the discoverable entry point (and the only
 * way to reach "Date added", which has no column of its own), the headers are the shortcut.
 */
export function StayTableOperations({
    filters,
    onFiltersChange,
    onResetFilters,
    search,
    onSearchChange,
    sortKey,
    sortDirection,
    onSort,
    featuredCount,
}: StayTableOperationsProps) {
    const [openPanel, setOpenPanel] = useState<"filter" | "sort" | null>(null);
    const ref = useOutsideClick<HTMLDivElement>(() => setOpenPanel(null), false);

    const update = (patch: Partial<StayFilters>) =>
        onFiltersChange({ ...filters, ...patch });

    const activeFilterCount = [
        filters.onlyFeatured,
        filters.onlyNew,
        filters.onlyIncomplete,
        filters.priceMin !== null,
        filters.priceMax !== null,
        filters.capacityMin !== null,
    ].filter(Boolean).length;

    const activeSortLabel = STAY_SORT_OPTIONS.find(
        (option) => option.value === sortKey,
    )?.label;

    return (
        <Controls ref={ref}>
            <SearchBox>
                <HiOutlineMagnifyingGlass />
                <input
                    type="text"
                    placeholder="Search villas…"
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
                        <Checkbox
                            id="onlyFeatured"
                            checked={filters.onlyFeatured}
                            onChange={(e) => update({ onlyFeatured: e.target.checked })}
                        >
                            Featured only
                        </Checkbox>
                        <Checkbox
                            id="onlyNew"
                            checked={filters.onlyNew}
                            onChange={(e) => update({ onlyNew: e.target.checked })}
                        >
                            New only
                        </Checkbox>
                        <Checkbox
                            id="onlyIncomplete"
                            checked={filters.onlyIncomplete}
                            onChange={(e) => update({ onlyIncomplete: e.target.checked })}
                        >
                            Not ready to publish
                        </Checkbox>

                        <Divider />

                        <PanelLabel>Price per night (Rp)</PanelLabel>
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

                        <PanelLabel>Minimum capacity</PanelLabel>
                        <PanelInput
                            type="number"
                            placeholder="e.g. 6"
                            value={filters.capacityMin ?? ""}
                            onChange={(e) =>
                                update({
                                    capacityMin: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                })
                            }
                        />

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
                        {STAY_SORT_OPTIONS.map((option) => (
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

            {/* Same Wrapper as Filter/Sort by above for consistent spacing. Keeps the existing
                primary-button colors — explicit request to leave those alone — but the radius
                now matches the pill shape of Filter/Sort by via AddStayButton. */}
            <Wrapper>
                <Modal>
                    <Modal.Open opens="add-stay">
                        {(open: () => void) => <AddStayButton onClick={open}>Add Villa</AddStayButton>}
                    </Modal.Open>

                    <Modal.Window name="add-stay">
                        {(close: () => void) => (
                            <CreateStayForm featuredCount={featuredCount} onClose={close} />
                        )}
                    </Modal.Window>
                </Modal>
            </Wrapper>
        </Controls>
    );
}
