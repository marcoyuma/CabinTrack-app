import supabase from "../../supabase/supabase";
import { formatImagePath } from "../../features/cabins/services/formatImagePath";
import { parseCabinList } from "../parser/parseCabinList";
import { UpdateCabinInput } from "../../features/cabins/types/cabin.api.types";
import { updateCabinSchema } from "../../features/cabins/types/cabin.schema";
import { TablesUpdate } from "../../supabase/types/database.types";
import { deleteCabinImage } from "./deleteCabinImage";
import { getCabin } from "./getCabin";

/**
 * Update cabin data by ID, optionally replacing its image by uploading a new one and deleting the previous image to avoid wasted storage resources
 */
export const updateCabin = async (newCabin: UpdateCabinInput, id: number) => {
    // update cabin payload
    let payload: TablesUpdate<"cabins"> = {};

    // zod parsed cabin based on minimal required value
    const parsedCabin = updateCabinSchema.parse(newCabin);

    payload = { ...payload, ...parsedCabin };

    // Normalize cabin image input by determining whether it’s a new file and generating its storage-safe name and public path
    const { isNewImage, imageName, imagePath } = formatImagePath(
        newCabin.image,
        "cabin-images"
    );

    // 1. update tanpa image (default image path = null dan tidak mengubah properti image)
    const isImage = isNewImage && imageName && imagePath;

    if (isImage && newCabin.image) {
        // get previous cabin image name
        const previousImageName = await getCabin(id);

        // assign image path as new image property
        payload.image = imagePath;

        // upload
        const { error: storageError } = await supabase.storage
            .from("cabin-images")
            .upload(imageName, newCabin.image);

        // error.
        if (storageError) {
            console.error(storageError);
            console.log("Error Upload Photo Boss");
            throw new Error(storageError.message);
        }

        // Remove the previous cabin image from storage to free resources before replacing it with a new one
        await deleteCabinImage(previousImageName ?? "");
    }

    // set payload dengan data yang diubah dan imagePath baru
    const { data, error } = await supabase
        .from("cabins")
        .update({
            ...payload,
        })
        .eq("id", id)
        .select();

    if (error) {
        console.error(error);
        throw new Error(`server error, cabin could not updated`);
    }

    console.log(payload);

    return parseCabinList(data);
};
