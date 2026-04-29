import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pwfawrrvdvuufamrltzc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Xv8g0e";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
});
