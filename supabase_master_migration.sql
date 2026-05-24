-- ============================================
-- TRAILFORGE: MASTER MIGRATION
-- Jalankan seluruh script ini di Supabase SQL Editor
-- ============================================

-- 1. Kolom cost breakdown & recipient di tabel orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS insurance_cost NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_discount NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_phone TEXT;

-- 2. Kolom Midtrans metadata
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_time TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gross_amount NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_status TEXT;

-- 3. Kolom fulfillment (pastikan ada)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_receipt TEXT;

-- ============================================
-- 4. Tabel Promo Codes
-- ============================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'shipping')),
  value NUMERIC NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'expired')),
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  min_order_amount NUMERIC DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS untuk promo_codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active promos" ON promo_codes;
CREATE POLICY "Public can read active promos"
  ON promo_codes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage promos" ON promo_codes;
CREATE POLICY "Service role can manage promos"
  ON promo_codes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed promo awal
INSERT INTO promo_codes (code, type, value, description, status, usage_limit)
VALUES ('TRAILFORGE10', 'percentage', 10, 'Diskon 10% untuk semua produk', 'active', 1000)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 5. Verifikasi tabel newsletter_subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" 
  ON newsletter_subscribers FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read subscribers" ON newsletter_subscribers;
CREATE POLICY "Service role can read subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (true);
-- ============================================
-- 6. Tabel store_settings
-- ============================================
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can read settings" ON store_settings;
CREATE POLICY "Service role can read settings"
  ON store_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can modify settings" ON store_settings;
CREATE POLICY "Service role can modify settings"
  ON store_settings FOR ALL
  USING (true);
