import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database.types";

/**
 * Supabase URL of the project.
 * This is the unique endpoint to access your Supabase instance.
 * You can find this in the Supabase dashboard under Project Settings > API > Project URL.
 */
export const supabaseUrl = "https://ixlapibfddubweqrmtgh.supabase.co";
/**
 * Supabase public API key (anon key).
 *
 * This key is safe to use in client-side applications *only* if Row Level Security (RLS)
 * is properly configured on your database tables. With RLS enabled, this key can be exposed
 * publicly because it will not grant any unauthorized access beyond what policies allow.
 *
 * You can find this in Supabase dashboard under Project Settings > API > anon public key.
 */
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bGFwaWJmZGR1YndlcXJtdGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDcyNDMsImV4cCI6MjA2NTYyMzI0M30.BqtaqfVsWdDeMD3bLMG5GGhLoHaSWAaACgtqP6HNrlw";
/**
 * Supabase client instance.
 *
 * This client is initialized using the project URL and the public anon key.
 * The generic `<Database>` type provides full type safety and autocompletion
 * based on your generated database schema types.
 *
 * @param supabaseUrl - The base URL of your Supabase project
 * @param supabaseKey - The public anon key with limited permissions
 * @returns A fully typed Supabase client instance used for querying your database
 */
const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export default supabase;
