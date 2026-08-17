import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStay } from "../services/deleteStay";

export const useDeleteStay = () => {
    const queryClient = useQueryClient();

    const { mutate: removeStay, isPending: isDeleting } = useMutation({
        mutationFn: deleteStay,
        onSuccess: () => {
            toast.success("Villa deleted");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
            queryClient.invalidateQueries({ queryKey: ["stay-images"] });
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.message);
        },
    });

    return { removeStay, isDeleting };
};
