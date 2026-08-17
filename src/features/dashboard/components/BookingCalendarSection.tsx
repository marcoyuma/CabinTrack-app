import { useMemo, useState } from "react";
import {
    eachDayOfInterval,
    endOfMonth,
    format,
    parseISO,
    startOfMonth,
} from "date-fns";
import styled, { css } from "styled-components";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { useMonthBookingRoster } from "../hooks/useMonthBookingRoster";
import { BookingCalendarGrid } from "./BookingCalendarGrid";
import { BookingCalendarList } from "./BookingCalendarList";
import { media } from "../../../styles/breakpoints";

// grid-column: 1/span 2 only applies once DashboardLayout switches to its 4-col grid at
// desktop — below that, this is a plain full-width block in the stacked layout.
const StyledSection = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);

    padding: var(--spacing-card-padding);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 0;

    ${media.desktop(css`
        grid-column: 1 / span 2;
    `)}
`;

// A 32rem-wide calendar plus a list genuinely can't share a row until desktop (see
// BookingCalendarGrid's fixed width), so this stacks calendar-above-list through tablet and
// only becomes a side-by-side grid at desktop.
const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex: 1;
    min-height: 0;

    ${media.desktop(css`
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 3.2rem;
    `)}
`;

// Horizontal rule between calendar and list while stacked; becomes the vertical divider from
// the reference mockup once Content switches to a grid at desktop.
const Divider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--color-grey-100);

    ${media.desktop(css`
        height: auto;
        width: 1px;
    `)}
`;

/**
 * Booking calendar widget — a month calendar (left, fixed size) driving a scrollable booking
 * list for the selected date (right). One admin_booking_roster() call per visible month feeds
 * both the "has booking" dot indicators and the selected date's list (see
 * useMonthBookingRoster) — clicking a different date within the same month is instant, no
 * refetch.
 */
export function BookingCalendarSection() {
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState(() => new Date());

    const { isPending, monthBookings } = useMonthBookingRoster(currentMonth);

    const datesWithBookings = useMemo(() => {
        const set = new Set<string>();
        if (isPending) return set;

        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        for (const row of monthBookings) {
            const rowStart = parseISO(row.start_date);
            const rowEnd = parseISO(row.end_date);
            // Clip to the visible month before calling eachDayOfInterval — a booking that
            // starts before or ends after this month is still returned by the overlap-filtered
            // RPC, but only the days actually visible in this month's grid should get a dot.
            const start = rowStart < monthStart ? monthStart : rowStart;
            const end = rowEnd > monthEnd ? monthEnd : rowEnd;
            if (start > end) continue;

            for (const day of eachDayOfInterval({ start, end })) {
                set.add(format(day, "yyyy-MM-dd"));
            }
        }

        return set;
    }, [monthBookings, currentMonth, isPending]);

    const selectedISO = format(selectedDate, "yyyy-MM-dd");
    const selectedDateBookings = useMemo(
        () =>
            monthBookings
                .filter(
                    (row) =>
                        row.start_date <= selectedISO &&
                        selectedISO <= row.end_date,
                )
                .sort(
                    (a, b) =>
                        a.start_date.localeCompare(b.start_date) ||
                        a.guest_name.localeCompare(b.guest_name),
                ),
        [monthBookings, selectedISO],
    );

    return (
        <StyledSection>
            <Content>
                <BookingCalendarGrid
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    datesWithBookings={datesWithBookings}
                />

                <Divider />

                {isPending ? (
                    <Spinner />
                ) : (
                    <BookingCalendarList
                        bookings={selectedDateBookings}
                        selectedDate={selectedDate}
                    />
                )}
            </Content>
        </StyledSection>
    );
}
