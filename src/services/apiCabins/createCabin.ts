import { v4 as uuidv4 } from "uuid";

import supabase, { supabaseUrl } from "../../supabase/supabase";
import { cabinSchema, NewCabin } from "../types/cabins.type";

// create new cabins
export const createCabin = async (
    newCabin: // CabinType<File>
    NewCabin
) => {
    // zod handle newCabin type
    const parsedCabin = cabinSchema.parse(newCabin);

    console.log(parsedCabin);

    // isNewImage is a boolean to check if the image is a File type
    const isNewImage = parsedCabin.image instanceof File;
    console.log(isNewImage);

    // define dynamic image name based on type of image property
    const imageName: string = isNewImage
        ? `${uuidv4()}-${(parsedCabin.image as File).name}`.replaceAll("/", "")
        : (parsedCabin.image as string);

    // define image path based on supabaseUrl and image name purposely for prevent
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
        : imageName;

    console.log(imagePath);

    // 1. insert cabin data into 'cabins' table
    // using supabase client instance from 'cabins' table
    // and select the data after insertion
    const { data, error } = await supabase
        .from("cabins")
        .insert([
            {
                // spread parsedCabin property except image
                ...parsedCabin,
                image: imagePath,
            },
        ])
        .select();
    console.log(error);
    if (error) {
        console.error(error);
        throw new Error("cabin could not created");
    }

    // 2. upload image to storage
    // if there's image file from input file
    // if isNewImage then we need to upload the image to storage
    // if not then we can skip this step
    if (isNewImage) {
        const { error: storageError } = await supabase.storage
            .from("cabin-images")
            .upload(imageName, parsedCabin.image);

        // if there's an error while uploading the image
        // then we need to delete the cabin data from 'cabins' table
        // and throw an error
        // this is necessary to avoid having a cabin without an image
        // and to avoid having a cabin with an image that is not uploaded
        if (storageError) {
            await supabase.from("cabins").delete().eq("id", data[0].id);
            console.error(storageError);
            throw new Error(
                "image could not uploaded and cabin was not created"
            );
        }
    }
    return data;
};
