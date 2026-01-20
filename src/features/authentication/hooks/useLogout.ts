import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../services/logout";
import toast from "react-hot-toast";

export const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate: logout, isPending: isLoggingOut } = useMutation({
        mutationFn: logoutApi,

        onSuccess: () => {
            queryClient.removeQueries();
            toast.success("Logout succesful");
        },

        onError: (err) => {
            console.error(err);
            toast.error("Logout fail");
        },
    });

    return { logout, isLoggingOut };
};
