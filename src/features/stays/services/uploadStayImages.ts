import supabase from "../../../supabase/supabase";
import { Database } from "../../../supabase/types/database.types";
import { ProcessedStayImage } from "../types/stay-image-upload.schema";

type StayImageInsert = Database["public"]["Tables"]["stay_images"]["Insert"];

export interface UploadStayImagesResult {
    inserted: Database["public"]["Tables"]["stay_images"]["Row"][];
    failedFiles: { role: string; error: string }[];
}

// Uploads each processed image to the `stays` storage bucket, then inserts the resulting rows
// into stay_images in one batch. Uses Promise.allSettled (not Promise.all) so one bad file
// doesn't abort uploads of the others — see useCreateStay.ts for how failedFiles is surfaced.
// Path convention: {stay_slug}/{sort_order}-{role}.webp — role is a free-text descriptive label
// (e.g. "exterior"), not a fixed enum, per ADMIN-PANEL-CONTEXT.md's own example.
export const uploadStayImages = async (
    stayId: number,
    slug: string,
    images: ProcessedStayImage[],
): Promise<UploadStayImagesResult> => {
    const uploadResults = await Promise.allSettled(
        images.map(async (image, sortOrder) => {
            const storagePath = `${slug}/${sortOrder}-${image.role}.webp`;

            const { error: storageError } = await supabase.storage
                .from("stays")
                .upload(storagePath, image.mainBlob, {
                    contentType: "image/webp",
                    cacheControl: "31536000",
                });

            if (storageError) throw storageError;

            const row: StayImageInsert = {
                stay_id: stayId,
                storage_path: storagePath,
                alt: image.alt,
                blur_data_url: image.blurDataUrl,
                width: image.width,
                height: image.height,
                sort_order: sortOrder,
            };

            return row;
        }),
    );

    const rowsToInsert: StayImageInsert[] = [];
    const failedFiles: { role: string; error: string }[] = [];

    uploadResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
            rowsToInsert.push(result.value);
        } else {
            console.error(result.reason);
            failedFiles.push({
                role: images[index].role,
                error:
                    result.reason instanceof Error
                        ? result.reason.message
                        : "upload failed",
            });
        }
    });

    if (rowsToInsert.length === 0) {
        return { inserted: [], failedFiles };
    }

    const { data, error } = await supabase
        .from("stay_images")
        .insert(rowsToInsert)
        .select();

    if (error) {
        console.error(error);
        throw new Error("server error, uploaded photos could not be saved");
    }

    return { inserted: data, failedFiles };
};
