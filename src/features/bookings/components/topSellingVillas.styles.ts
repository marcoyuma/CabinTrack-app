import styled, { css } from "styled-components";
import { pillStyles } from "./bookingTable.styles";
import { media } from "../../../styles/breakpoints";

// Mirrors bookingsOverTimeChart.styles.ts's ChartCard/ChartHeader/ChartTitle so the two cards
// (chart on the left, this leaderboard on the right) read as one visual pair — same padding,
// border, radius, shadow.
export const TopSellingCard = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-card-padding) var(--spacing-card-padding) 1.6rem;
    box-shadow: 0 1.6rem 3.2rem rgba(17, 24, 39, 0.04);

    display: flex;
    flex-direction: column;
    min-width: 0;

    ${media.tablet(css`
        padding: 2.4rem 2.8rem 1.6rem;
    `)}
`;

export const TopSellingHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
`;

export const TopSellingTitle = styled.h2`
    font-size: var(--font-size-heading);
    font-weight: 600;
    color: var(--color-grey-800);
`;

export const TOP_SELLING_COLUMNS = "1.6fr 1fr 1.2fr";

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${TOP_SELLING_COLUMNS};
    column-gap: 1.2rem;
    align-items: center;
`;

export const TopSellingHeaderBar = styled(Grid)`
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-md);
    padding: 1.1rem 1.4rem;

    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
`;

// Fixed height matching the chart's CHART_HEIGHT (260px) so the two cards line up — scrolls
// internally instead of growing the card once there are more stays than fit, per user request.
export const TopSellingBody = styled.div`
    max-height: 26rem;
    overflow-y: auto;
`;

export const TopSellingRow = styled(Grid)`
    padding: 1.2rem 1.4rem;
    font-size: 1.4rem;
    color: var(--color-grey-700);

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

export const VillaName = styled.span`
    font-weight: 500;
    color: var(--color-grey-800);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const RevenueValue = styled.span`
    font-weight: 600;
    color: var(--color-grey-800);
`;

export const TopSellingEmpty = styled.p`
    font-size: 1.4rem;
    color: var(--color-grey-500);
    text-align: center;
    padding: 3.2rem 0;
`;

// Sort-by pill + panel, mirrors BookingTableOperations' PillButton/Panel/SortOption (same
// pillStyles primitive) so this leaderboard's sort control looks and behaves like the one on
// BookingTable below it.
export const SortWrapper = styled.div`
    position: relative;
`;

export const SortPillButton = styled.button`
    ${pillStyles}
    cursor: pointer;
    transition: all 0.2s;

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
    }

    &:hover {
        background-color: var(--color-grey-50);
    }
`;

export const SortPanel = styled.div`
    position: absolute;
    top: calc(100% + 0.8rem);
    right: 0;
    z-index: 20;
    min-width: 20rem;
    max-width: calc(100vw - 3.2rem);

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
    padding: 1.2rem;

    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

export const SortPanelLabel = styled.span`
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-grey-500);
    padding: 0 1.2rem;
    margin-bottom: 0.4rem;
`;

export const SortOption = styled.button<{ $active: boolean }>`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: var(--border-radius-sm);
    font-size: 1.3rem;
    font-weight: 500;
    color: ${({ $active }) => ($active ? "var(--color-brand-600)" : "var(--color-grey-600)")};
    background-color: ${({ $active }) =>
        $active ? "var(--color-brand-50)" : "transparent"};
    cursor: pointer;

    &:hover {
        background-color: ${({ $active }) =>
            $active ? "var(--color-brand-50)" : "var(--color-grey-50)"};
    }
`;
