# 📐 Riset UI/UX & Arsitektur Sistem
**Penanggung Jawab:** Anggota 2 (Frontend) & Anggota 3 (Backend)

Dokumen ini merangkum persiapan teknis sebelum masuk ke tahap eksekusi kode di Minggu ke-2.

## 1. Riset Antarmuka & UX (Frontend - Anggota 2)
### Konsep Interaksi Inti:
Menerapkan *Micro-interactions* berkonsep alam & adventure untuk memberikan kesan website "Immersive & Premium":
- **Morphing Cards**: Saat card produk di-expand, ia berubah bentuk (morph) secara organik — seperti peta yang dibuka. (Menggunakan `layoutId` dari Framer Motion).
- **Glassmorphism + Earth Tone**: Navbar dan komponen floating menggunakan efek kaca buram dengan sentuhan warna alam (hijau hutan, cokelat tanah).
- **Parallax Hero**: Landing page dengan efek parallax gunung/hutan untuk kesan immersive.
- **Gaya Navigasi Mandiri (Colocation)**: Setiap halaman hidup di folder spesifiknya untuk meminimalisir kompleksitas.

### User Flow (Alur Pengguna):
1. User masuk ke `Landing Page` — disambut visual hero gunung & tagline "Gear Up. Go Wild."
2. Scroll atau klik "Jelajahi Gear" → Halaman katalog produk outdoor.
3. User memilih produk → Card expand menampilkan detail, spesifikasi, dan review.
4. Klik "Tambah ke Keranjang" → Produk masuk cart (floating cart di pojok kanan).
5. Checkout → Isi alamat pengiriman + pilih ekspedisi.
6. Membayar via QRIS/Midtrans.
7. Order terkonfirmasi → Halaman tracking pesanan.

---

## 2. Arsitektur Data (Backend & Database - Anggota 3)
Kita akan menggunakan **Supabase (PostgreSQL)** karena kemudahan *Auth* dan respon databasenya yang superior.

### Skema Database Sederhana (ERD Dasar):
Kita akan membutuhkan 5 tabel utama:

1. **`users`**
   - Diatur otomatis oleh Supabase Auth. Menyimpan Email, Nama, dan ID User.
2. **`products`**
   - Menyimpan *Katalog Produk*: \`id\`, \`name\`, \`description\`, \`price\`, \`image_url\`, \`category\`, \`weight_gram\`, \`stock_qty\`.
3. **`cart_items`**
   - Menyimpan item keranjang belanja user.
   - Kolom: \`user_id\`, \`product_id\`, \`quantity\`.
4. **`orders`**
   - Rekaman transaksi yang di-trigger oleh Webhook Midtrans.
   - Kolom: \`order_id\`, \`user_id\`, \`total_price\`, \`shipping_address\`, \`payment_status\` (pending/success), \`shipping_status\` (processing/shipped/delivered).
5. **`order_items`**
   - Detail item per pesanan.
   - Kolom: \`order_id\`, \`product_id\`, \`quantity\`, \`price_at_purchase\`.

### Logika Pemesanan:
Ketika Midtrans mengirim notifikasi **"Success"** (Pembayaran Lunas) → Server Next.js mengubah \`payment_status\` di tabel `orders` → Stok produk di tabel `products` dikurangi sesuai qty → Email konfirmasi dikirim ke user → Status berubah ke "processing" (siap dikirim).
