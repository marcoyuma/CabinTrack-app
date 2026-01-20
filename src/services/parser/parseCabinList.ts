import { SupabaseCabinRow } from "../../features/cabins/types/cabin.db.types";
import {
    Cabin,
    readCabinSchema,
} from "../../features/cabins/types/cabin.schema";

export const parseCabinList = (cabins: SupabaseCabinRow[]): Cabin[] => {
    return cabins.map((cabin) => readCabinSchema.parse(cabin));
};
