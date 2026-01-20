import supabase from "../supabase/supabase";
import { DATA_PER_PAGE_SIZE } from "../shared/utils/constants";
import { getToday } from "../shared/utils/helpers";
import {
    BookingFilterValue,
    bookingsLengthSchema,
    readBookingsSchema,
    BookingsDataType,
    BookingSortValue,
    detailedReadBookingSchema,
    DetailedBookingDataType,
    updateBookingSchema,
} from "../types/bookings.type";
import {
    RecentBookingsSchema,
    RecentStaysSchema,
} from "../features/dashboard/types/dashboard.schema";

// read all data from 'bookings', 1 data from 'cabins', and 2 data from 'guests' table
export const readBookings = async (
    filter: { field: "status"; value: BookingFilterValue } | null,
    sortBy: BookingSortValue,
    page: number
): Promise<BookingsDataType> => {
    // 'from' is first data index per each page (starting with zero index) and 'to' is the maximum data index per each page
    const from = (page - 1) * DATA_PER_PAGE_SIZE;
    const to = from + DATA_PER_PAGE_SIZE - 1;

    // assign 'query' as supabase client instance and sort by 'field' and 'direction' properties
    let query = supabase
        .from("bookings")
        .select(
            "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",

            // length of the data (supabase feature of counting total rows).
            { count: "exact" }
        )
        // sort by 'direction' properties
        .order(sortBy.field, {
            ascending: sortBy.direction === "asc" ? true : false,
        })
        // took only from specified indexes
        .range(from, to);

    // not executed or get only specified by 'field' and 'value' filter properties with 'eq' method
    if (filter) {
        query = query.eq(filter.field, filter.value);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error(error);
        throw new Error(`server error, booking could not be loaded`);
    }

    // parsing into eligible cleaner bookings data
    const bookings = data.map((val) => readBookingsSchema.parse(val));
    const bookingsLength = bookingsLengthSchema.parse(count);
    console.log(bookingsLength);

    // return non nullable data
    return { bookings, bookingsLength };
};

export const readBooking = async (id: number) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("server error, booking not found");
    }
    console.log(`data hasil readBooking raw ${data}`);

    const booking = detailedReadBookingSchema.parse(data);
    console.log(`booking data setelah parsing: ${booking}`);

    return booking;
};

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export const getBookingsAfterDate = async (date: string) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("created_at, totalPrice, extrasPrice")
        .gte("created_at", date)
        .lte("created_at", getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error("server error, bookings could not get loaded");
    }

    console.log(data);

    const recentBookings = RecentBookingsSchema.parse(data);

    return recentBookings;
};

// Returns all STAYS that are were created after the given date
export const getStaysAfterDate = async (date: string) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("numNights, status, guests(fullName)")
        .gte("startDate", date)
        .lte("startDate", getToday());

    if (error) {
        console.error(error);
        throw new Error("server error, bookings could not get loaded");
    }

    const recentStays = RecentStaysSchema.parse(data);

    return recentStays;
};

// Activity means that there is a check in or a check out today
export const getStaysTodayActivity = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, guests(fullName, nationality, countryFlag)")
        .or(
            `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
        )
        .order("created_at");

    // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
    // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
    // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

    if (error) {
        console.error(error);
        throw new Error("server error, bookings could not get loaded");
    }
    return data;
};

// update booking
export const updateBooking = async (
    id: number,
    obj: {
        status: DetailedBookingDataType["status"];
        isPaid?: DetailedBookingDataType["isPaid"];
        hasBreakfast?: DetailedBookingDataType["hasBreakfast"];
        extrasPrice?: DetailedBookingDataType["extrasPrice"];
    }
) => {
    const { data, error } = await supabase
        .from("bookings")
        .update(obj)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("server error, booking could not be updated");
    }

    const booking = updateBookingSchema.parse(data);

    return booking;
};

export const deleteBooking = async (id: number) => {
    // REMEMBER RLS POLICIES
    const { data, error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("server error, booking could not be deleted");
    }
    return data;
};
