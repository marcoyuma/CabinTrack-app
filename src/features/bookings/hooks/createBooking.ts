import supabase from "../../../supabase/supabase";

export async function createBooking(newBooking: {
    // fullName: string | null;
    // email: string | null;
    // nationalID: string | null;
    // nationality: string | null;
    // countryFlag: string | null;
    cabinId?: number | null;
    cabinPrice?: number | null;
    endDate?: string | null;
    extrasPrice?: number | null;
    guestId?: number | null;
    hasBreakfast?: boolean | null;
    isPaid?: boolean | null;
    numGuests?: number | null;
    numNights?: number | null;
    observations?: string | null;
    startDate?: string | null;
    status?: string | null;
    totalPrice?: number | null;
}) {
    const { data, error } = await supabase
        .from("bookings")
        .insert([{ ...newBooking }])
        .select();

    if (error) {
        console.error(error);
        throw new Error("server error, guest could not created");
    }

    return data;
}
