import supabase from "../../supabase/supabase";
import {
    Cabin,
    cabinCreateSchema,
    cabinReadSchema,
    NewCabin,
} from "../../types/cabins.type";
import { formatImagePath } from "../../utils/formatImagePath";

// create new cabins function. used in useCreateCabin query mutation function
export const createCabin = async (newCabin: NewCabin): Promise<Cabin[]> => {
    try {
        // zod handle newCabin type safety
        const parsedCabin = cabinCreateSchema.parse(newCabin);

        // destructured needed object
        const { isNewImage, imageName, imagePath } = formatImagePath(
            parsedCabin.image
        );

        // 1. insert cabin data into 'cabins' table. return new data including previous insert
        const { data: cabins, error } = await supabase
        .from("cabins")
        .insert([
            {
                // spread parsedCabin property except image
                ...parsedCabin,
                image: imagePath,
            },
        ])
        .select();

    if (error) {
        console.error(error);
            throw new Error("Cabin could not created");
    }

        // 2. upload image to storage when met the condition
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
