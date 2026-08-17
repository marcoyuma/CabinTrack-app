import { useState } from "react";
import {
    Line,
    LineChart,
    MouseHandlerDataParam,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { BookingDateRange } from "../hooks/useBookings";
import { useBookingsOverTime } from "../hooks/useBookingsOverTime";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import {
    Beam,
    ChartCard,
    ChartHeader,
    ChartTitle,
    PlotArea,
    TooltipCard,
    TooltipDate,
    TooltipDot,
    TooltipRow,
} from "./bookingsOverTimeChart.styles";

const CHART_HEIGHT = { mobile: 220, desktop: 260 };
const CHART_MARGIN = { top: 36, right: 12, left: 12, bottom: 8 };

// Recharts renders a tick for every data point regardless of range length. Past ~9 points a
// half-width card runs out of room for the pill labels — they overlap and truncate (the "Au,"
// "Se," stacking bug). Cap how many are actually drawn instead of every one. Mobile gets its
// own, tighter cap since even a full-width phone screen is narrower than a half-width desktop
// card was.
const MAX_AXIS_LABELS = { mobile: 5, desktop: 9 };

const getAxisTickStep = (total: number, maxLabels: number) =>
    Math.max(1, Math.ceil(total / maxLabels));

const isAxisTickVisible = (index: number, total: number, maxLabels: number) => {
    const step = getAxisTickStep(total, maxLabels);
    return index === 0 || index === total - 1 || index % step === 0;
};

interface AxisTickProps {
    x?: number;
    y?: number;
    index?: number;
    payload?: { value: string };
    activeIndex: number | null;
    total: number;
    maxLabels: number;
    isMobile: boolean;
}

// Mirrors the reference design's x-axis: every date sits in a small grey pill, the hovered
// date grows into a filled brand-color pill that anchors the gradient Beam below it. Ticks
// beyond maxLabels are skipped (return null) unless they're the hovered point — so a long
// date range thins out its labels instead of overlapping, but hovering any day still pops its
// pill into view. Pill/circle radii shrink on mobile — the fixed px sizes here are SVG props,
// not CSS, so they can't respond to media queries.
function AxisTick({
    x = 0,
    y = 0,
    index,
    payload,
    activeIndex,
    total,
    maxLabels,
    isMobile,
}: AxisTickProps) {
    const isActive = index === activeIndex;

    if (
        !isActive &&
        typeof index === "number" &&
        !isAxisTickVisible(index, total, maxLabels)
    ) {
        return null;
    }

    const label = payload?.value ?? "";
    const activeRadius = isMobile ? 13 : 17;
    const pillWidth = isMobile ? 36 : 48;
    const pillHeight = isMobile ? 18 : 22;
    const fontSize = isMobile ? 10 : 11;

    return (
        <g transform={`translate(${x}, ${y + (isActive ? 12 : 8)})`}>
            {isActive ? (
                <>
                    <circle r={activeRadius} fill="var(--color-brand-600)" />
                    <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fontSize={fontSize}
                        fontWeight={600}
                        fill="#fff"
                    >
                        {label}
                    </text>
                </>
            ) : (
                <>
                    <rect
                        x={-pillWidth / 2}
                        y={-pillHeight / 2}
                        width={pillWidth}
                        height={pillHeight}
                        rx={pillHeight / 2}
                        fill="var(--color-grey-100)"
                    />
                    <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fontSize={fontSize}
                        fill="var(--color-grey-500)"
                    >
                        {label}
                    </text>
                </>
            )}
        </g>
    );
}

interface BookingDotProps {
    cx?: number;
    cy?: number;
    index?: number;
    activeIndex: number | null;
}

// On-curve markers: a plain grey ring for every day, swapping to a larger filled
// brand-color dot with a white ring on the hovered day — same treatment as the reference.
function BookingDot({ cx = 0, cy = 0, index, activeIndex }: BookingDotProps) {
    const isActive = index === activeIndex;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={isActive ? 6 : 4}
            fill={isActive ? "var(--color-brand-600)" : "var(--color-grey-0)"}
            stroke={isActive ? "#fff" : "var(--color-grey-400)"}
            strokeWidth={isActive ? 3 : 1.5}
        />
    );
}

