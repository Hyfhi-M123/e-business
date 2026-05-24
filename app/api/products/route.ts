import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase server-side client (uses service role for writes to bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let query = supabase.from("products").select("*");
    if (id) {
      query = query.eq("id", id).single();
    }
    
    const { data: products, error: pErr } = await query;
    if (pErr) throw pErr;

    const { data: orderItems, error: oiErr } = await supabase.from("order_items").select("product_id, quantity");
    if (oiErr) throw oiErr;

    // Aggregate real sold counts based on actual order items
    const soldMap: Record<string, number> = {};
    if (orderItems) {
      orderItems.forEach((item: any) => {
        soldMap[item.product_id] = (soldMap[item.product_id] || 0) + (item.quantity || 1);
      });
    }

    if (id && !Array.isArray(products)) {
      return NextResponse.json({
        ...products,
        original_price: products.original_price, // preserve snake_case
        sold: soldMap[products.id] || 0
      });
    }

    const mappedProducts = (products as any[]).map((p: any) => ({
      ...p,
      original_price: p.original_price, // preserve snake_case
      sold: soldMap[p.id] || 0
    }));

    return NextResponse.json(mappedProducts);
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const product = await req.json();

    const { error } = await supabase.from("products").insert([product]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const product = await req.json();
    const { id, ...updateData } = product;
    
    if (!id) {
      return NextResponse.json({ error: "Product ID required for update" }, { status: 400 });
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required for deletion" }, { status: 400 });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
