# TrailForge Database Setup (Supabase)

Langkah-langkah untuk menyiapkan database TrailForge di Supabase.

1. Buka dashboard proyek Supabase-mu.
2. Buka menu **SQL Editor** di sidebar kiri.
3. Buat *query* baru (`New query`), *copy-paste* kode SQL di bawah ini, dan klik **RUN**.

```sql
-- ==============================================================================
-- 1. Tabel Produk
-- ==============================================================================
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  tag TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. Seed Data Produk Dummy (Memindahkan DUMMY_PRODUCTS ke Database)
-- ==============================================================================
INSERT INTO products (id, name, category, gender, price, original_price, tag, rating, reviews, sold, image) VALUES
('101', 'Vertex Summit Tent', 'Tenda', 'Unisex', 3450000, 4200000, 'Ultralight', 4.9, 87, 342, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'),
('102', 'Timberline X-Coat Arctic', 'Pakaian', 'Pria', 1200000, 1800000, 'Thermal', 4.8, 124, 892, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'),
('103', 'AeroStep Mountain Boot', 'Sepatu', 'Pria', 2150000, 2150000, 'GORE-TEX', 4.7, 203, 1540, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80'),
('104', 'Polaris Compass Pro', 'Navigasi', 'Unisex', 450000, 600000, 'Akurasi 99%', 4.6, 56, 230, 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=600&q=80'),
('105', 'Everest Sleeping Bag', 'Tenda', 'Unisex', 1800000, 2200000, '-15°C Rated', 4.9, 167, 678, 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80'),
('106', 'Titanium Cookset Elite', 'Alat Masak', 'Unisex', 850000, 850000, 'Tahan Karat', 4.5, 89, 445, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'),
('107', 'Storm Shell V2 Jacket', 'Pakaian', 'Wanita', 980000, 1400000, 'Windproof', 4.6, 78, 310, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80'),
('108', 'Glacier Down Parka', 'Pakaian', 'Wanita', 1500000, 1500000, '800-Fill', 4.9, 201, 920, 'https://images.unsplash.com/photo-1532054950669-026859e2185c?w=600&q=80'),
('109', 'Summit Fleece Pro', 'Pakaian', 'Pria', 650000, 750000, 'Midlayer', 4.7, 145, 780, 'https://images.unsplash.com/photo-1606244864456-8bee63fdb47e?w=600&q=80'),
('110', 'Trailblazer 55L Pack', 'Tas', 'Unisex', 2800000, 3500000, 'Ergonomic', 4.8, 312, 1100, 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80'),
('111', 'NightVision Headlamp', 'Navigasi', 'Unisex', 380000, 380000, '1200 Lumens', 4.4, 94, 560, 'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=600&q=80'),
('112', 'Carbon Trekking Poles', 'Navigasi', 'Unisex', 1250000, 1600000, 'Ultralight', 4.8, 176, 890, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80'),
('113', 'Kids Explorer Set', 'Tenda', 'Anak', 450000, 550000, 'Aman Anak', 4.8, 42, 120, 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80'),
('114', 'TrailRunner X1 Shoes', 'Sepatu', 'Unisex', 1450000, 1650000, 'Responsive', 4.8, 54, 120, 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80'),
('115', 'Alpine Grip Women\'s Boot', 'Sepatu', 'Wanita', 1850000, 1850000, 'Vibram Sole', 4.9, 36, 85, 'https://images.unsplash.com/photo-1508747705-3de10a27a5c1?w=600&q=80'),
('116', 'Summit Daypack 25L', 'Tas', 'Unisex', 1200000, 1400000, 'Waterproof', 4.7, 41, 198, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'),
('117', 'Basecamp Duffel 60L', 'Tas', 'Unisex', 1650000, 1950000, 'Heavy Duty', 4.9, 72, 340, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80'),
('118', 'JetBoil Stove System', 'Alat Masak', 'Unisex', 1100000, 1250000, 'Fast Boil', 4.8, 63, 145, 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&q=80'),
('119', 'Alpine Water Filter', 'Alat Masak', 'Unisex', 550000, 650000, '0.1 Microns', 4.7, 29, 90, 'https://images.unsplash.com/photo-1585832770485-e289c1e67048?w=600&q=80'),
('120', 'Ridge Softshell Pants', 'Pakaian', 'Pria', 780000, 950000, 'Stretchable', 4.6, 31, 112, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80'),
('121', 'Kids Trekking Sandal', 'Sepatu', 'Anak', 320000, 420000, 'Flexible', 4.7, 18, 64, 'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=600&q=80'),
('122', 'Solar Charger Panel', 'Navigasi', 'Unisex', 750000, 900000, 'Eco Friendly', 4.8, 25, 58, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80');

-- ==============================================================================
-- 3. Tabel Orders (Pesanan)
-- ==============================================================================
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'Belum Bayar',
  total_amount INTEGER NOT NULL,
  payment_method TEXT,
  shipping_courier TEXT,
  shipping_service TEXT,
  shipping_receipt TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  packed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- 4. Tabel Order Items (Detail Keranjang)
-- ==============================================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup Row Level Security (RLS) - Agar database bisa dibaca dari frontend anonim (sementara untuk katalog)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);
```
