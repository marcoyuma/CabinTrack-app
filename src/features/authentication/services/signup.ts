import supabase from "../../../supabase/supabase";
import { fetchSession } from "./fetchSession";

export const signup = async ({
    fullName,
    email,
    password,
}: {
    fullName: string;
    email: string;
    password: string;
}) => {
    // fetch current session
    const previousSession = await fetchSession();

    // early nullish 'previousSession' catch
    if (!previousSession.session) return;

    // save previous session
    const originalUserSession = previousSession.session;

    // ! after signup, that new user data will replace the original user immediately
    // 1. signup and login based on the new user data and session
    const { data: signup, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName, avatar: "" } },
    });

    // 2. set session based on original user. and original user will be back
    if (previousSession) {
        await supabase.auth.setSession(originalUserSession);
    }

    if (error) {
        console.error(error);
        throw new Error("An error occured while signing up, failed to sign up");
    }

    return signup;
};
