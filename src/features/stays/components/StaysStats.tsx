import styled, { css } from "styled-components";
import {
    HiOutlineCheckCircle,
    HiOutlineHomeModern,
    HiOutlineUserGroup,
} from "react-icons/hi2";
import Stat from "../../../ui/Stat/Stat";
import { media } from "../../../styles/breakpoints";

interface StaysStatsProps {
    totalStaysCount: number;
    occupiedCount: number;
}

// Same per-card size as dashboard's StatsGrid (both reuse ui/Stat/Stat.tsx unchanged) — only
// the column count differs, 3 here vs 4 on the dashboard. No margin-bottom: AppLayout's
// Container already spaces sections at 1.2rem, and adding to it here made the gap below the
// stats visibly larger than every other gap on the page. 1 column mobile, 2 tablet, 3 desktop
// — same progression as the dashboard's Stats.tsx.
const StaysStatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;

    ${media.tablet(css`
        grid-template-columns: repeat(2, 1fr);
    `)}

    ${media.desktop(css`
        grid-template-columns: repeat(3, 1fr);
    `)}
`;

// "Villas" absorbs the page heading that used to sit above the table (Stays.tsx) — same
// total count, now rendered as the first stat card instead of an h1.
function StaysStats({ totalStaysCount, occupiedCount }: StaysStatsProps) {
    const availableCount = totalStaysCount - occupiedCount;

    return (
        <StaysStatsGrid>
            <Stat
                icon={<HiOutlineHomeModern />}
                title="Villas"
                value={totalStaysCount.toLocaleString()}
            />
            <Stat
                icon={<HiOutlineCheckCircle />}
                title="Available"
                value={availableCount.toLocaleString()}
            />
            <Stat
                icon={<HiOutlineUserGroup />}
                title="Occupied"
                value={occupiedCount.toLocaleString()}
            />
        </StaysStatsGrid>
    );
}

export default StaysStats;
