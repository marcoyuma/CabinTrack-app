import supabase from "../../../supabase/supabase";

export async function fetchSession() {
    const { data: session } = await supabase.auth.getSession();

    return session;
}
