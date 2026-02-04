import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange, Range } from "react-date-range";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRangeInput } from "../DateRangeInput/DateRangeInput";
import { Button } from "../../../../ui/Button/Button";
import { format, addDays } from "date-fns";

interface Props {
    range: Range;
    setRange: Dispatch<SetStateAction<Range>>;
}
export function BookingDateRangePicker({ range, setRange }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const displayValue =
        range.startDate && range.endDate
            ? `${format(range.startDate, "dd MMM yyyy")} – ${format(
                  range.endDate,
                  "dd MMM yyyy",
              )}`
            : "";

    return (
        <>
            <DateRangeInput
                onClick={() => setIsOpen(true)}
                value={displayValue}
            />

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
