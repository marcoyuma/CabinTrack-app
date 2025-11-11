import {
    Cabin,
    cabinReadSchema,
    SupabaseCabinType,
} from "../../types/cabins.type";

export const parseCabinList = (cabins: SupabaseCabinType[]): Cabin[] => {
    return cabins.map((cabin) => cabinReadSchema.parse(cabin));
};
