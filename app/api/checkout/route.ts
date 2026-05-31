import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { createClient } from "@supabase/supabase-js";

// Supabase server-side client (uses service role for writes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // 1. Fetch Dynamic Midtrans Keys from Settings
    const { data: settingsData } = await supabase.from("store_settings").select("*");
    let dynamicServerKey = process.env.MIDTRANS_SERVER_KEY || "";
    let dynamicClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    
    if (settingsData) {
      const serverKeyRow = settingsData.find(row => row.key === "midtransServerKey");
      const clientKeyRow = settingsData.find(row => row.key === "midtransClientKey");
      if (serverKeyRow?.value) dynamicServerKey = serverKeyRow.value;
      if (clientKeyRow?.value) dynamicClientKey = clientKeyRow.value;
    }

    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: dynamicServerKey,
      clientKey: dynamicClientKey,
    });

    const body = await req.json();
    const { order_id, gross_amount, items, customer_details, payment_type, shipping_info, cost_breakdown } = body;

    // ============================================
    // FASE 3: Simpan Order ke Database Supabase
    // ============================================

    // 1. Insert ke tabel 'orders'
    const { error: orderError } = await supabase.from("orders").insert({
      id: order_id,
      user_email: customer_details?.email || null,
      status: "Belum Bayar",
      total_amount: gross_amount,
      payment_method: payment_type || null,
      shipping_courier: shipping_info?.courier || null,
      shipping_service: shipping_info?.service || null,
      shipping_address: shipping_info?.address || null,
      recipient_name: shipping_info?.recipient_name || customer_details?.first_name || null,
      recipient_phone: shipping_info?.recipient_phone || customer_details?.phone || null,
      subtotal: cost_breakdown?.subtotal || null,
      shipping_cost: cost_breakdown?.shipping_cost || 0,
      insurance_cost: cost_breakdown?.insurance_cost || 0,
      promo_discount: cost_breakdown?.promo_discount || 0,
    });

    if (orderError) {
      console.error("Supabase Order Insert Error:", orderError.message);
      // Non-blocking: Lanjutkan proses pembayaran meskipun insert gagal
    }

    // 2. Insert ke tabel 'order_items'
    const productItems = items.filter((item: any) => item.id !== "SHIPPING" && item.id !== "INSURANCE");
    if (productItems.length > 0) {
      const orderItems = productItems.map((item: any) => ({
        order_id: order_id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        console.error("Supabase Order Items Insert Error:", itemsError.message);
      } else {
        // 3. Auto-Deduct Stock from Products
        for (const item of productItems) {
          const { data: prod } = await supabase.from("products").select("variants, stock").eq("id", item.id).single();
          if (prod) {
            if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
              let updated = false;
              const newVariants = prod.variants.map((v: any) => {
                const itemName = item.name.toLowerCase();
                const sizeMatch = v.size ? itemName.includes(v.size.toLowerCase()) : false;
                const colorMatch = v.colorName ? itemName.includes(v.colorName.toLowerCase()) : false;
                
                if (!updated && (sizeMatch || colorMatch || prod.variants.length === 1)) {
                  const currentStock = parseInt(v.stock) || 0;
                  v.stock = Math.max(0, currentStock - item.quantity).toString();
                  updated = true;
                }
                return v;
              });
              
              if (!updated) {
                for (const v of newVariants) {
                  const currentStock = parseInt(v.stock) || 0;
                  if (currentStock > 0) {
                    v.stock = Math.max(0, currentStock - item.quantity).toString();
                    break;
                  }
                }
              }
              await supabase.from("products").update({ variants: newVariants }).eq("id", item.id);
            } else {
              // No variants array found, deduct from root product stock
              const currentStock = prod.stock !== undefined && prod.stock !== null ? parseInt(prod.stock) : 99;
              const newStock = Math.max(0, currentStock - item.quantity);
              await supabase.from("products").update({ stock: newStock }).eq("id", item.id);
            }
          }
        }
      }
    }

    // ============================================
    // Midtrans Snap Transaction
    // ============================================
    const parameters: any = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      item_details: items,
      customer_details: customer_details,
    };

    const transaction = await snap.createTransaction(parameters);
    
    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error: any) {
    console.error("Checkout Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
