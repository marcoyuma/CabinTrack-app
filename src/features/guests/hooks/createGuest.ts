import supabase from "../../../supabase/supabase";

export async function createGuest(newGuest: {
    fullName: string | null;
    email: string | null;
    nationalID: string | null;
    nationality: string | null;
    countryFlag: string | null;
}) {
    const { data, error } = await supabase
        .from("guests")
        .insert([{ ...newGuest }])
        .select();

    if (error) {
        console.error(error);
        throw new Error("server error, guest could not created");
    }

    return data;
}
