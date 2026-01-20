import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../services/signup";
import toast from "react-hot-toast";

export const useSignup = () => {
    const queryClient = useQueryClient();

    const { mutate: signup, isPending: isSigningUp } = useMutation({
        mutationFn: ({
            fullName,
            email,
            password,
        }: {
            fullName: string;
            email: string;
            password: string;
        }) => signupApi({ fullName, email, password }),

        onSuccess: () => {
            toast.success(
                "Account created successfully! Please verify the email address provided"
            );
            // queryClient.setQueryData(['user'])
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },

        onError: (err) => {
            console.error(err);
            toast.error("Failed to signing up");
        },
    });

    return { signup, isSigningUp };
};
