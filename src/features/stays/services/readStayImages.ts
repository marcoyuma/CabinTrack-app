import supabase from "../../../supabase/supabase";
import {
    readStayImagesSchema,
    StayImage,
} from "../types/stay-image.schema";

// Full read of stay_images, used for image-completeness QA (cover present,
// blur_data_url/width/height filled) — see ADMIN-PANEL-CONTEXT.md § "Cara menguji dari
// sisi Anda". Not wired into the dashboard yet (out of scope for tahap 1 per the plan),
// but the read layer is in place since this is squarely within the admin panel's authority.
export const readStayImages = async (): Promise<StayImage[]> => {
    const { data, error } = await supabase
        .from("stay_images")
        .select("stay_id, storage_path, alt, blur_data_url, width, height, sort_order")
        .order("stay_id", { ascending: true })
        .order("sort_order", { ascending: true });

    if (error) {
        console.error(error);
        throw new Error("server error, stay images could not be loaded");
    }

    return readStayImagesSchema.parse(data);
};
