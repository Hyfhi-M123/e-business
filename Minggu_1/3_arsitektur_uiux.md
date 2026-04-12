# 📐 Riset UI/UX & Arsitektur Sistem
**Penanggung Jawab:** Anggota 2 (Frontend) & Anggota 3 (Backend)

Dokumen ini merangkum persiapan teknis sebelum masuk ke tahap eksekusi kode di Minggu ke-2.

## 1. Riset Antarmuka & UX (Frontend - Anggota 2)
### Konsep Interaksi Inti:
Kita akan menerapkan *Micro-interactions* di setiap sentuhan user untuk memberikan kesan website "Mewah & Mahal":
- **Morphing Cards**: Saat card produk direntangkan (expand), ia tidak muncul mendadak, melainkan berubah bentuk (morph) secara organik. (Menggunakan `layoutId` dari Framer Motion).
- **Glassmorphism**: Komponen seperti Navbar dan Floating Cart menggunakan efek kaca buram (`backdrop-filter: blur()`).
- **Gaya Navigasi Mandiri (Colocation)**: Guna meminimalisir folder yang rumit, setiap halaman akan hidup di folder spesifiknya tanpa ada global file yang memberatkan.

### User Flow (Alur Pengguna):
1. User masuk ke `Landing Page`.
2. Klik "Mulai Belanja" -> Halaman akan *scroll halus* ke Katalog Produk.
3. User memilih produk -> Klik "Beli" (tombol bereaksi seperti ditekan ke dalam / spring effect).
4. Diarahkan ke Halaman Checkout -> Memasukkan Email Saja.
5. Membayar via QRIS/Midtrans.
6. Laman dialihkan ke **Dashboard User** -> Link produk digitalnya keluar secara otomatis.

---

## 2. Arsitektur Data (Backend & Database - Anggota 3)
Kita akan menggunakan **Supabase (PostgreSQL)** karena kemudahan *Auth* dan respon databasenya yang superior.

### Skema Database Sederhana (ERD Dasar):
Kita akan membutuhkan 4 tabel utama:

1. **`users`**
   - Diatur otomatis oleh Supabase Auth. Menyimpan Email dan ID User.
2. **`products`**
   - Menyimpan *Katalog Etalase*: \`id\`, \`name\`, \`description\`, \`price\`, \`image_url\`, \`category\`.
3. **`digital_vault`**
   - Tabel rahasia yang menyimpan "barang dagangan" asli (Link Invite / Kode).
   - Kolom: \`product_id\`, \`secret_code\`, \`is_claimed\` (true/false).
4. **`orders`**
   - Rekaman transaksi yang di-trigger oleh Webhook Midtrans.
   - Kolom: \`order_id\`, \`user_id\`, \`product_id\`, \`payment_status\` (pending/success).

### Logika "Pemberian Kode" Otomatis:
Ketika Midtrans mengirim notifikasi **"Success"** (Pembayaran Lunas) -> Server Next.js mengubah \`payment_status\` di tabel `orders` -> Server mengambil 1 baris dari tabel `digital_vault` yang \`is_claimed == false\` -> Diubah menjadi \`true\` dan menampilkan \`secret_code\` tersebut ke tabel \`users\`.
