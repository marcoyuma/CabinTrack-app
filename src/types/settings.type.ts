import z from "zod";
import { safeNumber } from "../shared/utils/helpers";

//  breakfastPrice: number | null;
//     created_at: string;
//     id: number;
//     maxBookingLength: number | null;
//     maxNumberGuestsPerBooking: number | null;
//     minBookingLength: number | null;
// } | undefined

export const readSettingsSchema = z.object({
    id: z.number(),
    breakfastPrice: safeNumber(10),
    maxBookingLength: safeNumber(10),
    maxNumberGuestsPerBooking: safeNumber(4),
    minBookingLength: safeNumber(1),
});

// type of setting object
export type Setting = z.infer<typeof readSettingsSchema>;
