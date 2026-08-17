import styled, { css } from "styled-components";
import { media } from "../../../styles/breakpoints";

export const ChartCard = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-card-padding) var(--spacing-card-padding) 1.6rem;
    box-shadow: 0 1.6rem 3.2rem rgba(17, 24, 39, 0.04);

    ${media.tablet(css`
        padding: 2.4rem 2.8rem 1.6rem;
    `)}
`;

export const ChartHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
`;

export const ChartTitle = styled.h2`
    font-size: var(--font-size-heading);
    font-weight: 600;
    color: var(--color-grey-800);
`;

// Date range badge/panel used to live here — moved to bookingDateRangeFilter.styles.ts when
// the control relocated to MainNav (see BookingDateRangeFilter.tsx), verbatim CSS unchanged.

export const PlotArea = styled.div<{ $height: number }>`
    position: relative;
    height: ${({ $height }) => $height}px;
`;

export const Beam = styled.div<{ $left: number; $height: number }>`
    position: absolute;
    left: ${({ $left }) => $left}px;
    top: 0;
    height: ${({ $height }) => $height}px;
    width: 4px;
    transform: translateX(-50%);
    background: linear-gradient(
        to bottom,
        var(--color-brand-600) 0%,
        rgba(79, 70, 229, 0.06) 100%
    );
    border-radius: 999px;
    pointer-events: none;
`;

export const TooltipCard = styled.div`
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    padding: 1.2rem 1.4rem;
    min-width: 15rem;
`;

export const TooltipDate = styled.p`
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-800);
    margin-bottom: 0.6rem;
`;

export const TooltipRow = styled.p`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.2rem;
    color: var(--color-grey-600);

    &:not(:last-child) {
        margin-bottom: 0.3rem;
    }
`;

export const TooltipDot = styled.span<{ $color: string }>`
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: ${({ $color }) => $color};
    flex-shrink: 0;
`;
