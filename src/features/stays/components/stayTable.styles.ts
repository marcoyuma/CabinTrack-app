import styled, { css } from "styled-components";
import { media } from "../../../styles/breakpoints";

// Shared grid definition for the stays table. Header bar and every row consume the same
// template so cells stay aligned — kept in one place rather than duplicated across
// StayTable/StayRow, which is exactly how they drift apart.
export const STAY_TABLE_COLUMNS = "2.6fr 1.3fr 1.1fr 1.7fr 1fr 1.2fr 6rem";

// Below tablet, a 7-column grid has nowhere to put its columns — rows stack into cards
// instead (each row's Grid becomes a flex column), and TableRowItem/TableHeaderBar layer their
// own card/hidden-header treatment on top (see below). Mirrors bookingTable.styles.ts's Grid.
const Grid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.4rem;

    ${media.tablet(css`
        display: grid;
        grid-template-columns: ${STAY_TABLE_COLUMNS};
        column-gap: 1.6rem;
        align-items: center;
    `)}
`;

// Wraps one cell's mobile label + value as a label-left/value-right row. At tablet+ it
// dissolves via display:contents — CellLabel is display:none there, so only the value remains
// as the actual grid item, keeping the column count intact. Mirrors bookingTable.styles.ts.
export const Field = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;

    ${media.tablet(css`
        display: contents;
    `)}
`;

export const CellLabel = styled.span`
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: var(--color-grey-400);

    ${media.tablet(css`
        display: none;
    `)}
`;

/**
 * The page-level card the whole table lives in. Matches Stat.tsx's card treatment
 * (white, 1px grey-100 border, --border-radius-lg) so the table reads as part of the same
 * surface family as the stat cards directly above it.
 */
export const TableCard = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-card-padding);

    ${media.tablet(css`
        padding: 2.4rem;
    `)}
`;

/** Title on the left, search + filter + sort controls on the right. */
export const TableToolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 2rem;
`;

export const TableTitle = styled.h2`
    font-size: var(--font-size-heading);
    font-weight: 600;
    color: var(--color-grey-800);
`;

// Inset grey bar, not a flush-to-the-edge header — the card's own padding shows around it.
// Title case, not uppercase: the reference header reads "Room Name", not "ROOM NAME". Column
// labels are redundant with each row's own CellLabel once rows stack into cards, so the
// header bar hides entirely below tablet instead of trying to stack itself.
export const TableHeaderBar = styled(Grid)`
    display: none;

    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-md);
    padding: 1.3rem 1.6rem;

    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-500);

    ${media.tablet(css`
        display: grid;
    `)}
`;

// Each row is its own bordered card below tablet (stacked layout); reverts to a flat grid row
// with only a bottom divider at tablet+ (original desktop look, unchanged).
export const TableRowItem = styled(Grid)`
    padding: 1.2rem 1.4rem;
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    &:not(:last-child) {
        margin-bottom: 0.8rem;
    }

    ${media.tablet(css`
        padding: 1.4rem 1.6rem;
        border: none;
        border-radius: 0;

        &:not(:last-child) {
            margin-bottom: 0;
            border-bottom: 1px solid var(--color-grey-100);
        }
    `)}
`;

export const TableEmpty = styled.p`
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-grey-500);
    text-align: center;
    padding: 4rem 0;
`;

/**
 * Pill-shaped control used by the toolbar's search box, Filter and Sort by buttons.
 * Exported so StayTableOperations can build both a button and an input wrapper from it.
 */
export const pillStyles = `
    display: flex;
    align-items: center;
    gap: 0.8rem;

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    border-radius: 9999px;
    padding: 0.9rem 1.6rem;

    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-grey-600);
`;
