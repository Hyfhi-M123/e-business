import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_v2YG0aXS_8AhAxZaHq7xGQ_jWnLA26J";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching products...");
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("ERROR:", JSON.stringify(error, null, 2));
    console.error("MESSAGE:", error.message);
  } else {
    console.log("SUCCESS. Row count:", data?.length);
  }
}

test();
