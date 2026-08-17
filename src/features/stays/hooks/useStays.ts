import { useQuery } from "@tanstack/react-query";
import { readStays } from "../services/readStays";

/**
 * Reads the full Seaspace villa catalog (public.stays). No pagination/filter/sort —
 * the catalog is a handful of rows, and dashboard summaries need all of them at once.
 */
export const useStays = () => {
    const { isPending, data, error } = useQuery({
        queryKey: ["stays"],
        queryFn: readStays,
    });

    return { isPending, stays: data ?? [], error };
};
