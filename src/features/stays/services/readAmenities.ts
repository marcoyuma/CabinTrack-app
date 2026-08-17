import supabase from "../../../supabase/supabase";
import {
    Amenity,
    readAmenitiesSchema,
    readStayAmenitiesSchema,
    StayAmenity,
} from "../types/amenity.schema";

export const readAmenities = async (): Promise<Amenity[]> => {
    const { data, error } = await supabase
        .from("amenities")
        .select("id, slug, label, detail, is_shared")
        .order("label", { ascending: true });

    if (error) {
        console.error(error);
        throw new Error("server error, amenities data could not be loaded");
    }

    return readAmenitiesSchema.parse(data);
};

export const readStayAmenities = async (): Promise<StayAmenity[]> => {
    const { data, error } = await supabase
        .from("stay_amenities")
        .select("stay_id, amenity_id, sort_order")
        .order("stay_id", { ascending: true })
        .order("sort_order", { ascending: true });

    if (error) {
        console.error(error);
        throw new Error("server error, stay amenities could not be loaded");
    }

    return readStayAmenitiesSchema.parse(data);
};
