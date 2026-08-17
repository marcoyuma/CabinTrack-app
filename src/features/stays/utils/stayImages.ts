import { StayImage } from "../types/stay-image.schema";

// Groups a flat stay_images read into per-stay lookups the table needs: how many photos each
// villa has (drives the "belum siap tayang" filter — 0 photos is the one condition that
// actually crashes the customer site, per ADMIN-PANEL-CONTEXT2.md), and each villa's cover
// (sort_order === 0, the same rule the customer site's listing page uses to pick a thumbnail).
export const buildStayImageCounts = (images: StayImage[]): Record<number, number> => {
    const counts: Record<number, number> = {};
    for (const image of images) {
        counts[image.stay_id] = (counts[image.stay_id] ?? 0) + 1;
    }
    return counts;
};

export const buildStayCovers = (images: StayImage[]): Record<number, string> => {
    const covers: Record<number, string> = {};
    for (const image of images) {
        if (image.sort_order === 0) {
            covers[image.stay_id] = image.storage_path;
        }
    }
    return covers;
};
