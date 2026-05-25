import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MODEL = "llama-3.3-70b-versatile";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ─── STATIC KNOWLEDGE ───────────────────────────────────────
const NAVIGATION_KNOWLEDGE: Record<string, any> = {
  change_password: {
    path: "/profil",
    highlights: ["#password-section"],
    tooltips: { "#password-section": "Scroll ke bagian ini untuk mengubah password Anda" }
  },
  edit_profile: {
    path: "/profil",
    highlights: ["#profile-form"],
    tooltips: { "#profile-form": "Edit informasi profil Anda di sini" }
  },
  add_to_cart: {
    path: "/katalog",
    highlights: [".product-card"],
    tooltips: { ".product-card": "Klik produk lalu tekan tombol Tambah ke Keranjang" }
  },
  checkout: {
    path: "/keranjang",
    highlights: ["#checkout-section"],
    tooltips: { "#checkout-section": "Klik tombol checkout untuk lanjut ke pembayaran" }
  },
  track_order: {
    path: "/profil",
    highlights: [".order-history-section"],
    tooltips: { ".order-history-section": "Klik pesanan untuk melihat detail & tracking" }
  },
  view_promo: {
    path: "/promo",
    highlights: [".promo-card"],
    tooltips: { ".promo-card": "Lihat promo yang tersedia dan klaim diskon" }
  },
  size_guide: {
    path: "/panduan-ukuran",
    highlights: [],
    tooltips: {}
  },
  view_catalog: {
    path: "/katalog",
    highlights: [],
    tooltips: {}
  }
};

const FAQ_KNOWLEDGE = `
TrailForge — Toko Perlengkapan Outdoor Premium Indonesia

PENGIRIMAN:
- JNE Reguler: 2-3 hari kerja
- J&T Express: 1-2 hari kerja
- SiCepat BEST: 1-2 hari kerja
- Gratis ongkir untuk pembelian di atas Rp 500.000

PENGEMBALIAN:
- Maksimal 7 hari setelah barang diterima
- Barang harus dalam kondisi original (tag masih terpasang)
- Hubungi CS untuk proses retur

PEMBAYARAN:
- Transfer Bank (BCA, BNI, Mandiri, BRI)
- E-Wallet (GoPay, ShopeePay, OVO, DANA)
- QRIS
- Kartu Kredit/Debit via Midtrans

JAM OPERASIONAL:
- Senin-Jumat: 08.00-21.00 WIB
- Sabtu-Minggu: 09.00-18.00 WIB

KONTAK:
- Email: support@trailforge.id
- WhatsApp: +62 812-3456-7890
`;

// ─── GROQ LLM CALL ──────────────────────────────────────────
async function callGroq(messages: any[], temperature = 0.7, maxTokens = 400) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.choices[0].message.content);
}

// ─── STEP 1: INTENT ROUTER ──────────────────────────────────
async function routeIntent(userMessage: string) {
  const messages = [
    {
      role: "system",
      content: `Kamu adalah intent router. Klasifikasikan pesan user ke salah satu intent.
Balas HANYA dalam JSON, tanpa penjelasan.

Intent yang tersedia:
- "product_search": user mencari/bertanya tentang produk, gear, rekomendasi barang, atau fitur produk
- "navigation": user bertanya cara melakukan sesuatu di website (ganti password, checkout, cara beli, cara bayar, dll)
- "order_status": user bertanya tentang pesanan, pengiriman, resi, atau status order mereka
- "general_faq": pertanyaan umum (kebijakan, ongkir, jam operasional, kontak, pengembalian, dll)
- "casual": sapaan, basa-basi, terima kasih, atau di luar konteks toko

Format response:
{"intent":"...","keywords":["..."],"nav_action":"..."}`
    },
    { role: "user", content: userMessage }
  ];
  return await callGroq(messages, 0, 150);
}

