import supabase from "../../../supabase/supabase";
import { formatImagePath } from "../../cabins/services/formatImagePath";
import { deleteUserAvatar } from "./deleteUserAvatar";
import { uploadImage } from "./uploadImage";

/**
 * api function for updating user properties
 *
 * @param param0 opsional user properties
 * @returns User | null
 */
export async function updateUser({
    fullName,
    password,
    avatar,
}: {
    fullName?: string;
    password?: string;
    avatar?: File;
}) {
    // new user data payload
    const payload: Parameters<typeof supabase.auth.updateUser>[0] = {};

    // if there's new avatar included
    if (avatar) {
        // image properties that will be uploaded
        const {
            isNewImage: isNewAvatar,
            imageName: avatarName,
            imagePath: avatarPath,
        } = formatImagePath(avatar, "avatars");

        // new avatar indicator
        const isAvatar = isNewAvatar && avatarName && avatarPath;

        if (isAvatar) {
            // delete previous avatar from bucket storage
            await deleteUserAvatar();

            // upload new avatar to bucket storage
            const storageError = await uploadImage({
                image: avatar,
                imageName: avatarName,
                bucketName: "avatars",
            });
            console.log("avatar uploaded...");

            // failed upload avatar to storage condition
            if (!storageError) {
                // redefining payload for conditional updating
                payload.data = { ...payload.data, avatar: avatarPath };
            }
        }
    }

    // 1. update fullName (conditional)
    if (fullName) {
        payload.data = {
            ...payload.data,
            fullName,
        };
    }

    // 2. update password (conditional)
    if (password) {
        payload.password = password;
        console.log(password);
        console.log(payload.password);
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.updateUser(payload);

    if (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return user;
}
