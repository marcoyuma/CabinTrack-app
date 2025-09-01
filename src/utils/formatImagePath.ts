import { v4 as uuidv4 } from "uuid";
import { supabaseUrl } from "../supabase/supabase";

export const formatImagePath = (image: string | File | undefined) => {
    const isNewImage = image instanceof File;
    console.log(isNewImage);

    // define dynamic value of image name based on type of image wether it's File or string
    const imageName = isNewImage
        ? `${uuidv4()}-${(image as File).name}`.replaceAll("/", "")
        : (image as string);

    console.log(imageName);

    // define variable to make a new image name path
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
        : imageName;

    return { isNewImage, imageName, imagePath };
};
