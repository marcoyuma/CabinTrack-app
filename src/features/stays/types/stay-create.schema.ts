import z from "zod";

// Create-form schema for public.stays. Constraints mirror readStaySchema (stay.schema.ts) —
// that file stays the source of truth for what Postgres itself enforces (stays_slug_format,
// stays_price_pos, stays_discount_ok, stays_capacity_pos, stays_lat_range/stays_lng_range).
// Kept as a separate schema (rather than reused directly) because a create form has no
// id/created_at (server-generated) and benefits from friendlier per-field messages than a
// read/QA schema needs.
// `slug` is deliberately absent: staff no longer type it, so there is no input to validate.
// It is derived from `name` (utils/deriveSlug.ts) and de-duplicated against the database
// (services/resolveUniqueSlug.ts) at submit time — see STAYS-INPUT-DECISIONS.md decision 1.
export const stayCreateSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        location: z.string().min(1, "Location is required"),
        price_per_night: z
            .number()
            .int("Price must be a whole number")
            .positive("Price must be greater than 0")
            .max(1_000_000_000, "Price cannot exceed Rp 1,000,000,000 per night"),
        discount: z
            .number()
            .int("Discount must be a whole number")
            .min(0, "Discount cannot be negative")
            .max(1_000_000_000, "Discount cannot exceed Rp 1,000,000,000")
            .default(0),
        capacity: z
            .number()
            .int("Capacity must be a whole number")
            .positive("Capacity must be greater than 0")
            .max(32_767, "Capacity is unrealistically high"),
        beds: z
            .number()
            .int("Beds must be a whole number")
            .positive("Beds must be greater than 0")
            .max(32_767, "Beds count is unrealistically high"),
        area: z
            .number()
            .int("Area must be a whole number")
            .positive("Area must be greater than 0")
            .max(32_767, "Area is unrealistically high"),
        is_new: z.boolean().default(false),
        is_featured: z.boolean().default(false),
        description: z.string().min(1, "Description is required"),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        // amenity ids the staff member picked for this specific villa (sort_order 0-9).
        // The 6 shared amenities are attached automatically, never chosen here.
        amenityIds: z.array(z.number()).max(10).default([]),
    })
    .refine((stay) => stay.discount < stay.price_per_night, {
        error: "Discount must be lower than price per night",
        path: ["discount"],
    });

// Fields with `.default()` (discount, is_new, is_featured, amenityIds) are optional on the way
// in (before RHF/zodResolver applies the default) but required on the way out — `useForm` needs
// the input shape, `SubmitHandler`/the mutation payload need the output shape.
export type StayCreateFormValues = z.input<typeof stayCreateSchema>;
export type StayCreateInput = z.output<typeof stayCreateSchema>;
