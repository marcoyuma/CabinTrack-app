import supabase from "../supabase/supabase";
import { DATA_PER_PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import {
    BookingFilterValue,
    bookingsLengthSchema,
    bookingsReadSchema,
    BookingsDataType,
    BookingSortValue,
} from "../types/bookings.type";

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
        throw new Error(`Booking could not be loaded: ${error.message}`);
    }

    // parsing into eligible cleaner bookings data
    const bookings = data.map((val) => bookingsReadSchema.parse(val));
    const bookingsLength = bookingsLengthSchema.parse(count);
    console.log(bookingsLength);

    // return non nullable data
    return { bookings, bookingsLength };
};

export const getBooking = async (id: number) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking not found");
    }

    return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
    const { data, error } = await supabase
        .from("bookings")
        .select("created_at, totalPrice, extrasPrice")
        .gte("created_at", date)
        .lte("created_at", getToday({ end: true }));

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
    const { data, error } = await supabase
        .from("bookings")
        // .select('*')
        .select("*, guests(fullName)")
        .gte("startDate", date)
        .lte("startDate", getToday());

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
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
        throw new Error("Bookings could not get loaded");
    }
    return data;
}

export async function updateBooking(id, obj) {
    const { data, error } = await supabase
        .from("bookings")
        .update(obj)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not be updated");
    }
    return data;
}

export async function deleteBooking(id) {
    // REMEMBER RLS POLICIES
    const { data, error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Booking could not be deleted");
    }
    return data;
}
