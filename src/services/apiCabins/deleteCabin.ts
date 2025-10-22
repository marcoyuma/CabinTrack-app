import supabase from "../../supabase/supabase";
import { Cabin } from "../../types/cabins.type";

// delete cabin based on id using supabase client instance from 'cabins'. used in useDeleteCabin query mutation function
export const deleteCabin = async (cabin: Cabin): Promise<void> => {
    try {
        // delete cabin data from 'cabins' table
        // using supabase client instance from 'cabins' table
        const { error } = await supabase
            .from("cabins")
            .delete()
            .eq("id", cabin.id);

        if (error) {
            console.error(error);
            throw new Error("cabin could not be deleted");
        }

        // delete image from supabase storage using supabase client instance from 'cabin-images' storage
        // this is necessary to remove the image from the storage since it can't be deleted the image by its path
        // we need to delete the image by its name this is necessary to avoid having an image in the storage that is not used by any cabin
        // and to avoid having an image that is not deleted when the cabin is deleted
        const { data, error: storageError } = await supabase.storage

            // supabase storage name
            .from("cabin-images")

            // remove the image by its name
            // we need to split the image path based by '/' key and get the last element which is the image name
            .remove([cabin.image?.split("/").pop() ?? ""]);
        if (storageError) {
            console.error(storageError);
            throw new Error("could not delete image from storage");
        }
        console.log(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in deleteCabin: ", error.message);
            throw new Error("An error occured, delete cabin failed");
        } else {
            console.error("Unknown error in deleteCabin: ", error);
            throw new Error("Unknown error while deleting cabin");
        }
    }
};
