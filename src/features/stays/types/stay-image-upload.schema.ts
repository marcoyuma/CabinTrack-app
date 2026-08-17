import z from "zod";

// Schema for the image step of the create-villa form. Deliberately NOT readStayImageSchema —
// that schema describes a finished DB row (storage_path/width/height/blur_data_url), none of
// which exist yet at this stage. This describes raw picked files plus the result of running
// them through processStayImage (see utils/processStayImage.ts) before upload.
export const stayImageUploadSchema = z
    .array(
        z.object({
            file: z.instanceof(File),
            alt: z.string().min(1, "Alt text is required"),
            role: z.string().min(1, "A short label like 'exterior' is required"),
        }),
    )
    .min(1, "At least one photo is required — the first photo becomes the cover image")
    // The customer site uses each photo's alt text as the identity of its carousel dot, so two
    // photos sharing one alt are treated as the same photo and the indicator breaks. Nothing in
    // the database enforces this (ADMIN-PANEL-CONTEXT.md § "Ringkasan invariant" item 4), so it
    // has to be caught here or not at all.
    .refine(
        (images) => new Set(images.map((image) => image.alt.trim().toLowerCase())).size === images.length,
        "Each photo needs its own alt text — duplicates break the photo carousel",
    );

export type StayImageUploadInput = z.infer<typeof stayImageUploadSchema>;

// Result of running one File through processStayImage — everything needed to build a
// stay_images insert row once storage_path is known post-upload.
export interface ProcessedStayImage {
    file: File;
    alt: string;
    role: string;
    mainBlob: Blob;
    width: number;
    height: number;
    blurDataUrl: string;
}
