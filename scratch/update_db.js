const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = "https://wsenprneavjusqmmxobd.supabase.co";
let supabaseServiceKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    // remove quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = val;
  }
}

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const productsToUpdate = [
  { id: "103", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80" },
  { id: "104", image: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=600&q=80" },
  { id: "105", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80" },
  { id: "106", image: "https://images.unsplash.com/photo-1594498653385-d5172b532c00?w=600&q=80" },
  { id: "109", image: "https://images.unsplash.com/photo-1606244864456-8bee63fdb47e?w=600&q=80" },
  { id: "111", image: "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=600&q=80" },
  { id: "113", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80" }
];

const newProducts = [
  { id: "114", name: "TrailRunner X1 Shoes", category: "Sepatu", gender: "Unisex", price: 1450000, original_price: 1650000, tag: "Responsive", rating: 4.8, reviews: 54, sold: 120, image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80", description: "Sepatu trail running ringan dengan grip maksimal di segala medan.", highlights: ["Outsole khusus trail", "Bahan breathable", "Desain ergonomis"], specs: [{key: "Berat", value: "320g"}, {key: "Material", value: "Mesh & Synthetic"}] },
  { id: "115", name: "Alpine Grip Women's Boot", category: "Sepatu", gender: "Wanita", price: 1850000, original_price: 1850000, tag: "Vibram Sole", rating: 4.9, reviews: 36, sold: 85, image: "https://images.unsplash.com/photo-1508747705-3de10a27a5c1?w=600&q=80", description: "Sepatu boot hiking premium wanita untuk stabilitas dan kenyamanan maksimal.", highlights: ["Sol Vibram anti slip", "Lapisan waterproof", "Dukungan ankle tinggi"], specs: [{key: "Material", value: "Leather & GORE-TEX"}, {key: "Sol", value: "Vibram"}] },
  { id: "116", name: "Summit Daypack 25L", category: "Tas", gender: "Unisex", price: 1200000, original_price: 1400000, tag: "Waterproof", rating: 4.7, reviews: 41, sold: 198, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", description: "Tas punggung harian berkapasitas 25L dengan bahan anti air premium.", highlights: ["Kapasitas 25 Liter", "Kompartemen laptop 15 inch", "Bahan tahan robek"], specs: [{key: "Volume", value: "25L"}, {key: "Bahan", value: "Cordura Nylon"}] },
  { id: "117", name: "Basecamp Duffel 60L", category: "Tas", gender: "Unisex", price: 1650000, original_price: 1950000, tag: "Heavy Duty", rating: 4.9, reviews: 72, sold: 340, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80", description: "Tas duffel ekspedisi tangguh untuk menyimpan seluruh perlengkapan camping.", highlights: ["Kapasitas 60 Liter", "Anti air & lumpur", "Dua mode bawa (jinjing & ransel)"], specs: [{key: "Volume", value: "60L"}, {key: "Bahan", value: "Tarpulin Heavy Duty"}] },
  { id: "118", name: "JetBoil Stove System", category: "Alat Masak", gender: "Unisex", price: 1100000, original_price: 1250000, tag: "Fast Boil", rating: 4.8, reviews: 63, sold: 145, image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&q=80", description: "Kompor portable hiking super cepat untuk memasak air dan makanan di alam liar.", highlights: ["Waktu didih di bawah 100 detik", "Hemat gas", "Ringan & compact"], specs: [{key: "Tipe Gas", value: "Butane/Propane"}, {key: "Berat", value: "400g"}] },
  { id: "119", name: "Alpine Water Filter", category: "Alat Masak", gender: "Unisex", price: 550000, original_price: 650000, tag: "0.1 Microns", rating: 4.7, reviews: 29, sold: 90, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80", description: "Filter air portable ultralight untuk menyaring air langsung dari sumber alam.", highlights: ["Menyaring 99.99% bakteri", "Kapasitas hingga 2000L", "Sangat ringan & praktis"], specs: [{key: "Ukuran Pori", value: "0.1 Micron"}, {key: "Berat", value: "65g"}] },
  { id: "120", name: "Ridge Softshell Pants", category: "Pakaian", gender: "Pria", price: 780000, original_price: 950000, tag: "Stretchable", rating: 4.6, reviews: 31, sold: 112, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80", description: "Celana outdoor softshell elastis dan cepat kering untuk kenyamanan pergerakan.", highlights: ["Bahan 4-way stretch", "Water repellent", "Banyak saku taktis"], specs: [{key: "Bahan", value: "Polyester Elastane"}, {key: "Fit", value: "Regular"}] },
  { id: "121", name: "Kids Trekking Sandal", category: "Sepatu", gender: "Anak", price: 320000, original_price: 420000, tag: "Flexible", rating: 4.7, reviews: 18, sold: 64, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80", description: "Sandal trekking anak-anak yang aman, fleksibel, dan memiliki pelindung kaki depan.", highlights: ["Pelindung jari kaki depan", "Tali strap adjustable", "Sol anti licin"], specs: [{key: "Usia", value: "5-10 Tahun"}, {key: "Sol", value: "Rubber Grippy"}] },
  { id: "122", name: "Solar Charger Panel", category: "Navigasi", gender: "Unisex", price: 750000, original_price: 900000, tag: "Eco Friendly", rating: 4.8, reviews: 25, sold: 58, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80", description: "Panel surya portable lipat untuk mengisi daya baterai device Anda di tengah hutan.", highlights: ["Output USB dual", "Desain lipat praktis", "Bahan tahan cuaca ekstrem"], specs: [{key: "Kapasitas", value: "15W"}, {key: "Dimensi Lipat", value: "15x10cm"}] }
];

async function run() {
  console.log("Starting DB update...");
  
  // 1. Update existing images
  for (const prod of productsToUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update({ image: prod.image })
      .eq('id', prod.id);
      
    if (error) {
      console.error(`Error updating product ${prod.id}:`, error);
    } else {
      console.log(`Updated image for product ${prod.id}`);
    }
  }

  // 2. Insert new products
  for (const prod of newProducts) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('id', prod.id)
      .maybeSingle();

    if (existing) {
      console.log(`Product ${prod.id} (${prod.name}) already exists. Updating details.`);
      const { error } = await supabase
        .from('products')
        .update(prod)
        .eq('id', prod.id);
      if (error) console.error(`Error updating product ${prod.id}:`, error);
    } else {
      const { error } = await supabase
        .from('products')
        .insert([prod]);
      if (error) {
        console.error(`Error inserting product ${prod.id}:`, error);
      } else {
        console.log(`Inserted new product ${prod.id} (${prod.name})`);
      }
    }
  }

  console.log("DB update finished!");
}

run();
