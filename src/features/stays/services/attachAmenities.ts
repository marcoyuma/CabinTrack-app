import supabase from "../../../supabase/supabase";
import { Database } from "../../../supabase/types/database.types";
import { Amenity } from "../types/amenity.schema";

type StayAmenityInsert = Database["public"]["Tables"]["stay_amenities"]["Insert"];

// Shared amenities sit at sort_order 10-15 (villa-specific ones use 0-9) — see
// ADMIN-PANEL-CONTEXT.md § "amenities + stay_amenities".
const SHARED_SORT_ORDER_START = 10;

// Attaches the 6 shared amenities (fixed sort_order 10-15) plus whichever villa-specific
// amenities the staff member picked (sort_order 0..n-1) to a newly created stay, in one batch
// insert. sharedAmenities/allAmenities come from the already-fetched useAmenities() cache so
// this doesn't issue its own network read.
export const attachAmenities = async (
    stayId: number,
    sharedAmenities: Amenity[],
    selectedAmenityIds: number[],
): Promise<void> => {
    const sharedRows: StayAmenityInsert[] = sharedAmenities.map((amenity, index) => ({
        stay_id: stayId,
        amenity_id: amenity.id,
        sort_order: SHARED_SORT_ORDER_START + index,
    }));

    const villaSpecificRows: StayAmenityInsert[] = selectedAmenityIds.map(
        (amenityId, index) => ({
            stay_id: stayId,
            amenity_id: amenityId,
            sort_order: index,
        }),
    );

    const { error } = await supabase
        .from("stay_amenities")
        .insert([...villaSpecificRows, ...sharedRows]);

    if (error) {
        console.error(error);
        throw new Error("server error, amenities could not be attached to this villa");
    }
};
