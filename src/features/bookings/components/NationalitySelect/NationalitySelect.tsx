import { ChangeEvent } from "react";
import { Select } from "../../../../ui/Select/Select";
import { Flags } from "../CreateBookingForm/useFlags";

interface NationalitySelectProps {
    flags?: Flags;
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function NationalitySelect({
    flags,
    value,
    options,
    onChange,
}: NationalitySelectProps) {
    console.log(options);

    return (
        <Select
            options={options}
            value={value}
            defaultPlaceholder={
                flags ? "Select nationality" : "Loading countries..."
            }
            type="white"
            onChange={onChange}
        />
    );
}
