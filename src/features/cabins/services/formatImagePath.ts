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
    image: string | File | undefined,
    bucketName: "cabin-images" | "avatars"
) => {
    // ! DEVELOPMENT PURPOSE
    if (!image) return null;

    const isNewImage = image instanceof File;

    // define dynamic value of image name based on type of image wether it's File or string
    const imageName = isNewImage
        ? `${uuidv4()}-${(image as File).name}`.replaceAll("/", "")
        : (image as string);

    // define variable to make a new image name path
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/${bucketName}/${imageName}`
        : imageName;

    return { isNewImage, imageName, imagePath };
};
