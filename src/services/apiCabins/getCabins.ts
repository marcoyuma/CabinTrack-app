import z from "zod";
import supabase from "../../supabase/supabase";
import defaultImage from "/defaultImage.jpg";

const cabinSchema = z.object({
    id: z.number(),
    name: z.string().min(1).default("-"),
    created_at: z.string(),
    description: z.string().min(1).default("No description provided"),
    discount: z.number().default(0),
    image: z
        .string()
        .nullable()
        .transform((img) => img ?? defaultImage),
    maxCapacity: z.number().default(1),
    regularPrice: z.number().default(1),
});

export type Cabin = z.infer<typeof cabinSchema>;

// define get all data from 'cabins' table database
export const getCabins = async (): Promise<Cabin[]> => {
    try {
        // destructure the data using 'supabase' client instance from 'cabins' table
        const { data: cabins, error } = await supabase
            .from("cabins")
            .select(
                "id, name, description, discount, image, maxCapacity, regularPrice, created_at"
            );

        // handle error
        if (error) {
            throw error;
        }

        // return clean 'cabins' data
        return cabins.map((val) => cabinSchema.parse(val));
    } catch (error) {
        console.error("Error fetching cabins: ", error);
        throw new Error("Cabins could not be loaded");
    }
};
