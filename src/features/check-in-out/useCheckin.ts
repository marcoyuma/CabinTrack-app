import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";

// custom hook for checking in and update booking property
export const useCheckin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        // mutationFn calling 'updateBooking' when 'checkin' triggered and update status
        mutationFn: (id: number) =>
            updateBooking(id, { status: "check-in", isPaid: true }),
        // onSuccess is receive some data that we can use in this case in toast notification
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success(`booking #${data.cabinId} successfully checked in`);
            navigate("/");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { checkin, isCheckingIn };
};
