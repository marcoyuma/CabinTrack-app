import { Database } from "../../../supabase/types/database.types";

export type BookingType = Database["public"]["Tables"]["bookings"]["Row"];
