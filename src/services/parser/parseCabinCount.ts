import { cabinsLengthSchema } from "../../types/cabins.type";

export const parseCabinCount = (count: number | null) =>
    cabinsLengthSchema.parse(count);
