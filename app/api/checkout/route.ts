import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";

export async function POST(req: Request) {
  try {
    // Inisialisasi di dalam handler untuk memastikan env terbaca dengan benar
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    });

    const body = await req.json();
    const { order_id, gross_amount, items, customer_details, payment_type } = body;

    const parameters: any = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      item_details: items,
      customer_details: customer_details,
    };

    // Menggunakan Midtrans Snap kembali
    const transaction = await snap.createTransaction(parameters);
    
    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error: any) {
    console.error("Midtrans Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
