import supabase from "../../../supabase/supabase";

export const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
        throw new Error("Error while logging out, failed to logout");
    }
};
