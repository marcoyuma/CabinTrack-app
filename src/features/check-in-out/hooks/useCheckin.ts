import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../../services/apiBookings";

/**
 * Custom React Query hook to handle booking check-in by updating booking status,
 * refreshing active queries, and providing user feedback
 */
export const useCheckin = () => {
    const queryClient = useQueryClient();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        // update booking status to checked-in and mark as paid (including breakfast data if provided)
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
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
                ...breakfast,
            }),

        // refresh active queries and notify user on success
        onSuccess: (data) => {
            queryClient.refetchQueries({ type: "active" });
            toast.success(`booking #${data.cabinId} successfully check in`);
        },

        // show error notification on failure
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { checkin, isCheckingIn };
};
