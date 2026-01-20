import z from "zod";
import { Database } from "../supabase/types/database.types";
import { guestReadSchema } from "./guests.type";
import { safeBoolean, safeNumber, safeString } from "../shared/utils/helpers";
import { readCabinSchema } from "../features/cabins/types/cabin.schema";

// raw database 'bookings' row type
export type SupabaseBookingType =
    Database["public"]["Tables"]["bookings"]["Row"];

// export type NewBooking = Omit<
//     z.infer<typeof readBookingsSchema>,
//     "cabins" | "guests"
// >;

// schcema for reading bookings data
export const readBookingsSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    numNights: safeNumber(1),
    numGuests: safeNumber(1),
    status: safeString("unconfirmed"),
    totalPrice: safeNumber(1),
    cabins: readCabinSchema
        .pick({ name: true })
        .nullable()
        .transform((arg) => arg ?? { name: "-" }),
    guests: guestReadSchema
        .pick({ fullName: true, email: true })
        .nullable()
        .transform((arg) => arg ?? { fullName: "-", email: "-" }),
});

// this will be the type of 'booking' object
export type Booking = z.infer<typeof readBookingsSchema>;

// schema for 'count' supabase proeperty
export const bookingsLengthSchema = safeNumber(0);

export type BookingsDataType = {
    bookings: Booking[];
    bookingsLength: number;
};

// type for bookings data query in useBookings
// export type BookingsDataType = z.infer<typeof bookingsDataSchema>;

// detailed booking read zod schema
export const detailedReadBookingSchema = z.object({
    cabinId: z.number(),
    cabinPrice: safeNumber(1),

    // created_at: z.iso.datetime(),
    created_at: z.string(),

    // endDate: z.iso.datetime().nullable(),
    endDate: z.string().nullable(),

    extrasPrice: safeNumber(0),
    guestId: z.number(),
    hasBreakfast: safeBoolean(),
    id: z.number(),
    isPaid: safeBoolean(),
    numGuests: safeNumber(1),
    numNights: safeNumber(1),
    observations: safeString("-"),

    // startDate: z.iso.datetime().nullable(),
    startDate: z.string().nullable(),

    status: safeString("unconfirmed"),
    totalPrice: safeNumber(1),
    cabins: readCabinSchema.nullable().default({
        id: 0,
        name: "-",
        created_at: "-",
        description: "-",
        discount: 0,
        image: "-",
        maxCapacity: 0,
        regularPrice: 0,
    }),
    guests: guestReadSchema.nullable().default({
        countryFlag: "🇺🇳",
        created_at: "-",
        email: "-",
        fullName: "-",
        id: 0,
        nationalID: "-",
        nationality: "-",
    }),
});

//
// schema for update booking
export const updateBookingSchema = detailedReadBookingSchema.omit({
    cabins: true,
    guests: true,
});

// detailed booking data type
export type DetailedBookingDataType = z.infer<typeof detailedReadBookingSchema>;

// filter type
export type FilterValueType = {
    field: "status";
    value: BookingFilterValue;
} | null;

// filter properties
export type BookingFilterValue =
    | "unconfirmed"
    | "checked-in"
    | "checked-out"
    | "all";

// sort type
export type BookingSortValue = {
    field: BookingSortFieldProperty;
    direction: BookingSortDirectionProperty;
};

export type BookingSortFieldProperty = "amount" | "startDate";
export type BookingSortDirectionProperty = "asc" | "desc";
