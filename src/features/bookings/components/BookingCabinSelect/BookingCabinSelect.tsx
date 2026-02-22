import React, { SetStateAction } from "react";
import { Select } from "../../../../ui/Select/Select";
import { Cabin } from "../../../cabins/types/cabin.schema";

// Props for the cabin dropdown used in booking forms.
interface BookingCabinSelectProps {
    cabins: Cabin[];
    cabinId: number;
    setCabinId: React.Dispatch<SetStateAction<number | undefined>>;
}

/**
 * BookingCabinSelect renders a `<select>` for choosing a cabin by id.
 *
 * - `options`: derived from `cabins` as `{ value: cabin.id, label: cabin.name }`
 * - `value`: controlled by `cabinId`
 * - `onChange`: calls `setCabinId` with the selected numeric id
 */
export function BookingCabinSelect({
    cabins,
    cabinId,
    setCabinId,
}: BookingCabinSelectProps) {
    console.log(cabins);

    return (
        <Select
            options={cabins.map((cabin) => ({
                value: String(cabin.id),
                label: cabin.name,
            }))}
            value={cabinId}
            defaultPlaceholder="Select cabin"
            type="white"
            onChange={(e) => setCabinId(+e.target.value)}
        />
    );
}
