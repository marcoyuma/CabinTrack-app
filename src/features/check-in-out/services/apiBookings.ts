import supabase from "../../../supabase/supabase";
import { getToday } from "../../../shared/utils/helpers";
import {
    detailedReadBookingSchema,
    DetailedBookingDataType,
    updateBookingSchema,
} from "../../../types/bookings.type";

// Trimmed from the old features/bookings/hooks/apiBookings.ts — only the reads/writes
// check-in-out actually needs survive here. features/bookings itself (CRUD list/table/
// forms) is deleted; this file still points at the old cabin-booking-demo schema
// (`bookings`/`cabins`/`guests` tables), same as the rest of check-in-out — out of scope
// to fix, kept working as-is per the migration plan.

/**
 * Fetches detailed booking information by booking id.
 */
export const readBooking = async (id: number) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("readBooking:", error);
        throw new Error("Unable to load data. Please try again.");
    }

    return detailedReadBookingSchema.parse(data);
};

/**
 * Fetches today's stay activity for check-ins and check-outs.
 */
export const getStaysTodayActivity = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, guests(fullName, nationality, countryFlag)")
        .or(
            `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
        )
        .order("created_at");

    if (error) {
        console.error("getStaysTodayActivity:", error);
        throw new Error("Unable to load data. Please try again.");
    }
    return data;
};

/**
 * Updates selected fields on a booking.
 */
export const updateBooking = async (
    id: number,
    obj: {
        status: DetailedBookingDataType["status"];
        isPaid?: DetailedBookingDataType["isPaid"];
        hasBreakfast?: DetailedBookingDataType["hasBreakfast"];
        extrasPrice?: DetailedBookingDataType["extrasPrice"];
    },
) => {
    const { data, error } = await supabase
        .from("bookings")
        .update(obj)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("updateBooking:", error);
        throw new Error("Unable to complete the request. Please try again.");
    }

    return updateBookingSchema.parse(data);
};
