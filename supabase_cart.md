# Tabel Keranjang (Cart) — Supabase

Jalankan SQL ini di **Supabase Dashboard → SQL Editor → New query → RUN**

```sql
-- ==============================================================================
-- Tabel Cart Items (Keranjang Belanja per User)
-- ==============================================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  image TEXT,
  category TEXT,
  tag TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT DEFAULT 'M',
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk query cepat per user
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- RLS: User hanya bisa akses keranjangnya sendiri
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: User bisa SELECT keranjangnya sendiri
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (true);

-- Policy: User bisa INSERT ke keranjangnya sendiri
CREATE POLICY "Users can insert own cart" ON cart_items
  FOR INSERT WITH CHECK (true);

-- Policy: User bisa UPDATE keranjangnya sendiri
CREATE POLICY "Users can update own cart" ON cart_items
  FOR UPDATE USING (true);

-- Policy: User bisa DELETE dari keranjangnya sendiri
CREATE POLICY "Users can delete own cart" ON cart_items
  FOR DELETE USING (true);
```
