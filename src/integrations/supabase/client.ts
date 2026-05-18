import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://pwfawrrvdvuufamrltzc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZmF3cnJ2ZHZ1dWZhbXJsdHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MjcyOTksImV4cCI6MjA5MzAwMzI5OX0.ZAJ3YPxqCuBDwGU2yXZEBeHO0mT39DpZ9mRZS3euff0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
});
