import { useQuery } from "@tanstack/react-query";
import { readStayImages } from "../services/readStayImages";

/**
 * Reads every stay_images row (the whole catalog is a handful of villas, same "read it all"
 * pattern as useStays). Backs both the table's cover thumbnail (sort_order === 0 per stay)
 * and the "belum siap tayang" filter (image count === 0 per stay) — see stayImages.ts for the
 * derivation helpers, so callers don't duplicate the group-by-stay_id logic.
 */
export const useStayImages = () => {
    const { isPending, data, error } = useQuery({
        queryKey: ["stay-images"],
        queryFn: readStayImages,
    });

    return { isPending, images: data ?? [], error };
};
