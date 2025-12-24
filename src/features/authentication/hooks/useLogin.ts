import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../services/login";
import toast from "react-hot-toast";

export const useLogin = () => {
    const queryClient = useQueryClient();

    const { mutate: login, isPending: isLoggingIn } = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => loginApi({ email, password }),

        onSuccess: (user) => {
            console.log("login data: ", user);
            console.log("login data: ", user.user.role);
            toast.success("login successfully");
            queryClient.setQueryData(["user"], user.user);
        },

        onError: (err) => {
            console.error(err);
            toast.error("Provided email or password are incorrect");
        },
    });

    return { login, isLoggingIn };
};
