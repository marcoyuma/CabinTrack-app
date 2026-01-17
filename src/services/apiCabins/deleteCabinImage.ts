import supabase from "../../supabase/supabase";

/**
 * Delete a cabin image from Supabase storage to prevent unused files and wasted resources
 */
export async function deleteCabinImage(imageNameToDelete: string) {
    await supabase.storage
        .from("cabin-images")
        .remove([imageNameToDelete ?? ""])
        .finally(() =>
            console.log(
                `berhasil hapus image cabin ${imageNameToDelete} sebelum upload`
            )
        );
}
