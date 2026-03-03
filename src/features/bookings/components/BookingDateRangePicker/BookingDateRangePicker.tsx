// Third-party styles required by `react-date-range`.
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Date range picker UI + supporting utilities.
import { DateRange, Range } from "react-date-range";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRangeInput } from "../DateRangeInput/DateRangeInput";

import { format, addDays } from "date-fns";
import { useSettings } from "../../../settings/hooks/useSettings";

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
    // settings data
    const {
        setting: { maxBookingLength },
    } = useSettings();

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
    console.log(range);
    console.log(range.startDate);
    console.log(range.endDate);

    // ! maximum nights validation first stage development (startDate + maxnight)
    // logic maximum booking/nights: startDate + 30 hari
    const [firstTouch, setFirstTouch] = useState(false);

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
                        onChange={(item) => {
                            console.log("tezs");

                            setRange(item.selection);
                            setFirstTouch((val) => !val);

                            if (firstTouch) {
                                console.log("false");
                                setIsOpen(false);
                                setFirstTouch(false);
                            }
                        }}
                        // set today as selectable range date input
                        minDate={new Date()}
                        // set h+ startDate and  and as selectable range date input
                        maxDate={addDays(
                            range.startDate ?? new Date(),
                            firstTouch ? maxBookingLength : 60,
                        )}
                        months={2}
                        direction="horizontal"
                    />
                </div>
            )}
        </>
    );
}
