# Supabase RLS Policies untuk Orders

Jalankan SQL ini di **SQL Editor** Supabase untuk mengizinkan insert ke tabel `orders` dan `order_items`:

```sql
-- Enable RLS pada tabel orders dan order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Izinkan siapa saja INSERT ke tabel orders (untuk checkout)
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Izinkan siapa saja SELECT orders (untuk melihat pesanan)
CREATE POLICY "Allow select orders" ON orders FOR SELECT USING (true);

-- Izinkan siapa saja UPDATE orders (untuk update status)
CREATE POLICY "Allow update orders" ON orders FOR UPDATE USING (true);

-- Izinkan siapa saja INSERT ke tabel order_items
CREATE POLICY "Allow insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Izinkan siapa saja SELECT order_items
CREATE POLICY "Allow select order_items" ON order_items FOR SELECT USING (true);
```
