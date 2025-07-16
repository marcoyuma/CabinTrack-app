import { Cabin } from "../pages/Cabins/CabinRow/CabinRow";
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

// define get all data from 'cabins' table database
export const getCabins = async () => {
    // destructure the data using 'supabase' client instance from 'cabins' table
    const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .order("created_at");
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }

    return data;
};

// delete cabin based on id using supabase client instance from 'cabins'
export const deleteCabin = async (
    // before
    // id: number,
    // after
    cabin: Cabin
) => {
    const { error } = await supabase.from("cabins").delete().eq("id", cabin.id);
    if (error) {
        console.error(error);
        throw new Error("cabin could not be deleted");
    }
    const { data, error: storageError } = await supabase.storage
        // supabase storage name
        .from("cabin-images")
        // supabase method
        .remove([cabin.image?.split("/").pop() ?? ""]);
    if (storageError) {
        console.error(storageError);
        throw new Error("could not delete image from storage");
    }
    console.log(data);
};

// create new cabins
export const createCabin = async (newCabin: CabinType<File>) => {
    console.log(newCabin);
    // define variable to make a new image name path
    const imageName = `${uuidv4()}-${newCabin.image.name}`.replaceAll("/", "");

    // define image path based on supabaseUrl and image name
    const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

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
    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // delete cabin if there's a cabin data uploaded without image
    if (storageError) {
        // await supabase.from("cabins").delete().eq("id", data[0].id);
        await supabase.from("cabins").delete().eq("id", data[0].id);
        console.error(storageError);
        throw new Error("image could not uploaded and cabin was not created");
    }
    return data;
};

export const updateCabin = async <T>(newCabin: CabinType<T>, id?: number) => {
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
    console.log(error);
    // 2. upload image to storage if there's image file from input file
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
