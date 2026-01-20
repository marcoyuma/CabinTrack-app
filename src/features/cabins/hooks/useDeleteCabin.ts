import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../../services/apiCabins/deleteCabin";
import toast from "react-hot-toast";

/**
 * Custom React Query hook to delete a cabin, manage mutation state,
 * invalidate cached cabin data, and show user feedback notifications
 */
export const useDeleteCabin = () => {
    // define query client for invalidate logic
    const queryClient = useQueryClient();

    const {
        // status information returned while mutating or end mutating
        isPending: isDeleting,
        // function to trigger the delete mutation
        mutate: deleteCabin,
    } = useMutation({
        mutationFn: deleteCabinApi,

        // re-fetch cabins data and notify user on success
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            toast.success("cabin deleted successfully");
        },

        // show error notification on failure
        onError: (err) => {
            toast.error(err.message);
            console.error(err);
        },
    });

    return { isDeleting, deleteCabin };
};
