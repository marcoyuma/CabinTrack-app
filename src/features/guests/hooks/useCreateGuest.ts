import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuest as createGuestAPI } from "./createGuest";
import toast from "react-hot-toast";

export function useCreateGuest() {
    const queryClient = useQueryClient();

    const { isPending: isCreatingGuest, mutate: createGuest } = useMutation({
        mutationFn: createGuestAPI,
        onSuccess: () => {
            toast.success("new guest created successfully");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { isCreatingGuest, createGuest };
}
