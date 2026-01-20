import toast from "react-hot-toast";
import { updateCabin as updateCabinApi } from "../../../services/apiCabins/updateCabin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CabinPayload } from "../types/cabin.schema";

/**
 * Custom React Query hook to update an existing cabin, handle mutation state,
 * invalidate cached cabin data, and provide user feedback via toast notifications
 */
export const useUpdateCabin = () => {
    // define client for invalidate the new data
    const queryClient = useQueryClient();

    const {
        // status information returned while mutating or end mutating
        isPending: isUpdating,
        // mutation function to trigger the cabin update
        mutate: updateCabin,
    } = useMutation({
        // mutation function
        mutationFn: ({
            newCabinData,
            id,
        }: {
            newCabinData: CabinPayload;
            id: number;
        }) => updateCabinApi(newCabinData, id),

        // re-fetch cabins data and notify user on success
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            toast.success("cabin edited successfully");
        },

        // show error notification on failure
        onError: (err) => {
            toast.error(err.message);
            console.error(err);
        },
    });

    return { isUpdating, updateCabin };
};
