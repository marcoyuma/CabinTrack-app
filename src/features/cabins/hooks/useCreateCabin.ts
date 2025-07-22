import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin as createCabinApi } from "../../../services/apiCabins";
import toast from "react-hot-toast";

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
        // mutationFn: (id: number) => deleteCabin(id),
        mutationFn: createCabinApi,
        // when mutation is success then invalidate the query and force it to be stale, this will automatically re-fetch data from server so the UI will stay in sync with updated 'cabin' query data.
        onSuccess: () => {
            // invalidate logic based on 'queryKey' defined on '../CabinTable/CabinTable.tsx'
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // this will make react-query re-fetch and updatin ui
            // notification when successfully created
            toast.success("new cabin created successfully");
            // reset form value
            // reset();
        },
        // when error logic
        onError: (err) => toast.error(err.message),
    });
    return { isCreating, createCabin };
};
