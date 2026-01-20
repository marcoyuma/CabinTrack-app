import supabase from "../../../supabase/supabase";

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error(`login error: ${error}`);
        throw new Error("Error while authentication, failed to login");
    }
    console.log("login: ", data);

    return data;
};
