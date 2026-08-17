import z from "zod";
import { Database } from "../supabase/types/database.types";
import { guestReadSchema } from "./guests.type";
import { safeBoolean, safeNumber, safeString } from "../shared/utils/helpers";

// Supabase "bookings" table row type.
export type SupabaseBookingType =
    Database["public"]["Tables"]["bookings"]["Row"];

// Legacy cabin-booking-demo "cabins" join shape, kept local now that
// features/cabins (the Seaspace catalog rename target) no longer describes the old
// domain. Only features/check-in-out still reads this — see plan decision to keep
// check-in-out working against the old schema as-is.
const legacyCabinSchema = z.object({
    id: z.number(),
    name: z
        .string()
        .nullable()
        .transform((arg) => (arg && arg.trim().length > 0 ? arg : "-"))
        .default("-"),
    created_at: z.string(),
    description: safeString(),
    discount: safeNumber(),
    image: safeString(),
    maxCapacity: safeNumber(1),
    regularPrice: safeNumber(1),
});

// Booking list item schema (joins cabin + guest).
export const readBookingsSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    numNights: safeNumber(1),
    numGuests: safeNumber(1),
    status: safeString("unconfirmed"),
    totalPrice: safeNumber(1),
    cabins: legacyCabinSchema
        .pick({ name: true })
        .nullable()
        .transform((arg: { name: string } | null) => arg ?? { name: "-" }),
    guests: guestReadSchema
        .pick({ fullName: true, email: true })
        .nullable()
        .transform((arg) => arg ?? { fullName: "-", email: "-" }),
});

// Booking list item type derived from read schema.
export type Booking = z.infer<typeof readBookingsSchema>;

// Total booking count schema (from Supabase count).
export const bookingsLengthSchema = safeNumber(0);

// Booking list response shape (rows + count).
export type BookingsDataType = {
    bookings: Booking[];
    bookingsLength: number;
};

// Detailed booking schema for single booking reads.
export const detailedReadBookingSchema = z.object({
    cabinId: z.number(),
    cabinPrice: safeNumber(1),
    created_at: z.string(),
    endDate: z.string().nullable(),

    extrasPrice: safeNumber(0),
    guestId: z.number(),
    hasBreakfast: safeBoolean(),
    id: z.number(),
    isPaid: safeBoolean(),
    numGuests: safeNumber(1),
    numNights: safeNumber(1),
    observations: safeString("-"),
    startDate: z.string().nullable(),

    status: safeString("unconfirmed"),
    totalPrice: safeNumber(1),
    cabins: legacyCabinSchema.nullable().default({
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

// Booking update schema (detail without joins).
export const updateBookingSchema = detailedReadBookingSchema.omit({
    cabins: true,
    guests: true,
});

// Detailed booking type derived from schema.
export type DetailedBookingDataType = z.infer<typeof detailedReadBookingSchema>;

// Payload schema used when creating a booking row.
// Non-nullish by design: every field required and non-null.
export const createBookingPayloadSchema = z.object({
    cabinId: z.number(),
    cabinPrice: z.number(),
    endDate: z.string().min(1),
    extrasPrice: z.number(),
    guestId: z.number(),
    hasBreakfast: z.boolean(),
    isPaid: z.boolean(),
    numGuests: z.number(),
    numNights: z.number(),
    observations: z.string(),
    startDate: z.string().min(1),
    status: z.string().min(1),
    totalPrice: z.number(),
});
export type CreateBookingPayloadType = z.infer<typeof createBookingPayloadSchema>;

// date-range schema
const dateRangeSchema = z
    .object({
        startDate: z.date(),
        endDate: z.date(),
        key: z.string().optional(),
    })
    .refine((val) => val.endDate.getDate() > val.startDate.getDate(), {
        error: "check out must be atleast one day after check in",
    });

// CreateBookingForm input schema (registered fields only).
export const bookingFormSchema = z.object({
    dateRange: dateRangeSchema,
    cabinId: z
        .number()
        .refine((val) => val !== 0, { error: "Please select a cabin" }),
    fullName: z.string().trim().min(2, { error: "full name is required" }),
    nationality: z.string().trim().min(2, { error: "nationality is required" }),
    email: z.email({ error: "invalid email address" }),
    numGuests: z.coerce.number().min(1, { error: "minimum 1 guest" }),
    observations: z
        .string()
        .trim()
        .max(500, { error: "maximum 500 characters" })
        .nullable(),
    hasBreakfast: z.boolean(),
});

// CreateBookingForm input type (pre-coercion).
export type BookingFormInputType = z.input<typeof bookingFormSchema>;
// CreateBookingForm output type (post-coercion).
export type BookingFormDataType = z.output<typeof bookingFormSchema>;

// Booking filter union type.
export type FilterValueType = {
    field: "status";
    value: BookingFilterValue;
} | null;

// Booking filter values for status.
export type BookingFilterValue =
    | "unconfirmed"
    | "checked-in"
    | "checked-out"
    | "all";

// Booking sort payload shape.
export type BookingSortValue = {
    field: BookingSortFieldProperty;
    direction: BookingSortDirectionProperty;
};

// Booking sort fields.
export type BookingSortFieldProperty = "amount" | "startDate";
// Booking sort directions.
export type BookingSortDirectionProperty = "asc" | "desc";
