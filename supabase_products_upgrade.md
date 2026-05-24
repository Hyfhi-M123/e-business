# Upgrade Tabel Products — Supabase

Jalankan SQL ini di **Supabase Dashboard → SQL Editor → New query → RUN** untuk meng-upgrade struktur tabel `products`.

```sql
-- ==============================================================================
-- Alter Tabel Products (Menambahkan Kolom JSON untuk Detail Produk)
-- ==============================================================================

-- 1. Tambahkan kolom description (TEXT)
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Tambahkan kolom highlights (JSONB array string)
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- 3. Tambahkan kolom specs (JSONB array of objects: {key, value})
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb;

-- 4. Tambahkan kolom variants (JSONB array of objects: {size, colorName, price, originalPrice, stock, sku})
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 5. Tambahkan kolom images (JSONB array of strings)
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Catatan:
-- JSONB dipilih karena sangat efisien untuk menyimpan array dan objek kompleks 
-- tanpa harus membuat tabel relasional yang terpisah (sizes, colors, images).
-- Ini sangat ideal untuk e-commerce modern dengan Supabase/PostgreSQL.
```