// ─── STEP 2: CONTEXT RETRIEVER (no LLM) ─────────────────────
async function retrieveContext(intent: string, keywords: string[], navAction: string) {
  if (intent === "product_search") {
    // Search products by keywords
    let query = supabase.from("products").select("id, name, description, price, category, image, stock");
    
    // Build OR filter for keywords
    if (keywords.length > 0) {
      const orFilters = keywords.map(k => `name.ilike.%${k}%,description.ilike.%${k}%,category.ilike.%${k}%`).join(",");
      query = query.or(orFilters);
    }
    
    const { data: products } = await query.limit(8);
    
    // If keyword search returned nothing, fetch all products for LLM to pick from
    if (!products || products.length === 0) {
      const { data: allProducts } = await supabase.from("products").select("id, name, description, price, category, image").limit(20);
      return { products: allProducts || [] };
    }
    return { products };
  }

  if (intent === "navigation") {
    // Try exact match first
    let navData = NAVIGATION_KNOWLEDGE[navAction] || null;
    
    // Fuzzy match: find best matching navigation by keywords
    if (!navData && keywords.length > 0) {
      const keywordStr = keywords.join(" ").toLowerCase();
      const matchMap: Record<string, string[]> = {
        change_password: ["password", "sandi", "ganti password", "ubah password", "reset password"],
        edit_profile: ["profil", "profile", "edit profil", "ubah profil", "nama", "foto"],
        add_to_cart: ["keranjang", "cart", "tambah", "beli", "add"],
        checkout: ["checkout", "bayar", "pembayaran", "payment"],
        track_order: ["lacak", "track", "resi", "pesanan", "order", "pengiriman", "kirim"],
        view_promo: ["promo", "diskon", "kupon", "voucher", "sale"],
        size_guide: ["ukuran", "size", "panduan ukuran", "size guide"],
        view_catalog: ["katalog", "catalog", "produk", "product", "browse"],
      };
      
      for (const [key, matchWords] of Object.entries(matchMap)) {
        if (matchWords.some(w => keywordStr.includes(w))) {
          navData = NAVIGATION_KNOWLEDGE[key];
          break;
        }
      }
    }
    
    // Last resort: default to profil page
    if (!navData) {
      navData = NAVIGATION_KNOWLEDGE["edit_profile"];
    }
    
    return { navigation: navData, allNavKeys: Object.keys(NAVIGATION_KNOWLEDGE) };
  }

  if (intent === "general_faq") {
    return { faq: FAQ_KNOWLEDGE };
  }

  if (intent === "order_status") {
    return { orderInfo: "User perlu login untuk melihat status pesanan. Arahkan ke halaman Profil > Riwayat Pesanan." };
  }

  return {};
}

