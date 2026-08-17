import supabase from "../../../supabase/supabase";
import { readStaysSchema, Stay } from "../types/stay.schema";

// Full catalog read — no pagination. The Seaspace catalog is 4 villas today, so the
// dashboard/summary views need the whole table, not a page of it (unlike the old
// `readCabins`, which paginated a table with many more rows).
export const readStays = async (): Promise<Stay[]> => {
    const { data, error } = await supabase
        .from("stays")
        .select(
            "id, created_at, slug, name, location, price_per_night, discount, capacity, beds, area, is_new, is_featured, description, lat, lng",
        )
        .order("name", { ascending: true });

    if (error) {
        console.error(error);
        throw new Error("server error, stays data could not be loaded");
    }

    return readStaysSchema.parse(data);
};
