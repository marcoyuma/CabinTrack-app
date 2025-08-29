import z from "zod";
import { Database } from "../../supabase/types/database.types";

// type for new cabin params
export interface NewCabin {
    name: string | undefined;
    maxCapacity: number | string | undefined;
    regularPrice: number | string | undefined;
    discount: number | string | undefined;
    description: string | undefined;
    // type for default file input
    image: File | string;
}

export type CabinType = Database["public"]["Tables"]["cabins"]["Row"];

export const cabinSchema = z.object({
    name: z.string().min(1).default("-"),
    discount: z.union([z.string(), z.number()]).transform(Number).default(0),
    description: z.string().min(1).default("-"),
    maxCapacity: z.union([z.string(), z.number()]).transform(Number).default(1),
    regularPrice: z
        .union([z.string(), z.number()])
        .transform(Number)
        .default(100),
    image: z.union([z.instanceof(File), z.string()]),
});
