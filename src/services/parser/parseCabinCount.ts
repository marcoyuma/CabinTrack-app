import { cabinsLengthSchema } from "../../features/cabins/types/cabin.schema";

export const parseCabinCount = (count: number | null) =>
    cabinsLengthSchema.parse(count);
