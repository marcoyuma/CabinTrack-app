import { CabinType } from "../features/cabins/types/type";
import supabase, { supabaseUrl } from "../supabase/supabase";
import { v4 as uuidv4 } from "uuid";

// type for new cabin params
export interface NewCabin {
    name: string | undefined;
    maxCapacity: number | string | undefined;
    regularPrice: number | string | undefined;
    discount: number | string | undefined;
    description: string | undefined;
    // type for default file input
    image: File | string;
}

// delete cabin based on id using supabase client instance from 'cabins'
export const deleteCabin = async (cabin: CabinType) => {
    // delete cabin data from 'cabins' table
    // using supabase client instance from 'cabins' table
    const { error } = await supabase.from("cabins").delete().eq("id", cabin.id);
    if (error) {
        console.error(error);
        throw new Error("cabin could not be deleted");
    }

    // delete image from supabase storage
    // using supabase client instance from 'cabin-images' storage
    // we need to split the image path by '/' and get the last element
    // which is the image name
    // this is necessary to remove the image from the storage
    // since we can't delete the image by its path
    // we need to delete the image by its name
    // this is necessary to avoid having an image in the storage that is not used by any cabin
    // and to avoid having an image that is not deleted when the cabin is deleted
    const { data, error: storageError } = await supabase.storage

        // supabase storage name
        .from("cabin-images")

        // remove the image by its name
        // we need to split the image path by '/' and get the last element
        .remove([cabin.image?.split("/").pop() ?? ""]);
    if (storageError) {
        console.error(storageError);
        throw new Error("could not delete image from storage");
    }
    console.log(data);
};

// create new cabins
export const createCabin = async (
    newCabin: // CabinType<File>
    NewCabin
) => {
    console.log(newCabin);

    // isNewImage is a boolean to check if the image is a File type
    const isNewImage = newCabin.image instanceof File;
    console.log(isNewImage);

    // define variable to make a new image name path
    let imageName;

    // if image is a file then we need to create a new name for it
    if (isNewImage) {
        imageName = `${uuidv4()}-${(newCabin.image as File).name}`.replaceAll(
            "/",
            ""
        );
        console.log(imageName);
    }
    // if image is a string then we can use it as is
    else {
        imageName = newCabin.image as string;
        console.log(imageName);
    }

    // define image path based on supabaseUrl and image name
    // if isNewImage then we need to create a new path for it
    // if not then we can use the existing image name
    // this is necessary to avoid uploading the same image again
    // and to avoid using the same image name for different cabins
    // this is necessary to avoid conflicts with existing images
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
        : imageName;

    // 1. insert cabin data into 'cabins' table
    // using supabase client instance from 'cabins' table
    // and select the data after insertion
    const { data, error } = await supabase
        .from("cabins")
        .insert([
            {
                ...newCabin,
                maxCapacity: newCabin.maxCapacity ? +newCabin.maxCapacity : 0,
                regularPrice: newCabin.regularPrice
                    ? +newCabin.regularPrice
                    : 0,
                discount: newCabin.discount ? +newCabin.discount : 0,
                // insert image to supabase storage
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
            .upload(imageName, newCabin.image);

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

// update cabin data
// this function will update the cabin data based on the id
// and the new cabin data passed as a parameter
export const updateCabin = async (newCabin: NewCabin, id?: number) => {
    const isNewImage = newCabin.image instanceof File;
    console.log(isNewImage);

    let imageName: string;
    if (isNewImage) {
        imageName = `${uuidv4()}-${(newCabin.image as File).name}`.replaceAll(
            "/",
            ""
        );
    } else {
        imageName = newCabin.image as string;
        console.log(imageName);
    }

    // define variable to make a new image name path
    const imagePath = isNewImage
        ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
        : (newCabin.image as string);

    // 1. update cabin data into 'cabins' table
    // using supabase client instance from 'cabins' table
    // and select the data after update
    // this will update the cabin data based on the id
    // and the new cabin data passed as a parameter
    const { data, error } = await supabase
        .from("cabins")
        .update({
            ...newCabin,
            maxCapacity: newCabin.maxCapacity ? +newCabin.maxCapacity : 0,
            regularPrice: newCabin.regularPrice ? +newCabin.regularPrice : 0,
            discount: newCabin.discount ? +newCabin.discount : 0,
            // insert image to supabase storage
            image: imagePath,
        })
        .eq("id", id ?? 0)
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
            .upload(imageName, newCabin.image as File);

        // delete cabin if there's a cabin data uploaded without image
        if (storageError) {
            console.error(storageError);
            throw new Error(
                "image could not uploaded and cabin was not updated"
            );
        }
    }
    return data;
};
