import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../../services/apiBookings";

// custom hook for checking in and update booking property
export const useCheckin = () => {
    const queryClient = useQueryClient();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        // mutationFn calling 'updateBooking' when 'checkin' triggered and update status
        mutationFn: ({
            bookingId,
            breakfast,
        }: {
            bookingId: number;
            breakfast: {
                extrasPrice: number;
                hasBreakfast: boolean;
                totalPrice: number;
            };
        }) =>
            // updateBooking(bookingId, { status: "check-in", isPaid: true }),
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
                ...breakfast,
            }),
        // onSuccess is receive some data that we can use in this case in toast notification
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["today-activity"] });
            toast.success(`booking #${data.cabinId} successfully check in`);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { checkin, isCheckingIn };
};