// ─── STEP 3: RESPONSE GENERATOR ─────────────────────────────
async function generateResponse(intent: string, userMessage: string, context: any, history: any[]) {
  const conversationHistory = history.slice(-6).map((m: any) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text
  }));

  let systemPrompt = "";

  if (intent === "product_search") {
    systemPrompt = `Kamu adalah Trail Guide AI, asisten cerdas di toko outdoor TrailForge.
User mencari produk. Berikut produk yang tersedia dan MUNGKIN relevan:

${JSON.stringify(context.products?.map((p: any) => ({ id: p.id, name: p.name, desc: p.description?.substring(0, 100), price: p.price, category: p.category })))}

INSTRUKSI:
1. Pilih 1-4 produk yang PALING cocok dengan kebutuhan user
2. Jelaskan singkat kenapa cocok (1 kalimat per produk)
3. Gunakan bahasa Indonesia yang ramah dan berjiwa petualang
4. SELALU tawarkan untuk memandu user ke katalog

Response HARUS dalam JSON:
{"reply":"penjelasan natural...","action":"products","products":["id-1","id-2"],"offer_guide":true}

Jika TIDAK ADA produk yang cocok:
{"reply":"Maaf, belum ada produk yang cocok...","action":null,"products":[],"offer_guide":false}`;
  } else if (intent === "navigation") {
    systemPrompt = `Kamu adalah Trail Guide AI, asisten cerdas di toko outdoor TrailForge.
User bertanya cara melakukan sesuatu di website.

Info navigasi yang relevan: ${JSON.stringify(context.navigation)}
Semua halaman yang tersedia: ${JSON.stringify(context.allNavKeys)}

INSTRUKSI:
1. Jawab pertanyaan user dengan jelas dan SINGKAT (2-3 kalimat)
2. Gunakan bahasa Indonesia yang ramah
3. SELALU tawarkan untuk memandu user secara interaktif

Response HARUS dalam JSON:
{"reply":"penjelasan...","action":"guide","guide":${JSON.stringify(context.navigation)},"offer_guide":true}

Jika navigasi tidak ditemukan, tetap jawab dengan helpful dan set action null:
{"reply":"penjelasan...","action":null,"guide":null,"offer_guide":false}`;
  } else if (intent === "general_faq") {
    systemPrompt = `Kamu adalah Trail Guide AI, asisten cerdas di toko outdoor TrailForge.

Informasi FAQ:
${context.faq}

INSTRUKSI: Jawab pertanyaan user berdasarkan FAQ di atas. Singkat, ramah, dan informatif.
Response dalam JSON: {"reply":"jawaban...","action":null,"offer_guide":false}`;
  } else if (intent === "order_status") {
    systemPrompt = `Kamu adalah Trail Guide AI. User bertanya soal pesanan.
${context.orderInfo}
Arahkan user untuk mengecek di halaman Profil > Riwayat Pesanan, dan tawarkan untuk memandu.
Response dalam JSON: {"reply":"...","action":"guide","guide":{"path":"/profil","highlights":[".order-history-section"],"tooltips":{".order-history-section":"Cek status pesanan Anda di sini"}},"offer_guide":true}`;
  } else {
    systemPrompt = `Kamu adalah Trail Guide AI, asisten ramah di toko outdoor TrailForge.
Jawab sapaan/basa-basi dengan ramah dan singkat. Arahkan pembicaraan ke topik toko jika memungkinkan.
Response dalam JSON: {"reply":"jawaban ramah...","action":null,"offer_guide":false}`;
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];

  return await callGroq(messages, 0.7, 500);
}

// ─── MAIN HANDLER ────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    // Step 1: Route intent
    const routerResult = await routeIntent(message);
    const intent = routerResult.intent || "casual";
    const keywords = routerResult.keywords || [];
    const navAction = routerResult.nav_action || "";

    // Step 2: Retrieve context (no LLM)
    const context = await retrieveContext(intent, keywords, navAction);

    // Step 3: Generate response
    const response = await generateResponse(intent, message, context, history);

    // ── Post-process: force-inject correct structured data ──
    // Don't trust LLM to echo back complex JSON objects correctly

    // Navigation: force-inject guide from static knowledge
    if (intent === "navigation" && context.navigation) {
      response.action = "guide";
      response.guide = context.navigation;
      response.offer_guide = true;
    }

    // Order status: force-inject guide to profil
    if (intent === "order_status") {
      response.action = "guide";
      response.guide = { path: "/profil", highlights: [".order-history-section"], tooltips: { ".order-history-section": "Cek status pesanan Anda di sini" } };
      response.offer_guide = true;
    }

    // Products: ensure IDs are strings & enrich with details
    if (response.action === "products" && response.products?.length > 0) {
      response.products = response.products.map((id: any) => String(id));
      const { data: productDetails } = await supabase
        .from("products")
        .select("id, name, price, image, category")
        .in("id", response.products);
      response.productDetails = productDetails || [];
    }

    return NextResponse.json({
      success: true,
      ...response,
      _debug: { intent, keywords, navAction }
    });
  } catch (error: any) {
    console.error("Assistant API Error:", error);
    return NextResponse.json({
      success: false,
      reply: "Maaf, terjadi gangguan pada sistem. Coba lagi dalam beberapa saat ya!",
      action: null,
      error: error.message
    }, { status: 500 });
  }
}
