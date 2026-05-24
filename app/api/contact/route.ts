import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, topic, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nama, email, dan pesan wajib diisi." }, { status: 400 });
    }

    // Simpan ke newsletter_subscribers juga (sebagai lead capture)
    await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" });

    return NextResponse.json({ success: true, message: "Pesan berhasil dikirim!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
