#  معم Riset UI/UX & Arsitektur Data

## 1. Riset Referensi UI/UX
Pendekatan visual yang akan kita tiru/inspirasi:
1. **Linear.app**: Untuk penggunaan Dark Mode yang sempurna, efek glow halus di belakang cursor, dan tipografi Sans-serif yang rapi (Inter).
2. **Vercel.com**: Untuk struktur komponen card yang sangat bersih dan penggunaan border mikroskopik (`border-white/10`).
3. **Apple**: Untuk animasi transisi antar modul (menggunakan Framer Motion `layoutId`).

## 2. Arsitektur Data (Database - Supabase)
Struktur ERD ringan tahap pertama:

- **Tabel `users`**:
  - `id` (UUID)
  - `email` (String)
  - `role` (Enum: 'buyer', 'creator', 'admin')
  - `created_at` (Timestamp)

- **Tabel `products`**:
  - `id` (UUID)
  - `title` (String)
  - `description` (Text)
  - `price` (Decimal)
  - `cover_image` (URL)
  - `file_url` (URL)
  - `creator_id` (UUID - Relasi ke `users`)

- **Tabel `transactions`**:
  - `id` (UUID)
  - `product_id` (UUID)
  - `buyer_id` (UUID)
  - `amount` (Decimal)
  - `status` (Enum: 'pending', 'success', 'failed')

## 3. Tech Stack Utama
- **Frontend**: Next.js 14+ (App Router), React, TypeScript.
- **Styling**: Tailwind CSS, class-variance-authority (CVA) untuk standardisasi varian tombol.
- **Animasi**: Framer Motion.
- **Backend/DB**: Supabase (PostgreSQL), Supabase Auth.
- **Pembayaran** *(akan datang)*: Midtrans (Indonesia) atau Xendit.
