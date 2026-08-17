import styled from "styled-components";
import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";
import { useAmenities } from "../hooks/useAmenities";

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const SharedList = styled.ul`
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1.6rem;
`;

const SharedItem = styled.li`
    font-size: 1.3rem;
    padding: 0.4rem 1.2rem;
    border-radius: 100px;
    background-color: var(--color-grey-100);
    color: var(--color-grey-600);
`;

interface AmenityPickerProps {
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}

// Every new villa gets the 6 is_shared amenities automatically (see useCreateStay.ts /
// attachAmenities.ts) — those are shown here read-only, informationally, never selectable.
// Only non-shared amenities are pickable as villa-specific extras (stay_amenities sort_order
// 0-9). Creating brand-new amenity definitions is out of scope for this feature.
export function AmenityPicker({ selectedIds, onChange }: AmenityPickerProps) {
    const { amenities, isPending } = useAmenities();

    if (isPending) return <SpinnerMini />;

    const sharedAmenities = amenities.filter((a) => a.is_shared);
    const villaSpecificAmenities = amenities.filter((a) => !a.is_shared);

    const toggle = (id: number) => {
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter((existing) => existing !== id)
                : [...selectedIds, id],
        );
    };

    return (
        <div>
            <SharedList>
                {sharedAmenities.map((amenity) => (
                    <SharedItem key={amenity.id}>{amenity.label}</SharedItem>
                ))}
            </SharedList>

            <List>
                {villaSpecificAmenities.map((amenity) => (
                    <Checkbox
                        key={amenity.id}
                        id={`amenity-${amenity.id}`}
                        checked={selectedIds.includes(amenity.id)}
                        onChange={() => toggle(amenity.id)}
                    >
                        {amenity.label}
                    </Checkbox>
                ))}
            </List>
        </div>
    );
}
