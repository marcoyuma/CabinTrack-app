import supabase from "../../supabase/supabase";
import { cabinUpdateSchema, NewCabin } from "../../types/cabins.type";
import { formatImagePath } from "../../utils/formatImagePath";

// update cabins function based on cabin id. used in useUpdateCabin query mutation function
export const updateCabin = async (newCabin: NewCabin, id: number) => {
    try {
        console.log(newCabin);
        console.log(id);

        // zod parsed cabin based on minimal required value
        const parsedCabin = cabinUpdateSchema.parse(newCabin);

        const { isNewImage, imageName, imagePath } = formatImagePath(
            parsedCabin.image
        );

        // 1. update cabin data into 'cabins' table
        // using supabase client instance from 'cabins' table, select the data after update, this will update the cabin data based on the id
        const { data, error } = await supabase
            .from("cabins")
            .update({
                // spread rest of properties except image
                ...parsedCabin,
                image: imagePath,
            })
            .eq("id", id)
            .select();

        if (error) {
            console.error(error);
            throw new Error("cabin could not updated");
        }

        // 2. upload image to storage if there's image file from input file
        // if isNewImage then we need to upload the image to storage
        // if not then we can skip this step
        if (isNewImage) {
            const { error: storageError } = await supabase.storage
                .from("cabin-images")
                .upload(imageName, parsedCabin.image as File);

            // delete cabin if there's a cabin data uploaded without image
            if (storageError) {
                console.error(storageError);
                throw new Error(
                    "image could not uploaded and cabin was not updated"
                );
            }
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in updateCabin: ", error.message);
            throw new Error("An error occured, update cabin failed");
        } else {
            console.error("Unknown error in updateCabin: ", error);
            throw new Error("Unknown error occured while updating the cabin");
        }
    }
};
