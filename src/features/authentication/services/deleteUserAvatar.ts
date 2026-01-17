import supabase from "../../../supabase/supabase";
import { fetchCurrentUser } from "./fetchCurrentUser";

/**
 * Delete the currently authenticated user's avatar from storage before uploading a new one
 */
export async function deleteUserAvatar() {
    const previousUser = await fetchCurrentUser();
    const previousAvatarName = (previousUser?.user_metadata.avatar as string)
        .split("/")
        .pop();
    console.log(previousAvatarName);

    await supabase.storage
        .from("avatars")
        .remove([previousAvatarName ?? ""])
        .finally(() => console.log("berhasil hapus sebelum upload"));
}
