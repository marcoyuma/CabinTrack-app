import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../services/updateUser";
import toast from "react-hot-toast";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    const { mutate: updateUser, isPending: isUpdatingNewUser } = useMutation({
        mutationFn: ({
            fullName,
            avatar,
            password,
        }: {
            fullName?: string;
            avatar?: File;
            email?: string;
            password?: string;
        }) => updateUserApi({ fullName, avatar, password }),
        onSuccess: (user) => {
            toast.success("User account successfully updated");
            queryClient.invalidateQueries({ queryKey: ["user"] });
            console.log(user);
            console.log(user?.user_metadata.avatar);
        },
        onError: (err) => {
            console.error(err);
            console.log(err);

            toast.error(err.message);
        },
    });

    return { updateUser, isUpdatingNewUser };
}
