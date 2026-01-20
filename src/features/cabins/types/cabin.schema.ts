import z from "zod";
import { safeNumber, safeString } from "../../../shared/utils/helpers";
import defaultImage from "/defaultImage.jpg";

// create cabin data zod schema ✅
export const createCabinSchema = z.object({
    name: z.string().min(1).default("-"),
    discount: z.union([z.string(), z.number()]).transform(Number).default(0),
    description: z.string().min(1).default("-"),
    maxCapacity: z.union([z.string(), z.number()]).transform(Number).default(1),
    regularPrice: z
        .union([z.string(), z.number()])
        .transform(Number)
        .default(100),
    // image: z.string(),
});

// update cabin schema
export const updateCabinSchema = createCabinSchema;
// .omit({ image: true })
// .extend({
//     image: z.string().nullable(),
// });
//
export const updateCabinInputSchema = updateCabinSchema.required({
    // image: true,
});
// update cabin input type
export type UpdateCabinInput = z.infer<typeof updateCabinInputSchema>;

// read cabin data zod schema
export const readCabinSchema = z.object({
    id: z.number(),
    name: z
        .string()
        .nullable()
        .transform((arg) => (arg && arg.trim().length > 0 ? arg : "-"))
        .default("-"),
    created_at: z.string(),
    description: safeString(),
    discount: safeNumber(),
    image: safeString(defaultImage),
    maxCapacity: safeNumber(1),
    regularPrice: safeNumber(1),
});
// data type inferring from readCabinSchema for getCabins return type
export type Cabin = z.infer<typeof readCabinSchema>;
export const cabinsLengthSchema = safeNumber(0);

// returned value for read database function
export const cabinsDataSchema = z.object({
    cabins: z.array(readCabinSchema),
    cabinsLength: cabinsLengthSchema,
});
export type CabinsDataType = z.infer<typeof cabinsDataSchema>;

// const safeFormNumber = ({
//     min = 1,
//     minParams = 10,
//     max,
//     maxParams,
// }: {
//     min: number;
//     minParams: string;
//     max: number;
//     maxParams: string;
// }) => {
//     return z.coerce.number().min(1, "required").max(100, "Max value reached");
// };

// cabins form schema
export const cabinFormSchema = z
    .object({
        name: z.string().trim().min(2),
        description: z
            .string()
            .trim()
            .min(1, "description required")
            .max(1000, "max value reached, 100 words"),
        discount: z.coerce.number().max(100, "maximum value reached, 100%"),
        image: z.instanceof(FileList).nullable(),
        maxCapacity: z.coerce
            .number()
            .min(1, "required atleast 1 person")
            .max(6, "maximum value reached, 6 person"),
        regularPrice: z.coerce.number().min(10, "required atleast $10"),
    })
    // validate cross value and return the error with specified path
    .refine((data) => data.discount <= data.regularPrice, {
        error: "discount should be lower than the actual price",
        path: ["discount"],
    });
// type of cabinFormSchema
export type CabinFormSchemaType = z.infer<typeof cabinFormSchema>;

// create / update cabin payload schema
export const cabinPayloadSchema = z.object({
    name: z.string().min(1),
    discount: z.number(),
    description: z.string().min(1),
    maxCapacity: z.number(),
    regularPrice: z.number(),
    image: z.instanceof(File).nullable(),
});

// base payload type
export type CabinPayload = z.infer<typeof cabinPayloadSchema>;
