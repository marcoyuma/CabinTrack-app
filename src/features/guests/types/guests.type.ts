import { Database } from "../../../supabase/types/database.types";

export type GuestType = Database["public"]["Tables"]["guests"]["Row"];
