import styled, { css } from "styled-components";
import { Heading } from "../../../ui/Heading/Heading";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { BookingFinancialRow } from "../types/dashboard.schema";
import { media } from "../../../styles/breakpoints";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

// grid-column: 3/span 2 only makes sense once DashboardLayout's 4-col grid exists (desktop) —
// below that, this stacks full-width and the grid also stretches its height for free via the
// 40rem row, so an explicit height is only needed while stacked.
const ChartBox = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);

    padding: var(--spacing-card-padding);
    height: 32rem;

    & > *:first-child {
        margin-bottom: 1.6rem;
    }

    & .recharts-pie-label-text {
        font-weight: 600;
    }

    ${media.desktop(css`
        grid-column: 3 / span 2;
        height: auto;
    `)}
`;

type DurationBucket = {
    duration: string;
    value: number;
    color: string;
};

const startDataLight: DurationBucket[] = [
    { duration: "1 night", value: 0, color: "#ef4444" },
    { duration: "2 nights", value: 0, color: "#f97316" },
    { duration: "3 nights", value: 0, color: "#eab308" },
    { duration: "4-5 nights", value: 0, color: "#84cc16" },
    { duration: "6-7 nights", value: 0, color: "#22c55e" },
    { duration: "8-14 nights", value: 0, color: "#14b8a6" },
    { duration: "15-21 nights", value: 0, color: "#3b82f6" },
    { duration: "21+ nights", value: 0, color: "#a855f7" },
];

function incArrayValue(arr: DurationBucket[], field: string) {
    return arr.map((obj) =>
        obj.duration === field ? { ...obj, value: obj.value + 1 } : obj,
    );
}

function prepareData(startData: DurationBucket[], stays: { num_nights: number }[]) {
    const data = stays
        .reduce((arr, cur) => {
            const num = cur.num_nights;
            if (num === 1) return incArrayValue(arr, "1 night");
            if (num === 2) return incArrayValue(arr, "2 nights");
            if (num === 3) return incArrayValue(arr, "3 nights");
            if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
            if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
            if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
            if (num >= 15 && num <= 21)
                return incArrayValue(arr, "15-21 nights");
            if (num >= 21) return incArrayValue(arr, "21+ nights");
            return arr;
        }, startData)
        .filter((obj) => obj.value > 0);

    return data;
}

interface DurationChartProps {
    confirmedStays: BookingFinancialRow[];
}

// Restored PieChart donut from the original DurationChart — same bucket logic, now
// sourced from admin_booking_financials() (num_nights, filtered to checked_in/checked_out)
// instead of the old bookings table directly.
export function DurationChart({ confirmedStays }: DurationChartProps) {
    const data = prepareData(startDataLight, confirmedStays);
    // CSS media queries can't reach Recharts' numeric props (Pie radius, Legend width) — they're
    // read once per render, not resolved from CSS. A vertical right-aligned legend next to a
    // full-size donut has no room in a narrow stacked ChartBox, so it moves below the donut and
    // both shrink together below desktop.
    const { isMobile } = useBreakpoint();

    return (
        <ChartBox>
            <Heading as="h2">Stay duration summary</Heading>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        nameKey="duration"
                        dataKey="value"
                        innerRadius={isMobile ? 55 : 85}
                        outerRadius={isMobile ? 75 : 110}
                        paddingAngle={3}
                        cx={isMobile ? "50%" : "40%"}
                        cy={isMobile ? "40%" : "50%"}
                    >
                        {data.map((arg) => (
                            <Cell
                                fill={arg.color}
                                stroke={arg.color}
                                key={arg.duration}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    {isMobile ? (
                        <Legend
                            align="center"
                            verticalAlign="bottom"
                            layout="horizontal"
                            iconSize={12}
                            iconType="circle"
                        />
                    ) : (
                        <Legend
                            align="right"
                            verticalAlign="middle"
                            width={170}
                            layout="vertical"
                            iconSize={15}
                            iconType="circle"
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}
