import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateStay } from "../services/updateStay";
import { Database } from "../../../supabase/types/database.types";

type StayUpdate = Database["public"]["Tables"]["stays"]["Update"];

interface UpdateStayVariables {
    id: number;
    payload: StayUpdate;
}

export const useUpdateStay = () => {
    const queryClient = useQueryClient();

    const { mutate: editStay, isPending: isUpdatingStay } = useMutation({
        mutationFn: ({ id, payload }: UpdateStayVariables) => updateStay(id, payload),
        onSuccess: () => {
            toast.success("Villa updated");
            queryClient.invalidateQueries({ queryKey: ["stays"] });
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.message);
        },
    });

    return { editStay, isUpdatingStay };
};
