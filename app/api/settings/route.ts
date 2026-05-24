import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*");

    if (error) throw error;

    // Convert array of {key, value} to single object
    const settings = data.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/settings - Upsert settings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    const entries = Object.keys(settings).map(key => ({
      key,
      value: settings[key],
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("store_settings")
      .upsert(entries, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
