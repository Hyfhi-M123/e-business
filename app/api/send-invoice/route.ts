import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS and perform admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { email, name, order_id, items, subtotal, shipping, discount, total } = await req.json();

    if (!email || !order_id) {
      return NextResponse.json({ error: "Email dan Order ID wajib diisi" }, { status: 400 });
    }

    // 1. Check Store Settings for Email Preferences
    const { data: settingsData } = await supabase.from("store_settings").select("*");
    if (settingsData) {
      const orderEmailSetting = settingsData.find(row => row.key === "customerOrderEmails");
      if (orderEmailSetting && orderEmailSetting.value === "false") {
        console.log("Customer order emails are disabled in Notifications Settings.");
        return NextResponse.json({ 
          success: true, 
          message: "Email notifications disabled by admin preferences.",
          skipped: true 
        });
      }
    }

    // Configure Nodemailer transporter (Gmail example)
    // Note: To make this work, the user must set SMTP_EMAIL and SMTP_PASSWORD in .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || "", // e.g. yourmail@gmail.com
        pass: process.env.SMTP_PASSWORD || "" // e.g. Gmail App Password
      },
    });

    // Check if SMTP is configured
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP_EMAIL or SMTP_PASSWORD is not set. Simulating email success.");
      // If not configured, we return success so the app doesn't crash, but log a warning.
      return NextResponse.json({ 
        success: true, 
        message: "Email disimulasikan sukses (Konfigurasi SMTP belum diatur di .env)",
        simulated: true 
      });
    }

    const itemsHtml = items.map((i: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${i.name} <br><small style="color: #666;">${i.variant}</small></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rp ${i.price.toLocaleString('id-ID')}</td>
      </tr>
    `).join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #F77F00;">Invoice Pesanan Anda</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Terima kasih telah berbelanja di TrailForge. Berikut adalah tagihan untuk pesanan Anda <strong>(${order_id})</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left;">Produk</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 20px;">
          <p>Subtotal: Rp ${subtotal.toLocaleString('id-ID')}</p>
          <p>Ongkos Kirim: Rp ${shipping.toLocaleString('id-ID')}</p>
          <p>Diskon: -Rp ${discount.toLocaleString('id-ID')}</p>
          <h3 style="color: #F77F00; font-size: 20px; border-top: 2px solid #eee; padding-top: 10px;">
            Total Tagihan: Rp ${total.toLocaleString('id-ID')}
          </h3>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          Silakan lakukan pembayaran agar pesanan dapat segera diproses.<br>
          Salam Hangat,<br><strong>Tim TrailForge</strong>
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"TrailForge Official" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Invoice Pesanan Anda (${order_id}) - TrailForge`,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email berhasil dikirim!" });
  } catch (error: any) {
    console.error("Email Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
