import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

// Alamat toko (origin) — Jakarta Selatan
const STORE_POSTAL_CODE = 12190;

export async function POST(req: Request) {
  try {
    let dynamicBiteshipKey = process.env.BITESHIP_API_KEY || "";
    
    // 1. Fetch Dynamic Biteship Key from Settings
    const { data: settingsData } = await supabase.from("store_settings").select("*");
    if (settingsData) {
      const biteshipRow = settingsData.find(row => row.key === "biteshipApiKey");
      if (biteshipRow?.value) dynamicBiteshipKey = biteshipRow.value;
    }
    const body = await req.json();
    const { destination_postal_code, items } = body;

    if (!destination_postal_code) {
      return NextResponse.json(
        { error: "destination_postal_code is required" },
        { status: 400 }
      );
    }

    // Format items sesuai spesifikasi Biteship
    const biteshipItems = (items || []).map((item: any) => ({
      name: item.name || "Produk TrailForge",
      description: item.description || "",
      value: item.value || item.price || 100000,
      length: item.length || 30,
      width: item.width || 20,
      height: item.height || 15,
      weight: item.weight || 1000, // gram
      quantity: item.quantity || 1,
    }));

    // Jika tidak ada items, buat default
    if (biteshipItems.length === 0) {
      biteshipItems.push({
        name: "Produk TrailForge",
        description: "Adventure gear",
        value: 100000,
        length: 30,
        width: 20,
        height: 15,
        weight: 1000,
        quantity: 1,
      });
    }

    const payload = {
      origin_postal_code: STORE_POSTAL_CODE,
      destination_postal_code: parseInt(destination_postal_code),
      couriers: "jne,sicepat,anteraja,jnt,ninja,tiki",
      items: biteshipItems,
    };

    const response = await fetch(`${BITESHIP_BASE_URL}/rates/couriers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dynamicBiteshipKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Biteship Error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to fetch rates", fallback: true, rates: getFallbackRates() },
        { status: 200 }
      );
    }

    // Format response yang clean untuk frontend
    const rates = data.pricing.map((rate: any) => ({
      courier_name: rate.courier_name,
      courier_code: rate.courier_code,
      service_name: rate.courier_service_name,
      service_code: rate.courier_service_code,
      service_type: rate.service_type,
      description: rate.description,
      duration: rate.duration,
      price: rate.price,
      shipping_fee: rate.shipping_fee,
      insurance_fee: rate.insurance_fee || 0,
      company: rate.company,
    }));

    // Sort by price ascending
    rates.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({
      success: true,
      origin: data.origin,
      destination: data.destination,
      rates,
    });
  } catch (error: any) {
    console.error("Shipping Rate Error:", error.message);
    // Fallback jika Biteship down atau API key belum ada
    return NextResponse.json({
      success: true,
      fallback: true,
      rates: getFallbackRates(),
    });
  }
}

// Fallback rates jika Biteship tidak tersedia
function getFallbackRates() {
  return [
    {
      courier_name: "JNE",
      courier_code: "jne",
      service_name: "Reguler (REG)",
      service_code: "reg",
      service_type: "standard",
      description: "Layanan pengiriman reguler",
      duration: "2 - 3 days",
      price: 18000,
      shipping_fee: 18000,
      insurance_fee: 0,
      company: "jne",
    },
    {
      courier_name: "JNE",
      courier_code: "jne",
      service_name: "YES (Yes Everyday Service)",
      service_code: "yes",
      service_type: "express",
      description: "Layanan pengiriman cepat",
      duration: "1 days",
      price: 36000,
      shipping_fee: 36000,
      insurance_fee: 0,
      company: "jne",
    },
    {
      courier_name: "SiCepat",
      courier_code: "sicepat",
      service_name: "Reguler",
      service_code: "reg",
      service_type: "standard",
      description: "Layanan reguler SiCepat",
      duration: "1 - 2 days",
      price: 15000,
      shipping_fee: 15000,
      insurance_fee: 0,
      company: "sicepat",
    },
    {
      courier_name: "SiCepat",
      courier_code: "sicepat",
      service_name: "Besok Sampai Tujuan (BEST)",
      service_code: "best",
      service_type: "overnight",
      description: "Besok sampai tujuan",
      duration: "1 days",
      price: 28000,
      shipping_fee: 28000,
      insurance_fee: 0,
      company: "sicepat",
    },
    {
      courier_name: "AnterAja",
      courier_code: "anteraja",
      service_name: "Reguler",
      service_code: "reg",
      service_type: "standard",
      description: "Pengiriman standar",
      duration: "2 - 3 days",
      price: 16000,
      shipping_fee: 16000,
      insurance_fee: 0,
      company: "anteraja",
    },
  ];
}
