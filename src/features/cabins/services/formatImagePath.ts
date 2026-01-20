import { v4 as uuidv4 } from "uuid";
import { supabaseUrl } from "../../../supabase/supabase";

/**
 * Formats the image path for storage in Supabase based on the image type and bucket name.
 *
 * @param image - raw image file type
 * @param bucketName - destination supabase bucket storage name
 *
 */
export const formatImagePath = (
    image: File | string | null,
    bucketName: "cabin-images" | "avatars"
) => {
    // new file image indicator
    const isNewImage = image instanceof File;

    // define dynamic value of image name based on type of image wether it's File or string
    const imageName = isNewImage
        ? `${uuidv4()}-${image.name}`.replaceAll("/", "")
        : image;

    // define variable to make a new image name path
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/${bucketName}/${imageName}`
        : imageName;

    return { isNewImage, imageName, imagePath };
};
