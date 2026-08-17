import z from "zod";

// Edit-form schema for public.stays. Deliberately narrower than stayCreateSchema: no `slug`
// (locked read-only in the edit form — see STAYS-INPUT-DECISIONS.md, changing it changes the
// villa's public URL) and no `amenityIds` (photos/amenities aren't re-managed from this form in
// this iteration — see STAYS-TABLE-DECISIONS.md "Edit form scope").
export const stayEditSchema = z
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
            .max(1_000_000_000, "Discount cannot exceed Rp 1,000,000,000"),
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
        is_new: z.boolean(),
        is_featured: z.boolean(),
        description: z.string().min(1, "Description is required"),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    })
    .refine((stay) => stay.discount < stay.price_per_night, {
        error: "Discount must be lower than price per night",
        path: ["discount"],
    });

export type StayEditFormValues = z.input<typeof stayEditSchema>;
export type StayEditInput = z.output<typeof stayEditSchema>;
