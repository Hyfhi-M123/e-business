-- Tambah kolom Midtrans di tabel orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_transaction_time TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_gross_amount NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_status TEXT;
