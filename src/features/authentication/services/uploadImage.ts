import supabase from "../../../supabase/supabase";

/**
 * Upload an image file to the specified Supabase storage bucket and return any upload error
 */
export async function uploadImage({
    image,
    imageName,
    bucketName,
}: {
    image: File;
    imageName: string;
    bucketName: "cabin-images" | "avatars";
}) {
    // upload new image to bucket storage
    const { error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(imageName, image);

    if (storageError) {
        console.error(storageError);
    }

    console.log("image uploaded...");

    return storageError;
}
