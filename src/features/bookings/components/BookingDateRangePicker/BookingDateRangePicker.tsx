// Third-party styles required by `react-date-range`.
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Date range picker UI + supporting utilities.
import { DateRange, Range } from "react-date-range";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRangeInput } from "../DateRangeInput/DateRangeInput";
import { Button } from "../../../../ui/Button/Button";
import { format, addDays } from "date-fns";

// Controlled props passed from the parent booking form.
interface Props {
    range: Range;
    setRange: Dispatch<SetStateAction<Range>>;
}

/**
 * Displays a read-only date range input that toggles a `react-date-range` popover.
 * Selection is controlled via `range`/`setRange` and constrained to today..60 days ahead.
 */
export function BookingDateRangePicker({ range, setRange }: Props) {
    // Popover open/close state.
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Input text value derived from the currently selected range.
    const displayValue =
        range.startDate && range.endDate
            ? `${format(range.startDate, "dd MMM yyyy")} – ${format(
                  range.endDate,
                  "dd MMM yyyy",
              )}`
            : "";

    return (
        <>
            {/* Clickable input that opens the calendar popover. */}
            <DateRangeInput
                onClick={() => setIsOpen(true)}
                value={displayValue}
            />

            {/* Calendar popover shown only when `isOpen` is true. */}
            {/* Inline positioning to overlay the calendar near the input. */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "20%",
                        // gridColumn: "2 / span 2",
                        // zIndex: 1000,
                        alignSelf: "flex-start",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <DateRange
                        ranges={[range]}
                        onChange={(item) => setRange(item.selection)}
                        minDate={new Date()}
                        maxDate={addDays(new Date(), 60)}
                        months={2}
                        direction="horizontal"
                    />
                    <Button onClick={() => setIsOpen(false)}>Done</Button>
                </div>
            )}
        </>
    );
}
