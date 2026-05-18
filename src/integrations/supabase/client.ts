import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://pwfawrrvdvuufamrltzc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZmF3cnJ2ZHZ1dWZhbXJsdHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjcyOTksImV4cCI6MjA5MzAwMzI5OX0.ZAJ3YPxqCuBDwGU2yXZEBeHO0mT39DpZ9mRZS3euff0";

// Typed client uses a loose Database shape because user_roles is added by
// the migration but not present in the (read-only) generated types file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any> = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
    },
  }
) as unknown as SupabaseClient<any>;
