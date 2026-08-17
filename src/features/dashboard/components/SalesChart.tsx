import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import { Heading } from "../../../ui/Heading/Heading";
import { formatRupiah } from "../../../shared/utils/helpers";
import { BookingFinancialRow } from "../types/dashboard.schema";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;

    justify-content: center;
    align-items: center;

    /* Heading left-aligned, everything else in DashboardBox stays centered. Box padding
       (added to DashboardBox) now gives the chart its own breathing room, so this no longer
       needs to hack extra offset in on top of it. */
    > :first-child {
        align-self: flex-start;
    }

    /* Hack to change grid line colors */
    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

type SalesChartProps = {
    bookingFinancials: BookingFinancialRow[] | undefined;
    numDays: number;
};

// Restored AreaChart shape from the original SalesChart. The only real change: the
// Seaspace `bookings` schema has no `extras_price` column (no breakfast/extras concept in
// the villa domain) — see dashboard-migration plan, decision #6 — so there's one series
// ("Total sales") instead of the old two ("Total sales" + "Extras sales").
export function SalesChart({ bookingFinancials, numDays }: SalesChartProps) {
    // ResponsiveContainer's fixed height={250} and YAxis's fixed width={100} are numeric
    // Recharts props, not CSS — media queries can't shrink them, so a breakpoint value drives
    // them directly.
    const { isMobile } = useBreakpoint();

    // Generate a list of all dates from N days ago up to today (inclusive)
    const allDates = eachDayOfInterval({
        start: subDays(new Date(), numDays - 1),
        end: new Date(),
    });

    // Build daily sales data by iterating over each date, selecting bookings created on
    // that day, and summing total revenue
    const data = allDates.map((date) => {
        const label = format(date, "MMM dd");

        if (!bookingFinancials) return { label, totalSales: 0 };

        // Exclude cancelled bookings — `total_price` is a generated column that's computed
        // regardless of payment status, so an unpaid booking auto-cancelled by the hourly
        // lifecycle cron (see ADMIN-PANEL-CONTEXT.md) still carries a price. Counting it as
        // revenue overstates Sales for money that was never actually collected.
        const bookingsOnDate = bookingFinancials.filter(
            (row) =>
                isSameDay(date, new Date(row.created_at)) &&
                row.status !== "cancelled",
        );

        const totalSales = bookingsOnDate.reduce(
            (acc, curr) => acc + curr.total_price,
            0,
        );

        return { label, totalSales };
    });

    const colors = {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        text: "#374151",
        background: "#fff",
    };

    // Y-axis tick has too little width for full "RpX.XXX.XXX" labels — they get clipped by
    // the chart edge. Compact to "RpXk" here; the Tooltip keeps the full formatRupiah since
    // it has room.
    const formatRupiahCompact = (value: number) =>
        `Rp${Math.round(value / 1000).toLocaleString("id-ID")}k`;

    return (
        <StyledSalesChart>
            <Heading as="h2">
                Sales from {format(allDates.at(0) ?? new Date(), "MMM dd yyyy")}{" "}
                &mdash;{" "}
                {format(allDates.at(-1) ?? new Date(), "MMM dd yyyy")}
            </Heading>

            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: isMobile ? 16 : 10,
                        left: isMobile ? 0 : 10,
                    }}
                >
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text, fontSize: isMobile ? 11 : 12 }}
                        tickLine={{ stroke: colors.text }}
                        interval="preserveStartEnd"
                        padding={{ left: 25, right: isMobile ? 12 : 0 }}
                    />
                    <YAxis
                        width={isMobile ? 60 : 100}
                        tickMargin={isMobile ? 6 : 12}
                        tick={{ fill: colors.text, fontSize: isMobile ? 11 : 12 }}
                        tickLine={{ stroke: colors.text }}
                        tickFormatter={(value?: number) =>
                            value === undefined
                                ? ""
                                : formatRupiahCompact(value)
                        }
                    />
                    <CartesianGrid strokeDasharray="4" />
                    <Tooltip
                        contentStyle={{ backgroundColor: colors.background }}
                        formatter={(value?: number) =>
                            value === undefined ? "" : formatRupiah(value)
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="totalSales"
                        stroke={colors.totalSales.stroke}
                        fill={colors.totalSales.fill}
                        strokeWidth={2}
                        name="Total sales"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}
