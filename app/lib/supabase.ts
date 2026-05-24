import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co").replace(/^["']|["']$/g, '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_v2YG0aXS_8AhAxZaHq7xGQ_jWnLA26J").replace(/^["']|["']$/g, '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
