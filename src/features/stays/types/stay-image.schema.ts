import z from "zod";

// Mirrors public.stay_images — see ADMIN-PANEL-CONTEXT.md § "stay_images".
// blur_data_url/width/height are nullable in the DB type only because Postgres doesn't
// enforce NOT NULL on them at the column level in every environment yet, but a row missing
// any of the three breaks the customer site's <Image placeholder="blur"> render — see
// ADMIN-PANEL-CONTEXT.md § "Kontrak upload gambar" and the completeness query under
// "Cara menguji dari sisi Anda".
export const readStayImageSchema = z.object({
    stay_id: z.number(),
    storage_path: z.string(),
    alt: z.string(),
    blur_data_url: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    sort_order: z.number(),
});

export type StayImage = z.infer<typeof readStayImageSchema>;

export const readStayImagesSchema = z.array(readStayImageSchema);

// A row is "incomplete" if it would crash the customer site's blur placeholder.
export const isIncompleteStayImage = (image: StayImage) =>
    image.blur_data_url === null ||
    image.width === null ||
    image.height === null;