interface ChartTooltipPayloadEntry {
    dataKey?: string;
    value?: number;
}

interface ChartTooltipProps {
    active?: boolean;
    label?: string | number;
    payload?: ReadonlyArray<ChartTooltipPayloadEntry>;
}

// Floating tooltip card pinned near the top of the chart (via Tooltip's `position={{y:0}}`
// below) rather than following the cursor's height — matches the reference, where the card
// always sits above the beam regardless of how low the line's value is that day.
function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;

    const booking = payload.find((entry) => entry.dataKey === "booking")?.value ?? 0;
    const lastMonth =
        payload.find((entry) => entry.dataKey === "lastMonth")?.value ?? 0;

    return (
        <TooltipCard>
            <TooltipDate>{label}</TooltipDate>
            <TooltipRow>
                <TooltipDot $color="var(--color-brand-600)" />
                Booking {booking}
            </TooltipRow>
            <TooltipRow>
                <TooltipDot $color="var(--color-grey-300)" />
                Last months: {lastMonth}
            </TooltipRow>
        </TooltipCard>
    );
}

interface BookingsOverTimeChartProps {
    dateRange: BookingDateRange;
}

/**
 * "Booking Over time" panel — layout/styling replicates the reference design 1:1 (gradient
 * beam anchored under the hovered date's pill, floating tooltip card, on-curve dots). One
 * intentional deviation from the reference agreed with the user: the reference's orange line
 * is swapped for --color-brand-600 (CabinTrack's brand indigo).
 *
 * `dateRange` comes from useBookingDateRangeParam() (URL params) via the Bookings page — the
 * picker itself lives in MainNav's BookingDateRangeFilter, not here, so this card and
 * BookingTable stay in sync without either owning the control.
 */
export function BookingsOverTimeChart({ dateRange }: BookingsOverTimeChartProps) {
    const { data, isPending } = useBookingsOverTime(dateRange);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [beamLeft, setBeamLeft] = useState(0);
    const { isMobile } = useBreakpoint();

    const chartHeight = isMobile ? CHART_HEIGHT.mobile : CHART_HEIGHT.desktop;
    const maxAxisLabels = isMobile ? MAX_AXIS_LABELS.mobile : MAX_AXIS_LABELS.desktop;

    const handleMouseMove = (state: MouseHandlerDataParam) => {
        if (state.isTooltipActive && typeof state.activeTooltipIndex === "number") {
            setActiveIndex(state.activeTooltipIndex);
            setBeamLeft(state.activeCoordinate?.x ?? 0);
        }
    };

    const handleMouseLeave = () => setActiveIndex(null);

    return (
        <ChartCard>
            <ChartHeader>
                <ChartTitle>Booking Over time</ChartTitle>
            </ChartHeader>

            {isPending ? (
                <Spinner />
            ) : (
                <PlotArea $height={chartHeight}>
                    {activeIndex !== null && (
                        <Beam $left={beamLeft} $height={chartHeight - 26} />
                    )}

                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <LineChart
                            data={data}
                            margin={CHART_MARGIN}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                tick={
                                    <AxisTick
                                        activeIndex={activeIndex}
                                        total={data.length}
                                        maxLabels={maxAxisLabels}
                                        isMobile={isMobile}
                                    />
                                }
                            />

                            {data.map((point, index) =>
                                index === activeIndex ||
                                !isAxisTickVisible(
                                    index,
                                    data.length,
                                    maxAxisLabels,
                                ) ? null : (
                                    <ReferenceLine
                                        key={point.label}
                                        x={point.label}
                                        stroke="var(--color-grey-200)"
                                        strokeDasharray="3 3"
                                    />
                                ),
                            )}

                            <Tooltip
                                cursor={false}
                                content={<ChartTooltip />}
                                position={{ y: 0 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="lastMonth"
                                name="Last months"
                                stroke="var(--color-grey-300)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="booking"
                                name="Booking"
                                stroke="var(--color-brand-600)"
                                strokeWidth={3}
                                dot={<BookingDot activeIndex={activeIndex} />}
                                activeDot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </PlotArea>
            )}
        </ChartCard>
    );
}
