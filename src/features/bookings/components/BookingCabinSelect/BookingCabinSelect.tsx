import React, { SetStateAction } from "react";
import { Select } from "../../../../ui/Select/Select";
import { Cabin } from "../../../cabins/types/cabin.schema";

interface BookingCabinSelectProps {
    cabins: Cabin[];
    cabinId: number;
    setCabinId: React.Dispatch<SetStateAction<number | undefined>>;
}
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
