import { NextResponse } from "next/server";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "";
const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

// POST /api/shipping/order — Buat order pengiriman ke Biteship
// Dipanggil saat admin memproses pesanan & menyerahkan ke kurir
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_id,           // ID pesanan TrailForge (e.g. "TRF-991203")
      shipper_name,       // Nama pengirim (toko)
      shipper_phone,      // Telepon toko
      shipper_email,      // Email toko  
      origin_address,     // Alamat lengkap toko
      origin_postal_code, // Kode pos toko
      destination_name,   // Nama penerima
      destination_phone,  // Telepon penerima
      destination_email,  // Email penerima
      destination_address,// Alamat lengkap penerima
      destination_postal_code, // Kode pos penerima
      courier_code,       // Kode kurir (jne, sicepat, dll)
      courier_service,    // Kode layanan (reg, yes, best, dll)
      items,              // Array produk
    } = body;

    // Validasi
    if (!destination_name || !destination_phone || !destination_address || !courier_code || !courier_service) {
      return NextResponse.json(
        { error: "Missing required fields: destination_name, destination_phone, destination_address, courier_code, courier_service" },
        { status: 400 }
      );
    }

    // Format items untuk Biteship
    const biteshipItems = (items || []).map((item: any) => ({
      id: item.id || "",
      name: item.name || "Produk TrailForge",
      description: item.variant || item.description || "",
      image: item.image || "",
      value: item.price || item.value || 100000,
      quantity: item.qty || item.quantity || 1,
      weight: item.weight || 1000, // gram
      length: item.length || 30,   // cm
      width: item.width || 20,
      height: item.height || 15,
    }));

    const payload = {
      // Referensi internal
      shipper_contact_name: shipper_name || "TrailForge Official",
      shipper_contact_phone: shipper_phone || "081234567890",
      shipper_contact_email: shipper_email || "store@trailforge.id",
      shipper_organization: "TrailForge Expedition Gear",
      // Origin
      origin_contact_name: shipper_name || "TrailForge Official",
      origin_contact_phone: shipper_phone || "081234567890",
      origin_address: origin_address || "Jl. Sudirman Kav 52-53, SCBD, Jakarta Selatan",
      origin_postal_code: origin_postal_code || 12190,
      origin_coordinate: { latitude: -6.2271, longitude: 106.8083 },
      // Destination
      destination_contact_name: destination_name,
      destination_contact_phone: destination_phone,
      destination_contact_email: destination_email || "",
      destination_address: destination_address,
      destination_postal_code: parseInt(destination_postal_code) || 0,
      // Courier
      courier_company: courier_code,
      courier_type: courier_service,
      // Order type: pickup or dropoff
      delivery_type: "now",
      order_note: `Pesanan TrailForge #${order_id || "N/A"}`,
      // Metadata
      metadata: {
        trailforge_order_id: order_id || "",
      },
      // Items
      items: biteshipItems,
    };

    console.log("[Biteship] Creating order:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${BITESHIP_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BITESHIP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success && !data.id) {
      console.error("[Biteship] Order creation failed:", data);
      return NextResponse.json(
        { error: data.error || "Failed to create shipping order", details: data },
        { status: 400 }
      );
    }

    console.log("[Biteship] Order created successfully:", data.id);

    // Return clean response
    return NextResponse.json({
      success: true,
      biteship_order_id: data.id,
      status: data.status,
      courier: {
        company: data.courier?.company,
        driver_name: data.courier?.driver_name,
        driver_phone: data.courier?.driver_phone,
        tracking_id: data.courier?.tracking_id,
        waybill_id: data.courier?.waybill_id,
        link: data.courier?.link,
      },
      price: data.price,
      note: data.note,
    });
  } catch (error: any) {
    console.error("[Biteship] Order Error:", error.message);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
