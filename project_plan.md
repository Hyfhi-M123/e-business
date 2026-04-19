# 🚀 Adventure Tools Marketplace: Rencana Strategis & Pembagian Tugas

Dokumen ini adalah panduan resmi proyek E-Commerce Peralatan Adventure & Outdoor yang berfokus pada estetika immersive, performa tinggi, dan pengalaman pengguna yang modern.

## 💎 Visi Estetika & UX
- **Gaya Visual**: *Earthy Premium* (Inspirasi: REI, Decathlon, The North Face website).
- **Karakter Desain**: Tipografi tegas, pemanfaatan ruang (white space) bernuansa alam, gradasi hijau-amber, dan efek kaca (*Glassmorphism*) bersentuhan earth tone.
- **Animasi Inti**: *Organic Transitions* & *Shared Element Morphing* menggunakan Framer Motion + efek Parallax gunung/hutan.
- **Kenyamanan**: Tetap fungsional dan intuitif (User-Friendly), sensasi petualangan tanpa berlebihan.

## 📂 Aturan Struktur Folder (Sederhana & Mandiri)
1. **Satu Folder per Halaman**: Setiap halaman (misal: Home, Login, Katalog, Detail Produk) memiliki foldernya sendiri di dalam folder `app/`.
2. **Kemandirian File**: Semua file yang berkaitan (Komponen kecil, CSS khusus, hingga API lokal) diletakkan di dalam folder halaman tersebut.
3. **Flat Structure**: Tidak menggunakan folder `src/` yang mendalam. Struktur dibuat "rata" agar navigasi file lebih cepat.
4. **Shared Folder**: Folder luar (seperti `/components`) hanya digunakan untuk hal-hal yang benar-benar dipakai oleh SEMUA halaman.

## 🛠️ Tech Stack Juara
- **Frontend**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS + Framer Motion.
- **Backend & Database**: Supabase (Auth, DB PostgreSQL, Storage).
- **Payment Gateway**: Midtrans / Xendit (Mode Sandbox).

## 👥 Struktur Tim & Peran Utama
- **Anggota 1**: Business Strategist (BMC, SWOT, Copywriting) & UI/UX Designer.
- **Anggota 2**: Frontend Developer & Animation Expert (Framer Motion).
- **Anggota 3**: Backend Developer, Database (Supabase), & Payment Integration.

---

## 📅 Siklus SDLC Agile Scrum: Rencana Sprints (Timeline 9 Minggu)

Kita menggunakan pendekatan **Agile Scrum** agar proyek lebih adaptif, modern, dan profesional. Pembagian tugas dipecah menjadi siklus-*Sprint* mingguan dengan target rilis kecil (*increment*) yang jelas.

### 🏃 Sprint 0: Product Discovery & Architecture Setup (Minggu 1 & 2)
*Fokus: Memantapkan fondasi bisnis (Tahap Analisis Kebutuhan) & Setup Kerangka*
- **Minggu 1 (Ideasi Bisnis)**: Pembuatan *Business Model Canvas (BMC)*, Analisis Kompetitor, kurasi ide produk, dan penentuan gaya visual (*Earthy Premium*). 
- **Minggu 2 (Inisialisasi Teknis)**: Pembuatan *Analisis SWOT*, *User Journey Diagram*, setup *Next.js (Page-Centric)*, *Tailwind CSS*, dan rancangan *ERD* awal menggunakan *Supabase Auth*.

### 🏃 Sprint 1: Design Language & UI Atom Components (Minggu 3)
*Fokus: Mengubah desain menjadi kode komponen bebas kutu (Reusable Components)*
- **Anggota 1**: Pembuatan *High-Fidelity Mockup* (Gaya Figma) bertema outdoor.
- **Anggota 2**: Pembuatan komponen atom (*Button, Input, ProductCard*) dengan integrasi animasi *Morphing (Framer Motion)*.
- **Anggota 3**: Uji coba unit *Auth* (Login/Daftar) langsung ke *Database* dan perbaikan *Middleware* rute pengguna.

### 🏃 Sprint 2: Core Discovery & Landing Page (Minggu 4)
*Fokus: Penyelesaian "Wajah Merek" TrailForge*
- **Anggota 1**: *Copywriting* penawaran bersensasi petualangan dan heroikal.
- **Anggota 2**: Menyelesaikan pergerakan mulus antarmuka pendaratan (*Landing Page*) lengkap dengan efek *Parallax/Scroll Animations*.
- **Anggota 3**: Menyeret *Data Model* Supabase agar Landing Page mengambil informasi produk teratas langsung dari *Server*.

### 🏃 Sprint 3: Product Catalog & Search Efficiency (Minggu 5)
*Fokus: Memberikan pengalaman pencarian gear termudah*
- **Anggota 1**: Pengumpulan/kurasi aset visual *gear* riil *(Asset Curation)*.
- **Anggota 2**: Mengawinkan filter UI komponen kategori (*Shelters, Tools*, dll) dengan grid dinamis.
- **Anggota 3**: Penulisan *Query/API* pencarian spesifik Supabase dengan waktu *Load* di bawah batas rasional.

### 🏃 Sprint 4: Cart System & State Management (Minggu 6)
*Fokus: Manajemen alur logistik barang*
- **Anggota 1**: Pembangunan UX konversi (*Checkout Experience*).
- **Anggota 2**: Pembuatan laci keranjang melayang (*floating cart window*) bebas kedip tanpa *reload*.
- **Anggota 3**: Logika kalkulator bayangan ongkir, potongan kurir, beserta kompilasi harga produk akhir.

### 🏃 Sprint 5: Payment Gateway Integration (Minggu 7)
*Fokus: Uang Masuk Otomatis*
- **Anggota 1**: *UX/UI Microcopy* instruksi QRIS / VA.
- **Anggota 2**: Adaptasi halaman perantara (*Midtrans/Xendit Sandbox Interface*).
- **Anggota 3**: *Webhook handler*, jika Midtrans berkata "Bayar Lunas", maka persediaan stok di tabel produk akan berkurang.

### 🏃 Sprint 6: User Dashboard & Tracking (Minggu 8)
*Fokus: Sistem pemeliharaan pengguna (Retention)*
- **Anggota 1**: Pengecekan alur notifikasi.
- **Anggota 2**: Pembuatan _UI Resi Pengiriman_ per *User*.
- **Anggota 3**: Inisialisasi Email Notifikasi kepada pelanggan ketika barang di-_update_ menuju fase "Dikirim".

### 🏃 Sprint 7: Release Readiness & Optimization (Minggu 9)
*Fokus: Memoles kekurangan dan Deploy publik*
- **Semua Anggota**: *QA (Quality Assurance)*, meredakan *bug* aplikasi (*UAT testing*).
- **Anggota 1**: Merampungkan Laporan Akhir & *Pitch Deck* Final.
- **Anggota 2 & 3**: Akselerasi metrik Core Web Vitals (*SEO Score, Lighthouse*), penyempurnaan _Environment Variables_, dan merilis TrailForge secara _Live_ di Vercel.

---
*Status: Tahap Sprint 0 (Minggu 2 - Architecture Setup) telah tercapai.*
