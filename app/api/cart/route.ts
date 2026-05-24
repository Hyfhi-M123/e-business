import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET — Ambil semua cart items milik user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — Tambah item ke keranjang (atau update quantity jika sudah ada)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, product_id, product_name, price, original_price, image, category, tag, quantity, size, color } = body;

    if (!user_id || !product_id) {
      return NextResponse.json({ error: "user_id and product_id are required" }, { status: 400 });
    }

    // Cek apakah item sudah ada di keranjang user
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (existing) {
      // Update quantity
      const newQty = existing.quantity + (quantity || 1);
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);

      if (error) throw error;
      return NextResponse.json({ success: true, action: "updated", quantity: newQty });
    } else {
      // Insert baru
      const { error } = await supabase.from("cart_items").insert([{
        user_id,
        product_id,
        product_name: product_name || "",
        price: price || 0,
        original_price: original_price || null,
        image: image || "",
        category: category || "",
        tag: tag || null,
        quantity: quantity || 1,
        size: size || null,
        color: color || null,
      }]);

      if (error) throw error;
      return NextResponse.json({ success: true, action: "inserted" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — Update quantity item
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { product_id, user_id, quantity } = body;

    if (!product_id || !user_id) {
      return NextResponse.json({ error: "product_id and user_id are required" }, { status: 400 });
    }

    if (quantity <= 0) {
      // Hapus item jika quantity <= 0
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", product_id)
        .eq("user_id", user_id);

      if (error) throw error;
      return NextResponse.json({ success: true, action: "deleted" });
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("product_id", product_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return NextResponse.json({ success: true, action: "updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — Hapus item dari keranjang
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");
    const userId = searchParams.get("user_id");
    const clearAll = searchParams.get("clear_all");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    if (clearAll === "true") {
      // Kosongkan seluruh keranjang user (setelah checkout)
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      return NextResponse.json({ success: true, action: "cleared" });
    }

    if (!product_id) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("product_id", product_id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true, action: "deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
