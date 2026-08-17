import z from "zod";

// Mirrors public.amenities — see ADMIN-PANEL-CONTEXT.md § "amenities + stay_amenities".
export const readAmenitySchema = z.object({
    id: z.number(),
    slug: z.string(),
    label: z.string(),
    detail: z.string(),
    is_shared: z.boolean(),
});

export type Amenity = z.infer<typeof readAmenitySchema>;
export const readAmenitiesSchema = z.array(readAmenitySchema);

// Mirrors public.stay_amenities join rows.
export const readStayAmenitySchema = z.object({
    stay_id: z.number(),
    amenity_id: z.number(),
    sort_order: z.number(),
});

export type StayAmenity = z.infer<typeof readStayAmenitySchema>;
export const readStayAmenitiesSchema = z.array(readStayAmenitySchema);

// A stay is missing the baseline shared amenities if it has fewer than 6 shared amenity
// links — see ADMIN-PANEL-CONTEXT.md § "Villa baru tidak otomatis mendapat fasilitas shared".
export const SHARED_AMENITIES_COUNT = 6;
