import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/promo?code=TRAILFORGE10 — Validasi promo code, atau list semua jika code tidak ada
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase().trim();

    // Jika tidak ada code, return list semua promo (untuk Admin)
    if (!code) {
      const { data, error } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ promos: data });
    }

    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !promo) {
      return NextResponse.json({ valid: false, message: "Kode promo tidak ditemukan." });
    }

    // Check status
    if (promo.status !== "active") {
      return NextResponse.json({ valid: false, message: "Kode promo sudah tidak aktif." });
    }

    // Check usage limit
    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
      return NextResponse.json({ valid: false, message: "Kode promo sudah mencapai batas penggunaan." });
    }

    // Check date range (Adjusting to WIB / UTC+7 for accurate local checking)
    const now = new Date();
    const nowWIB = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const nowStr = nowWIB.toISOString().split('T')[0];

    if (promo.start_date) {
      const startStr = new Date(promo.start_date).toISOString().split('T')[0];
      if (startStr > nowStr) {
        return NextResponse.json({ valid: false, message: "Kode promo belum aktif." });
      }
    }
    if (promo.end_date) {
      const endStr = new Date(promo.end_date).toISOString().split('T')[0];
      if (endStr < nowStr) {
        return NextResponse.json({ valid: false, message: "Kode promo sudah expired." });
      }
    }

    return NextResponse.json({
      valid: true,
      promo: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        description: promo.description,
        min_order_amount: promo.min_order_amount || 0,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: "Server error." }, { status: 500 });
  }
}

// PUT /api/promo — Increment usage count setelah order berhasil
export async function PUT(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const { error } = await supabase.rpc("increment_promo_usage", { promo_code: code.toUpperCase() });

    // Fallback jika RPC belum ada
    if (error) {
      await supabase
        .from("promo_codes")
        .update({ usage_count: supabase.rpc ? undefined : 0 })
        .eq("code", code.toUpperCase());
        
      // Manual increment
      const { data } = await supabase
        .from("promo_codes")
        .select("usage_count")
        .eq("code", code.toUpperCase())
        .single();
      
      if (data) {
        await supabase
          .from("promo_codes")
          .update({ usage_count: (data.usage_count || 0) + 1 })
          .eq("code", code.toUpperCase());
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/promo — Create new promo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, type, value, description, usage_limit, min_order_amount, start_date, end_date } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Code, type, and value are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .insert({
        code: code.toUpperCase().trim(),
        type,
        value,
        description,
        usage_limit: usage_limit || null,
        min_order_amount: min_order_amount || 0,
        start_date: start_date || null,
        end_date: end_date || null,
        status: "active"
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ promo: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
