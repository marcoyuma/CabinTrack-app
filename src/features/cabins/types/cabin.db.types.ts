import { Database } from "../../../supabase/types/database.types";

// raw database 'cabins' row type
export type SupabaseCabinRow = Database["public"]["Tables"]["cabins"]["Row"];
