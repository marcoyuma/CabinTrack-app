import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";

// custom hook for checking in and update booking property
export const useCheckout = () => {
    const queryClient = useQueryClient();

    const { mutate: checkout, isPending: isCheckingOut } = useMutation({
        // mutationFn calling 'updateBooking' when 'checkin' triggered and update status
        // mutationFn: (id: number) =>
        mutationFn: (bookingId: number) =>
            // updateBooking(bookingId, { status: "check-in", isPaid: true }),
            updateBooking(bookingId, {
                status: "checked-out",
            }),

        // onSuccess is receive some data that we can use in this case in toast notification
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["today-activity"] });
            toast.success(`booking #${data.cabinId} successfully checked out`);
        },

        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { checkout, isCheckingOut };
};
