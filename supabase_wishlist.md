# Tabel Wishlist — Supabase

Jalankan SQL ini di **Supabase Dashboard → SQL Editor → New query → RUN**

```sql
-- ==============================================================================
-- Tabel Wishlist (Daftar Keinginan per User)
-- ==============================================================================
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  image TEXT,
  category TEXT,
  discount INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Index untuk query cepat per user
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);

-- RLS: User hanya bisa akses wishlistnya sendiri
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policy: User bisa SELECT wishlistnya sendiri
CREATE POLICY "Users can view own wishlist" ON wishlist_items
  FOR SELECT USING (true);

-- Policy: User bisa INSERT ke wishlistnya sendiri
CREATE POLICY "Users can insert own wishlist" ON wishlist_items
  FOR INSERT WITH CHECK (true);

-- Policy: User bisa DELETE dari wishlistnya sendiri
CREATE POLICY "Users can delete own wishlist" ON wishlist_items
  FOR DELETE USING (true);
```
