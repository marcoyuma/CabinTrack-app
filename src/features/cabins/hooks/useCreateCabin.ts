import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin as createCabinApi } from "../../../services/apiCabins/createCabin";
import toast from "react-hot-toast";

/**
 * Custom React Query hook to handle cabin creation, including mutation state, cache invalidation, and user feedback
 */
export const useCreateCabin = () => {
    // define client for invalidate the new data
    const queryClient = useQueryClient();

    const {
        // status information returned while mutating or end mutating. named as 'isCreating'
        isPending: isCreating,
        // mutation function returned and renamed as 'createNewCabin' to trigger the actual mutation input data and call the callback function 'createCabin'
        mutate: createCabin,
    } = useMutation({
        // mutation function defined in '../../../services/apiCabins.ts'
        mutationFn: createCabinApi,

        // re-fetch cabins data and notify user on success
        onSuccess: () => {
            // invalidate logic based on 'queryKey' defined on '../CabinTable/CabinTable.tsx'
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // this will make react-query re-fetch and updatin ui
            // notification when successfully created
            toast.success("new cabin created successfully");
        },

        // show error notification on failure
        onError: (err) => {
            toast.error(err.message);
            console.error(err);
        },
    });
    return { isCreating, createCabin };
};
