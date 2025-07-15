import { Database } from "../supabase/types/database.types";

// type for settings data with non nullable expected as return value
type SanitizedSettings = {
    maxBookingLength: number;
    maxNumberGuestsPerBooking: number;
    minBookingLength: number;
    breakfastPrice: number;
};
// settings row type
type RawDataSettings = Database["public"]["Tables"]["settings"]["Row"];

// sanitized 'dataSettings' value
export const sanitizeSettings = (
    settings?: RawDataSettings
): SanitizedSettings => ({
    maxBookingLength: settings?.maxBookingLength ?? 0,
    maxNumberGuestsPerBooking: settings?.maxNumberGuestsPerBooking ?? 0,
    minBookingLength: settings?.minBookingLength ?? 0,
    breakfastPrice: settings?.breakfastPrice ?? 0,
});
