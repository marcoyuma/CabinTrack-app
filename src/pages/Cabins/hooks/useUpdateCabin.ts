import toast from "react-hot-toast";
import {
    NewCabin,
    updateCabin as updateCabinApi,
} from "../../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCabin = () => {
    // define client for invalidate the new data
    const queryClient = useQueryClient();

    const {
        // status information returned while mutating or end mutating. named as 'isCreating'
        isPending: isUpdating,
        // mutation function returned and renamed as 'createNewCabin' to trigger the actual mutation input data and call the callback function 'createCabin'
        mutate: updateCabin,
    } = useMutation({
        // mutation function defined in '../../../services/apiCabins.ts'
        // mutationFn: (id: number) => deleteCabin(id),
        // ! react query only allow 1 argument on mutate function
        // ! this still not clear
        mutationFn: ({
            newCabinData,
            id,
        }: {
            newCabinData: NewCabin;
            id: number | undefined;
        }) => updateCabinApi(newCabinData, id),
        // when mutation is success then invalidate the query and force it to be stale, this will automatically re-fetch data from server so the UI will stay in sync with updated 'cabin' query data.
        onSuccess: () => {
            // invalidate logic based on 'queryKey' defined on '../CabinTable/CabinTable.tsx'
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // this will make react-query re-fetch and updatin ui
            // notification when successfully created
            toast.success("cabin edited successfully");
            // reset form value
            // reset();
        },
        // when error logic
        onError: (err) => toast.error(err.message),
    });
    return { isUpdating, updateCabin };
};
