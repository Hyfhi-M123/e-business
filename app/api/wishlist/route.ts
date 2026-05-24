import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET — Ambil semua wishlist milik user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — Tambah item ke wishlist
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, product_id, product_name, price, original_price, image, category, discount } = body;

    if (!user_id || !product_id) {
      return NextResponse.json({ error: "user_id and product_id are required" }, { status: 400 });
    }

    // Insert (karena ada constraint UNIQUE(user_id, product_id), ini akan error jika duplikat)
    // Supabase onConflict ignore
    const { error } = await supabase.from("wishlist_items").upsert([{
      user_id,
      product_id,
      product_name: product_name || "",
      price: price || 0,
      original_price: original_price || null,
      image: image || "",
      category: category || "",
      discount: discount || 0
    }], { onConflict: 'user_id, product_id', ignoreDuplicates: true });

    if (error) throw error;
    return NextResponse.json({ success: true, action: "inserted_or_ignored" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — Hapus item dari wishlist
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");
    const userId = searchParams.get("user_id");

    if (!userId || !product_id) {
      return NextResponse.json({ error: "user_id and product_id are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", product_id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true, action: "deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
