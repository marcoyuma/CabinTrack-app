import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingAPI } from "./createBooking";
import toast from "react-hot-toast";

export function useCreateBooking() {
    const queryClient = useQueryClient();

    const { isPending: isCreatingBooking, mutate: createBooking } = useMutation(
        {
            mutationFn: createBookingAPI,
            onSuccess: () => {
                toast.success("new Booking created successfully");
            },
            onError: (err) => {
                toast.error(err.message);
            },
        },
    );

    return { isCreatingBooking, createBooking };
}
