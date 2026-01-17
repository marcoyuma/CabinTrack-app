import toast from "react-hot-toast";
import { updateCabin as updateCabinApi } from "../../../services/apiCabins/updateCabin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CabinPayload } from "../types/cabin.schema";

export const useUpdateCabin = () => {
    // define client for invalidate the new data
    const queryClient = useQueryClient();

    const {
        // status information returned while mutating or end mutating. named as 'isCreating'
        isPending: isUpdating,
        // mutation function returned and renamed as 'createNewCabin' to trigger the actual mutation input data and call the callback function 'createCabin'
        mutate: updateCabin,
    } = useMutation({
        // mutation function
        mutationFn: ({
            newCabinData,
            id,
        }: {
            // newCabinData: NewCabin;
            newCabinData: CabinPayload;
            id: number;
        }) => updateCabinApi(newCabinData, id),
        // when mutation is success then invalidate the query and force it to be stale, this will automatically re-fetch data from server so the UI will stay in sync with updated 'cabin' query data.
        onSuccess: (data) => {
            // invalidate logic based on 'queryKey' defined on '../CabinTable/CabinTable.tsx'
            queryClient.invalidateQueries({ queryKey: ["cabins"] }); // this will make react-query re-fetch and updatin ui
            // notification when successfully created
            toast.success("cabin edited successfully");
            // reset form value
            // reset();
            console.log(data);
        },
        // when error logic
        onError: (err) => {
            toast.error(err.message);
            console.error(err.message);
            throw new Error(`Error while updating cabin: ${err}`);
        },
    });
    return { isUpdating, updateCabin };
};
