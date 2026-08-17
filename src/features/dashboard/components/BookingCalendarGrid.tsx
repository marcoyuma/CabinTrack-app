import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import styled, { css } from "styled-components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { media } from "../../../styles/breakpoints";

const WEEKDAY_LABELS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

// 32rem (=320px) fixed width nearly fills a 375px viewport on its own — cap it as a max-width
// instead so it can shrink to fit while stacked, and only pin it to a fixed column width once
// BookingCalendarSection's Content becomes a side-by-side grid at desktop.
const GridWrapper = styled.div`
    width: 100%;
    max-width: 32rem;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;

    ${media.desktop(css`
        flex-shrink: 0;
    `)}
`;

// Prev/next buttons and the month label sit on one shared horizontal bar (matches the
// reference mockup) instead of each button carrying its own separate background.
const NavRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
    padding: 0.6rem 0.8rem;
`;

const NavButton = styled.button`
    background-color: transparent;
    border: none;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    transition: all 0.2s;

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-600);
    }

    &:hover {
        background-color: var(--color-brand-600);

        & svg {
            color: var(--color-brand-50);
        }
    }
`;

const MonthLabel = styled.span`
    font-size: var(--font-size-body);
    font-weight: 600;
    color: var(--color-grey-800);
`;

const WeekdayRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.8rem;
`;

const WeekdayCell = styled.span`
    font-size: var(--font-size-small);
    font-weight: 600;
    color: var(--color-grey-500);
    text-align: center;
`;

const DayGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.8rem;
`;

const DayCell = styled.button<{
    $isSelected: boolean;
    $isOutOfMonth: boolean;
    $isToday: boolean;
}>`
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    border-radius: 50%;
    font-size: var(--font-size-small);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    background-color: ${(props) =>
        props.$isSelected ? "var(--color-brand-600)" : "transparent"};
    color: ${(props) =>
        props.$isSelected
            ? "var(--color-grey-0)"
            : props.$isOutOfMonth
              ? "var(--color-grey-300)"
              : "var(--color-grey-700)"};
    border: ${(props) =>
        props.$isToday && !props.$isSelected
            ? "1px solid var(--color-brand-200)"
            : "1px solid transparent"};

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.$isSelected
                ? "var(--color-brand-600)"
                : "var(--color-grey-100)"};
    }

    &:disabled {
        cursor: default;
    }
`;

const BookingDot = styled.span<{ $isSelected: boolean }>`
    position: absolute;
    bottom: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${(props) =>
        props.$isSelected ? "var(--color-grey-0)" : "var(--color-brand-600)"};
`;

interface BookingCalendarGridProps {
    currentMonth: Date;
    onMonthChange: (next: Date) => void;
    selectedDate: Date;
    onSelectDate: (day: Date) => void;
    datesWithBookings: Set<string>;
}

/**
 * Month calendar — pure presentational. Renders a Monday-start week grid for `currentMonth`,
 * highlighting the selected date and marking days that have at least one booking (per
 * `datesWithBookings`) with a small dot. Days outside the current month are muted and
 * disabled — no dot, not clickable.
 */
export function BookingCalendarGrid({
    currentMonth,
    onMonthChange,
    selectedDate,
    onSelectDate,
    datesWithBookings,
}: BookingCalendarGridProps) {
    const gridStart = startOfWeek(startOfMonth(currentMonth), {
        weekStartsOn: 1,
    });
    const gridEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    return (
        <GridWrapper>
            <NavRow>
                <NavButton
                    type="button"
                    onClick={() => onMonthChange(subMonths(currentMonth, 1))}
                    aria-label="Previous month"
                >
                    <HiChevronLeft />
                </NavButton>
                <MonthLabel>{format(currentMonth, "MMMM yyyy")}</MonthLabel>
                <NavButton
                    type="button"
                    onClick={() => onMonthChange(addMonths(currentMonth, 1))}
                    aria-label="Next month"
                >
                    <HiChevronRight />
                </NavButton>
            </NavRow>

            <WeekdayRow>
                {WEEKDAY_LABELS.map((label) => (
                    <WeekdayCell key={label}>{label}</WeekdayCell>
                ))}
            </WeekdayRow>

            <DayGrid>
                {days.map((day) => {
                    const isOutOfMonth = !isSameMonth(day, currentMonth);
                    const isSelected = isSameDay(day, selectedDate);
                    const hasBooking =
                        !isOutOfMonth &&
                        datesWithBookings.has(format(day, "yyyy-MM-dd"));

                    return (
                        <DayCell
                            key={day.toISOString()}
                            type="button"
                            disabled={isOutOfMonth}
                            $isSelected={isSelected}
                            $isOutOfMonth={isOutOfMonth}
                            $isToday={isToday(day)}
                            onClick={() => onSelectDate(day)}
                        >
                            {format(day, "d")}
                            {hasBooking && (
                                <BookingDot $isSelected={isSelected} />
                            )}
                        </DayCell>
                    );
                })}
            </DayGrid>
        </GridWrapper>
    );
}
