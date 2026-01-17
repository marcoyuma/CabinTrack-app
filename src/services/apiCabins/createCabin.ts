import supabase from "../../supabase/supabase";

import { formatImagePath } from "../../features/cabins/services/formatImagePath";
import { parseCabinList } from "../parser/parseCabinList";
import {
    Cabin,
    createCabinSchema,
} from "../../features/cabins/types/cabin.schema";

type CreateCabinInput = {
    name: string;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
    description: string;
    image: File | null;
};

// create new cabins function. used in useCreateCabin query mutation function
export const createCabin = async (
    newCabin: CreateCabinInput
): Promise<Cabin[]> => {
    // zod handle newCabin type safety
    const parsedCabin = createCabinSchema.parse(newCabin);

    // destructured needed object
    const { isNewImage, imageName, imagePath } = formatImagePath(
        newCabin.image,
        "cabin-images"
    );
    const isImage = isNewImage && imageName && imagePath;

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
        throw new Error(`server error, cabin could not created`);
    }

    // 2. upload image to storage when met the condition
    if (isImage && newCabin.image) {
        const { error: storageError } = await supabase.storage
            .from("cabin-images")
            .upload(imageName, newCabin.image);

        // delete cabin if there's cabin uploaded without image
        if (storageError) {
            await supabase.from("cabins").delete().eq("id", cabins[0].id);
            console.error(storageError);
            throw new Error(
                `server error, image could not uploaded and cabin was not created`
            );
        }
    }

    return parseCabinList(cabins);
};
