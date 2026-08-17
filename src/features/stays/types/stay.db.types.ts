import { Database } from "../../../supabase/types/database.types";

// raw database row types, straight from generated Database types
export type SupabaseStayRow = Database["public"]["Tables"]["stays"]["Row"];
export type SupabaseStayImageRow =
    Database["public"]["Tables"]["stay_images"]["Row"];
export type SupabaseAmenityRow =
    Database["public"]["Tables"]["amenities"]["Row"];
export type SupabaseStayAmenityRow =
    Database["public"]["Tables"]["stay_amenities"]["Row"];
