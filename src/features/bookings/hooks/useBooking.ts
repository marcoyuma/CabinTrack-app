import { useQuery } from "@tanstack/react-query";
import { readBooking } from "../../../services/apiBookings";
import { useParams } from "react-router-dom";

/**
 * Custom React Query hook to fetch a single booking by ID from the route parameters
 * and manage its loading and error states
 */
export const useBooking = () => {
    const { bookingId } = useParams();

    console.log(bookingId);

    if (!bookingId) {
        throw new Error("Missing id parameter");
    }

    const {
        isLoading: isBookingLoading,
        data: booking,
        error: errorBooking,
    } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => readBooking(+bookingId),
        // prevent infinite retry on error
        retry: false,
    });

    return { isBookingLoading, booking, errorBooking };
};
