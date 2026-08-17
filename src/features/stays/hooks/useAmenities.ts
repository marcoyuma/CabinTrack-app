import { useQuery } from "@tanstack/react-query";
import { readAmenities } from "../services/readAmenities";

// Full amenities master list. Small/rarely-changing table — same "no pagination" reasoning as
// useStays.ts. Used by AmenityPicker (villa-specific picks) and attachAmenities (shared lookup),
// so both read from the same cached query instead of issuing separate network calls.
export const useAmenities = () => {
    const { isPending, data, error } = useQuery({
        queryKey: ["amenities"],
        queryFn: readAmenities,
    });

    return { isPending, amenities: data ?? [], error };
};
