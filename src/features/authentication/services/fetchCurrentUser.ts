import supabase from "../../../supabase/supabase";
import { fetchSession } from "./fetchSession";

export const fetchCurrentUser = async () => {
    const session = await fetchSession();

    if (!session.session) return null;

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        console.error(error);
        throw new Error("Failed to get current user");
    }

    return user;
};
