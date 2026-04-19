# 📝 Log Aktivitas Proyek

Dokumen ini mencatat setiap langkah yang dilakukan oleh tim (Manusia & Antigravity).

---

### [2026-04-12] - Inisialisasi Proyek (Minggu 1)
- **Pelaku**: Antigravity (User Utama)
- **Tindakan**:
    - [x] Inisialisasi Project Next.js + Tailwind + Framer Motion.
    - [x] Setup struktur "Page-Centric" sederhana di folder `app/`.
    - [x] Pembuatan Landing Page Hero dengan demo animasi Morphing.
    - [x] Sinkronisasi GitHub pertama kali ke repository `Hyfhi-M123/e-business`.
    - [x] Pembuatan file panduan Tim & SOP Antigravity.
- **Catatan**: Proyek siap dikloning oleh anggota tim lain. Struktur folder flat tanpa folder `src`.

### [2026-04-12] - Pekerjaan Minggu 1: Ideasi, BMC, & Riset Arsitektur
- **Pelaku**: Antigravity
- **Tindakan**:
    - [x] Membuat folder `Minggu_1` dan mengisi dokumen Ideasi & Branding (`1_ide_dan_branding.md`).
    - [x] Membuat Business Model Canvas (BMC) dan Analisis Kompetitor (`2_bmc_dan_kompetitor.md`).
    - [x] Merangkum Riset referensi UI/UX dan merancang skema awal Arsitektur Database Supabase (`3_riset_uiux_arsitektur.md`).
- **Catatan**: Fokus Minggu 1 secara dokumentasi sudah terselesaikan 100%. Project siap dilanjutkan ke Minggu 2 (Inisialisasi teknis tambahan & Setup DB).

### [2026-04-12] - 🔄 PIVOT TEMA: Produk Digital → Adventure Tools
- **Pelaku**: Antigravity (atas permintaan User)
- **Tindakan**:
    - [x] **Rebranding Total**: Dari "Aura Digital" (produk digital) → **"TrailForge"** (peralatan adventure & outdoor).
    - [x] **Tagline baru**: "Gear Up. Go Wild."
    - [x] **Palet warna baru**: Forest Green (`#2d6a4f`) + Amber/Campfire (`#f59e0b`) + Deep Earth (`#1a1a2e`).
    - [x] Update `1_ide_branding.md` — Katalog produk jadi: Tenda, Sleeping Pad, Pisau, Headlamp, Kompor, dll.
    - [x] Update `2_bmc_kompetitor.md` — BMC disesuaikan (physical goods, margin, fulfillment). Kompetitor baru: Toko fisik, Tokped/Shopee, REI/Decathlon.
    - [x] Update `3_arsitektur_uiux.md` — Arsitektur DB disesuaikan untuk produk fisik (stok, keranjang, order items, shipping).
    - [x] Update `4_prompt_master_ai.md` — Master Context Prompt untuk TrailForge.
    - [x] Update `ppt_text.txt` — Seluruh konten slide presentasi disesuaikan.
    - [x] Update `project_plan.md` — Rencana strategis disesuaikan untuk adventure tools marketplace.
    - [x] Update `INSTRUKSI_ANTIGRAVITY.md` — SOP estetika baru (Earthy Premium, Parallax).
    - [x] Update `tailwind.config.ts` — Warna baru (earth, primary, accent).
    - [x] Update `globals.css` — Background mesh bernuansa hutan/alam, glass effect earth tone.
    - [x] Update `layout.tsx` — Metadata TrailForge.
    - [x] Update `page.tsx` — Landing page bertema outdoor (ikon Tent/Compass/Flame, produk outdoor, section "Kenapa TrailForge").
### [2026-04-13] - Persiapan & Arsitektur Teknis (Minggu 2)
- **Pelaku**: Antigravity
- **Tindakan**:
    - [x] Sinkronisasi ulang dengan repository GitHub (`git fetch` & `reset --hard`) untuk memastikan data terbaru.
    - [x] Instalasi ulang dependensi (`npm install`) untuk konsistensi lingkungan.
    - [x] Pembuatan folder `Minggu_2` untuk menampung seluruh progres teknis dan bisnis minggu ini.
    - [x] Pembuatan dokumen detail rencana kerja per anggota (`RENCANA_KERJA.md`) di folder `Minggu_2`.
- **Catatan**: Folder struktur siap digunakan. Progres teknis selanjutnya adalah setup mandiri Supabase dan refinement folder app.

### [2026-04-19] - Eksekusi Blueprint Minggu 2 (Tim Inti)
- **Pelaku**: Antigravity
- **Tindakan**:
    - [x] **Anggota 1**: Membuat `SWOT_Analysis.md` dan `User_Journey.md` di dalam folder `Minggu_2/Bisnis/`.
    - [x] **Anggota 2**: Standarisasi `tailwind.config.ts`, membuat kerangka rute Page-Centric (`app/katalog/page.tsx` & `app/login/page.tsx`).
    - [x] **Anggota 3**: Instalasi `@supabase/supabase-js`, pembuatan `utils/supabase/client.ts`, `.env.local.example`, serta rancangan `ERD_Database.md`.
- **Catatan**: Seluruh fondasi dasar proyek untuk Minggu 2 telah terpasang di repository lokal. Siap untuk push.
