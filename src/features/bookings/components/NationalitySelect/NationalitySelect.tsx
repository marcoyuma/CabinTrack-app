import { ChangeEvent } from "react";
import { Select } from "../../../../ui/Select/Select";
import { Flags } from "../CreateBookingForm/useFlags";

interface NationalitySelectProps {
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function NationalitySelect({
    value,
    options,
    onChange,
}: NationalitySelectProps) {
    console.log(options);

    return (
        <Select
            options={options}
            value={value}
            defaultPlaceholder="Select nationality"
            type="white"
            $fullwidth={true}
            onChange={onChange}
        />
    );
}
