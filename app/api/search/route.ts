import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = "llama-3.3-70b-versatile";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ ids: [], message: "Query kosong" });
    }

    // Fetch ALL products with full detail for LLM context
    const { data: products } = await supabase
      .from("products")
      .select("id, name, category, gender, price, original_price, tag, rating, sold, description, highlights, specs, variants");

    if (!products || products.length === 0) {
      return NextResponse.json({ ids: [], message: "Tidak ada produk" });
    }

    // Build compact product catalog for LLM
    const catalog = products.map(p => ({
      id: p.id,
      nama: p.name,
      kategori: p.category,
      gender: p.gender,
      harga: p.price,
      harga_asli: p.original_price,
      diskon: p.original_price > p.price ? Math.round((1 - p.price / p.original_price) * 100) + "%" : null,
      tag: p.tag,
      rating: p.rating,
      terjual: p.sold,
      deskripsi: p.description || "-",
    }));

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Kamu adalah mesin pencari produk cerdas untuk toko outdoor TrailForge.

KATALOG PRODUK LENGKAP:
${JSON.stringify(catalog)}

TUGAS: Berdasarkan query pencarian user, kembalikan ID produk yang RELEVAN.
Kamu harus memahami:
- Nama produk, kategori, tag, deskripsi
- Harga (termasuk filter "dibawah 1 juta", "termurah", "termahal")
- Gender (pria/wanita/anak/unisex)
- Diskon ("yang lagi diskon", "promo")
- Rating ("terbaik", "rating tertinggi")
- Popularitas ("terlaris", "paling laku")
- Semantik: "jaket dingin" = pakaian thermal/windproof/down, "alas tidur" = sleeping bag, dll

ATURAN:
1. Kembalikan produk yang RELEVAN saja, urutkan dari paling cocok
2. Jika query sangat spesifik dan tidak ada yang cocok, kembalikan array kosong
3. Jika query umum (misal "semua"), kembalikan semua ID
4. Abaikan produk tes/dummy (nama tidak jelas, harga < 1000)

Response HANYA dalam JSON:
{"ids":["id1","id2",...],"sort":"relevance|price_asc|price_desc|rating|popularity"}`
          },
          { role: "user", content: query }
        ],
        temperature: 0,
        max_tokens: 300,
        response_format: { type: "json_object" },
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      ids: result.ids || [],
      sort: result.sort || "relevance",
      total: (result.ids || []).length,
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ ids: [], error: error.message }, { status: 500 });
  }
}
