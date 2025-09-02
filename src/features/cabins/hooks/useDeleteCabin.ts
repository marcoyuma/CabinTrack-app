import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../../services/apiCabins/deleteCabin";
import toast from "react-hot-toast";

export const useDeleteCabin = () => {
    // define query client for invalidate logic
    const queryClient = useQueryClient();
    // this is the way we do mutate on react-query
    const {
        // status information returned while mutating or end mutating. named as 'isDeleting'
        isPending: isDeleting,
        // function returned to trigger the mutation and call the callback function 'deleteCabin'
        mutate: deleteCabin,
    } = useMutation({
        // mutationFn: (id: number) => deleteCabin(id),
        mutationFn: deleteCabinApi,
        // when mutation is success then invalidate the query and force it to be stale, this will automatically re-fetch data from server so the UI will stay in sync with updated 'cabin' query data.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
            toast.success("cabin deleted successfully");
        },
        onError: (err) => toast.error(err.message),
    });
    return { isDeleting, deleteCabin };
};
