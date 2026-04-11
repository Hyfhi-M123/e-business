# 🚀 Marketplace Produk Digital: Rencana Strategis & Pembagian Tugas

Dokumen ini adalah panduan resmi proyek E-Commerce Produk Digital yang berfokus pada estetika mewah, performa tinggi, dan pengalaman pengguna yang modern.

## 💎 Visi Estetika & UX
- **Gaya Visual**: *Premium Minimalist* (Inspirasi: Apple, Stripe, Linear).
- **Karakter Desain**: Tipografi bersih, pemanfaatan ruang (white space), gradasi halus, dan efek kaca (*Glassmorphism*).
- **Animasi Inti**: *Organic Transitions* & *Shared Element Morphing* menggunakan Framer Motion.
- **Kenyamanan**: Tetap fungsional dan intuitif (User-Friendly), tidak berlebihan.

## 📂 Aturan Struktur Folder (Sederhana & Mandiri)
Agar mempermudah tim (terutama bagi yang baru belajar), kita menggunakan metode **Page-Centric Colocation**:
1. **Satu Folder per Halaman**: Setiap halaman (misal: Home, Login, Produk) memiliki foldernya sendiri di dalam folder `app/`.
2. **Kemandirian File**: Semua file yang berkaitan (Komponen kecil, CSS khusus, hingga API lokal) diletakkan di dalam folder halaman tersebut.
3. **Flat Structure**: Tidak menggunakan folder `src/` yang mendalam. Struktur dibuat "rata" agar navigasi file lebih cepat.
4. **Shared Folder**: Folder luar hanya digunakan untuk hal-hal yang benar-benar dipakai oleh SEMUA halaman (seperti Navbar atau konfigurasi Database).

## 🛠️ Tech Stack Juara
- **Frontend**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS + Framer Motion (Advanced Animations).
- **Backend & Database**: Supabase (Auth, DB PostgreSQL, Storage).
- **Payment Gateway**: Midtrans / Xendit (Mode Sandbox).
- **Deployment**: Vercel.

## 👥 Pembagian Tugas Kelompok (3 Anggota)
- **Anggota 1 (UI/UX & Documentation)**: Desainer visual, riset produk digital, pembuat konten, dan laporan kemajuan.
- **Anggota 2 (Frontend Developer)**: Ahli animasi (Framer Motion), implementasi UI, dan interaksi frontend.
- **Anggota 3 (Backend & Database)**: Arsitektur database, sistem autentikasi, integrasi payment, dan logika otomatisasi.

---

## 📅 Timeline & Milestone Mingguan

### Minggu 1: Fondasi & Kebutuhan Strategis (Sedang Berjalan)
- **Anggota 1**: Riset kompetitor produk digital dan penyusunan daftar produk.
- **Anggota 2**: Inisialisasi Proyek (Next.js), instalasi Framer Motion/Tailwind, dan setup tema global.
- **Anggota 3**: Konfigurasi Supabase Project dan perancangan skema database.

### Minggu 2: Design Language & Advanced UI Components
- **Anggota 1**: Pembuatan Mockup High-Fidelity dengan fokus pada transisi antar elemen.
- **Anggota 2**: Pembuatan komponen "Morphing" pertama (misal: tombol yang mekar menjadi detail produk).
- **Anggota 3**: Implementasi sistem Auth (Login Google/Email) via Supabase.

*(... Seterusnya sesuai rencana sebelumnya ...)*
