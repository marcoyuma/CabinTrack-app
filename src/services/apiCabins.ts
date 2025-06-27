import supabase from "../supabase/supabase";

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
        throw new Error("cabin could not be deleted...");
    }
    return data;
};
