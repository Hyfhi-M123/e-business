import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_v2YG0aXS_8AhAxZaHq7xGQ_jWnLA26J";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Fetch orders (optionally filtered by email)
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (email) {
      query = query.eq("user_email", email);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error("Error fetching orders:", ordersError.message);
      return NextResponse.json({ orders: [] });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Fetch order items for all orders
    const orderIds = orders.map(o => o.id);
    const { data: allItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError.message);
    }

    // Fetch product images for the items
    const productIds = [...new Set((allItems || []).map(i => i.product_id))];
    let productImages: Record<string, string> = {};
    
    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("id, image")
        .in("id", productIds);
      
      if (products) {
        products.forEach(p => { productImages[p.id] = p.image; });
      }
    }

    // Map to the format the UI expects
    const formattedOrders = orders.map(order => {
      const items = (allItems || [])
        .filter(i => i.order_id === order.id)
        .map(item => ({
          id: item.product_id,
          name: item.product_name,
          variant: "Default",
          qty: item.quantity,
          price: item.price,
          image: productImages[item.product_id] || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"
        }));

      const createdAt = new Date(order.created_at);
      const dateStr = createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

      return {
        id: order.id,
        status: order.status,
        date: dateStr,
        created_at: order.created_at,
        total: order.total_amount,
        store: "TrailForge Official",
        items: items,
        shipping: {
          courier: order.shipping_courier || "",
          courier_code: "",
          service: order.shipping_service || "",
          receipt: order.shipping_receipt || "-",
          address: order.shipping_address || ""
        },
        payment: {
          method: order.payment_method || "",
          subtotal: order.subtotal || order.total_amount,
          shipping_cost: order.shipping_cost || 0,
          insurance_cost: order.insurance_cost || 0,
          discount: order.promo_discount || 0,
          total: order.total_amount
        },
        recipient: {
          name: order.recipient_name || "",
          phone: order.recipient_phone || "",
        },
        user_email: order.user_email || "guest@trailforge.com",
        timeline: {
          ordered_at: order.created_at,
          paid_at: order.paid_at || undefined,
          confirmed_at: order.confirmed_at || undefined,
          packed_at: order.packed_at || undefined,
          shipped_at: order.shipped_at || undefined,
        },
        source: "database" // Mark as real data
      };
    });

    // REAL FUNNEL DATA: Count active items currently in carts across all users
    const { count: cartCount } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({ 
      orders: formattedOrders,
      cartCount: cartCount || 0
    });
  } catch (error: any) {
    console.error("Orders API Error:", error.message);
    return NextResponse.json({ orders: [], error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, payment_method, midtrans_transaction_id, midtrans_transaction_time, midtrans_gross_amount, midtrans_status, shipping_receipt, shipping_courier } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const updateData: any = { status };

    // Set timestamp berdasarkan status
    const now = new Date().toISOString();
    if (status === "Menunggu Konfirmasi" || status === "Diproses") updateData.paid_at = now;
    if (status === "Dikemas") updateData.confirmed_at = now;
    if (status === "Dikirim") updateData.shipped_at = now;
    if (status === "Selesai") updateData.paid_at = updateData.paid_at || now;

    // Payment data
    if (payment_method) updateData.payment_method = payment_method;
    if (midtrans_transaction_id) updateData.midtrans_transaction_id = midtrans_transaction_id;
    if (midtrans_transaction_time) updateData.midtrans_transaction_time = midtrans_transaction_time;
    if (midtrans_gross_amount) updateData.midtrans_gross_amount = parseFloat(midtrans_gross_amount);
    if (midtrans_status) updateData.midtrans_status = midtrans_status;

    // Fulfillment data
    if (shipping_receipt) updateData.shipping_receipt = shipping_receipt;
    if (shipping_courier) updateData.shipping_courier = shipping_courier;

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating order:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Order API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerForm, items, subtotal, shipping, discount, total, status } = body;

    if (!customerForm || !items || items.length === 0) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // Generate Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const order_id = `TRF-${dateStr}-${randomStr}`;

    const now = new Date().toISOString();

    // 1. Insert order
    const { error: orderError } = await supabase.from("orders").insert({
      id: order_id,
      user_email: customerForm.email,
      status: status || "Belum Bayar",
      total_amount: total,
      payment_method: "Manual Admin",
      shipping_courier: "Manual / POS",
      shipping_address: `${customerForm.address}\n${customerForm.city}\n${customerForm.postal}`,
      recipient_name: customerForm.name,
      recipient_phone: customerForm.phone,
      subtotal: subtotal,
      shipping_cost: shipping,
      promo_discount: discount,
      paid_at: status === "Selesai" ? now : null,
      confirmed_at: status === "Selesai" ? now : null,
    });

    if (orderError) throw new Error("Gagal menyimpan ke tabel orders: " + orderError.message);

    // 2. Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order_id,
      product_id: item.productId || item.id.split('-var-')[0],
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw new Error("Gagal menyimpan ke tabel order_items: " + itemsError.message);

    // 3. Deduct stock (Best Effort)
    for (const item of items) {
      const pId = item.productId || item.id.split('-var-')[0];
      const { data: prod } = await supabase.from("products").select("variants, stock").eq("id", pId).single();
      if (prod) {
        if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
          let updated = false;
          const newVariants = prod.variants.map((v: any) => {
            if (!updated && item.variant.includes(v.size || "")) {
              v.stock = Math.max(0, (parseInt(v.stock) || 0) - item.quantity).toString();
              updated = true;
            }
            return v;
          });
          await supabase.from("products").update({ variants: newVariants }).eq("id", pId);
        } else {
          const newStock = Math.max(0, (parseInt(prod.stock) || 0) - item.quantity);
          await supabase.from("products").update({ stock: newStock }).eq("id", pId);
        }
      }
    }

    return NextResponse.json({ success: true, order_id });
  } catch (error: any) {
    console.error("Create Order Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
