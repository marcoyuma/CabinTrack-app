import { MouseEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { useBookingDateRangeParam } from "../hooks/useBookingDateRangeParam";
import {
    DateRangeBadge,
    DateRangeInput,
    DateRangeInputRow,
    DateRangePanel,
    DateRangePanelLabel,
    DateRangeWrapper,
} from "./bookingDateRangeFilter.styles";

const toInputValue = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Date range control for the Bookings route, rendered inside MainNav's pill (see MainNav.tsx)
 * instead of being duplicated in both BookingsOverTimeChart's header and BookingTable's
 * toolbar like before. All three (chart, top-selling leaderboard, table) read the same
 * `from`/`to` URL params via useBookingDateRangeParam(), so this is now the single place that
 * writes them. Badge/panel styling is unchanged from the old chart-header version — only the
 * location moved.
 */
export function BookingDateRangeFilter() {
    const { dateRange, setDateRange } = useBookingDateRangeParam();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null,
    );
    const badgeRef = useRef<HTMLButtonElement>(null);
    const ref = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), false);

    const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
        // DateRangePanel now lives outside DateRangeWrapper (portaled to document.body), so
        // the badge click is "outside" as far as useOutsideClick's ref is concerned — stop it
        // from bubbling to the document listener, or the same click that opens the panel
        // immediately closes it again.
        e.stopPropagation();

        const rect = badgeRef.current?.getBoundingClientRect();
        setPosition({
            x: window.innerWidth - (rect?.right ?? 0),
            y: (rect?.bottom ?? 0) + 8,
        });
        setIsOpen((open) => !open);
    };

    return (
        <DateRangeWrapper>
            <DateRangeBadge ref={badgeRef} type="button" onClick={handleToggle}>
                <HiOutlineCalendarDays />
                {format(dateRange.from, "MMM dd")} — {format(dateRange.to, "MMM dd yyyy")}
            </DateRangeBadge>

            {isOpen &&
                createPortal(
                    <DateRangePanel $position={position} ref={ref}>
                        <DateRangePanelLabel>Date range</DateRangePanelLabel>
                        <DateRangeInputRow>
                            <DateRangeInput
                                type="date"
                                value={toInputValue(dateRange.from)}
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        from: new Date(e.target.value),
                                    })
                                }
                            />
                            <DateRangeInput
                                type="date"
                                value={toInputValue(dateRange.to)}
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        to: new Date(e.target.value),
                                    })
                                }
                            />
                        </DateRangeInputRow>
                    </DateRangePanel>,
                    document.body,
                )}
        </DateRangeWrapper>
    );
}
