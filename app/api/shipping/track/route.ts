import { NextResponse } from "next/server";

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "";
const BITESHIP_BASE_URL = "https://api.biteship.com/v1";

// GET /api/shipping/track?id=TRACKING_ID
// GET /api/shipping/track?waybill=WAYBILL_ID&courier=COURIER_CODE
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get("id");
  const waybillId = searchParams.get("waybill");
  const courierCode = searchParams.get("courier");

  try {
    let url = "";
    
    if (trackingId) {
      // Track by Biteship Tracking ID (pesanan dibuat via Biteship Orders API)
      url = `${BITESHIP_BASE_URL}/trackings/${trackingId}`;
    } else if (waybillId && courierCode) {
      // Track by Waybill ID + Courier Code (public tracking — bisa pakai resi dari mana saja)
      url = `${BITESHIP_BASE_URL}/trackings/${waybillId}/couriers/${courierCode}`;
    } else {
      return NextResponse.json(
        { error: "Provide 'id' or both 'waybill' and 'courier' query params." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BITESHIP_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || "Failed to retrieve tracking", raw: data },
        { status: 200 }
      );
    }

    // Format response yang bersih untuk frontend
    return NextResponse.json({
      success: true,
      id: data.id,
      waybill_id: data.waybill_id,
      courier: {
        company: data.courier?.company,
        name: data.courier?.name,
        phone: data.courier?.phone,
        driver_name: data.courier?.driver_name,
        driver_phone: data.courier?.driver_phone,
      },
      origin: data.origin,
      destination: data.destination,
      status: data.status,
      history: data.history,
    });
  } catch (error: any) {
    console.error("Tracking Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch tracking data", message: error.message },
      { status: 500 }
    );
  }
}
