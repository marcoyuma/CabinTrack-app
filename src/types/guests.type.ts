import z from "zod";
import { Database } from "../supabase/types/database.types";
import { safeString } from "../shared/utils/helpers";

export type GuestType = Database["public"]["Tables"]["guests"]["Row"];

// countryFlag: string | null;
// created_at: string;
// email: string | null;
// fullName: string | null;
// id: number;
// nationalID: string | null;
// nationality: string | null;

export const guestReadSchema = z.object({
    countryFlag: safeString("🇺🇳"),
    created_at: z.string(),
    email: safeString(),
    fullName: safeString(),
    id: z.number(),
    nationalID: safeString(),
    nationality: safeString(),
});
export type Guest = z.infer<typeof guestReadSchema>;
