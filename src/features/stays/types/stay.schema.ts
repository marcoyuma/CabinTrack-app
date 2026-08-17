import z from "zod";
import { safeString } from "../../../shared/utils/helpers";

// Mirrors public.stays exactly — see ADMIN-PANEL-CONTEXT.md § "Kontrak data — skema tabel".
// Constraints below (slug format, price/discount/capacity bounds, lat/lng range) are the same
// ones Postgres enforces (`stays_slug_format`, `stays_price_pos`, `stays_discount_ok`,
// `stays_capacity_pos`, `stays_lat_range`/`stays_lng_range`) — kept here so a bad row surfaces
// as a validation message instead of a silent NaN/undefined in a chart.
export const readStaySchema = z
    .object({
        id: z.number(),
        created_at: z.string(),
        slug: z
            .string()
            .regex(
                /^[a-z0-9]+(-[a-z0-9]+)*$/,
                "slug must be lowercase, numbers and hyphens only",
            ),
        name: z.string(),
        location: z.string(),
        price_per_night: z.number().int().positive().max(1_000_000_000),
        discount: z.number().int().min(0).max(1_000_000_000),
        capacity: z.number().int().positive().max(32_767),
        beds: z.number().int().positive().max(32_767),
        area: z.number().int().positive().max(32_767),
        is_new: z.boolean(),
        is_featured: z.boolean(),
        description: safeString(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    })
    .refine((stay) => stay.discount < stay.price_per_night, {
        error: "discount must be lower than price_per_night",
        path: ["discount"],
    });

export type Stay = z.infer<typeof readStaySchema>;

export const readStaysSchema = z.array(readStaySchema);
