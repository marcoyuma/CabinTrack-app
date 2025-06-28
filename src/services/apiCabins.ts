import { FormDataType } from "../pages/Cabins/types/type";
import supabase from "../supabase/supabase";

type CabinType = FormDataType;

// define get all data from 'cabins' table database
export const getCabins = async () => {
    // destructure the data using 'supabase' client instance from 'cabins' table
    const { data, error } = await supabase.from("cabins").select("*");
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }
    return data;
};

// delete cabin based on id using supabase client instance from 'cabins'
export const deleteCabin = async (id: number) => {
    const { data, error } = await supabase.from("cabins").delete().eq("id", id);
    if (error) {
        console.error(error);
        throw new Error("cabin could not be deleted");
    }
    return data;
};

// create new cabins
export const createCabin = async (newCabin: CabinType) => {
    const { data, error } = await supabase
        .from("cabins")
        .insert([
            {
                ...newCabin,
                maxCapacity: +newCabin.maxCapacity,
                regularPrice: +newCabin.regularPrice,
                discount: +newCabin.discount,
            },
        ])
        .select();
    if (error) {
        console.error(error);
        throw new Error("cabin could not created");
    }
    return data;
};
