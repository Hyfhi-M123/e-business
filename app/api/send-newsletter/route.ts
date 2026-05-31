import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and Content are required" }, { status: 400 });
    }

    // 1. Fetch all subscribers from Supabase
    const { data: subscribers, error: dbError } = await supabase
      .from("newsletter_subscribers")
      .select("email");

    if (dbError) {
      throw new Error(`Failed to fetch subscribers: ${dbError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    const emailList = subscribers.map(sub => sub.email);

    // 2. Setup SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify SMTP Config
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ error: "SMTP Configuration is missing in .env.local" }, { status: 500 });
    }

    // 3. Format the email HTML template (Ultra Premium Design)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
          .hero { width: 100%; height: 250px; background-image: url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop'); background-size: cover; background-position: center; position: relative; }
          .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; }
          .hero-brand { color: #F77F00; font-size: 14px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0; }
          .hero-title { color: #ffffff; font-size: 36px; font-weight: 900; line-height: 1.1; margin: 0; letter-spacing: -1px; }
          .content { padding: 40px; color: #4b5563; line-height: 1.8; font-size: 16px; }
          .content p { white-space: pre-wrap; margin: 0 0 24px 0; }
          .cta-container { text-align: center; margin: 40px 0 20px 0; }
          .btn { display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #F77F00 0%, #d66d00 100%); color: #ffffff !important; text-decoration: none; font-weight: 900; border-radius: 12px; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(247, 127, 0, 0.3); transition: transform 0.2s; }
          .features { display: flex; justify-content: space-between; gap: 20px; padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6; }
          .feature-item { text-align: center; width: 33%; }
          .feature-icon { font-size: 24px; margin-bottom: 8px; display: block; }
          .feature-text { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { padding: 40px; text-align: center; background-color: #111111; color: #6b7280; }
          .footer-logo { font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 20px; }
          .footer p { font-size: 13px; margin: 0 0 10px 0; line-height: 1.5; }
          .footer a { color: #F77F00; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero">
            <div class="hero-overlay">
              <p class="hero-brand">Premium Outdoor Gear</p>
              <h1 class="hero-title">TRAILFORGE</h1>
            </div>
          </div>
          
          <div class="content">
            <p>${content.replace(/\n/g, '<br>')}</p>
            
            <div class="cta-container">
              <a href="https://trailforge.com" class="btn">Shop The Collection</a>
            </div>
          </div>

          <div class="footer">
            <div class="footer-logo">TRAILFORGE</div>
            <p>You received this because you are an adventurer subscribed to our updates.</p>
            <p>123 Summit Avenue, Basecamp City, CO 80202</p>
            <p style="margin-top: 20px;">
              <a href="#">Unsubscribe</a> &nbsp;&bull;&nbsp; <a href="#">Manage Preferences</a>
            </p>
            <p style="margin-top: 20px; font-size: 11px; opacity: 0.5;">&copy; ${new Date().getFullYear()} TrailForge. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Send the emails (Using BCC to protect privacy and send in one go, or loop)
    // For enterprise scaling, usually we send individually or batch, but for now BCC is effective.
    const mailOptions = {
      from: `"TrailForge Admin" <${process.env.SMTP_EMAIL}>`,
      bcc: emailList, // BCC sends to everyone without them seeing each other's emails
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent campaign to ${emailList.length} subscribers!` 
    });

  } catch (err: any) {
    console.error("Newsletter Send Error:", err);
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }
}
