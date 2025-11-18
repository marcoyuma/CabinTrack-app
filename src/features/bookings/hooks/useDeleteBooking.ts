import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingAPI } from "../../../services/apiBookings";
import toast from "react-hot-toast";

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();

    const { isPending: isBookingDeleting, mutate: deleteBooking } = useMutation(
        {
            mutationFn: (id: number) => deleteBookingAPI(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["bookings"] });
                toast.success("booking deleted successfully");
            },
            onError: (err) => {
                toast.error(err.message);
            },
        }
    );
    return { isBookingDeleting, deleteBooking };
};
