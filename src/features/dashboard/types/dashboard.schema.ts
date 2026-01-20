import z from "zod";
import { safeNumber, safeString } from "../../../shared/utils/helpers";

export const RecentBookingSchema = z.object({
    created_at: safeString(),
    totalPrice: safeNumber(),
    extrasPrice: safeNumber(),
});
export const RecentBookingsSchema = z.array(RecentBookingSchema);
export type RecentBooking = z.infer<typeof RecentBookingSchema>;

export const RecentStaySchema = z.object({
    numNights: safeNumber(),
    status: z.enum(["checked-in", "checked-out", "unconfirmed"]),
});
export const RecentStaysSchema = z.array(RecentStaySchema);
export type RecentStay = z.infer<typeof RecentStaySchema>;
