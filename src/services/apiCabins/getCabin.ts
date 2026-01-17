import { readCabinSchema } from "../../features/cabins/types/cabin.schema";
import supabase from "../../supabase/supabase";

/**
 * Fetch a cabin by ID and return the stored image file name extracted from its image URL
 */
export async function getCabin(id: number) {
    const { data, error } = await supabase.from("cabins").select().eq("id", id);

    if (error) {
        console.error(error.message);
        throw new Error(`An error occured: ${error.message}`);
    }

    return readCabinSchema.parse(data[0]).image?.split("/").pop();
}
