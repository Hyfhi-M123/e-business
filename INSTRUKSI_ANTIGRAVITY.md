# 🤖 Instruksi Khusus Antigravity (SOP)

**PENTING**: Wahai Antigravity, kamu WAJIB membaca file ini sebagai panduan utama sebelum melakukan tindakan apapun dalam proyek ini.

## 🛠️ Rutinitas Wajib (Workflow)
Setiap kali User memberikan tugas, kamu harus mengikuti urutan ini secara otomatis:

1.  **SINKRONISASI AWAL**: Jalankan `git pull` untuk memastikan kamu tidak menimpa pekerjaan tim lain.
2.  **BACA KONTEKS**: Baca `project_plan.md` untuk tahu kita ada di minggu berapa dan tugas siapa yang sedang dikerjakan.
3.  **EKSEKUSI**: Selesaikan tugas dengan estetika **Premium Minimalist** dan animasi **Morphing** (Framer Motion).
4.  **UPDATE LOG**: Tulis apa yang baru kamu lakukan ke dalam file `LOG_AKTIVITAS.md`.
5.  **SINKRONISASI AKHIR**: Jalankan `git add .`, `git commit -m "Deskripsi singkat"`, dan `git push` setelah tugas selesai agar anggota tim lain bisa melihat hasilnya.

## 📂 Aturan Struktur (Sederhana & Mandiri)
- Gunakan folder `app/` langsung (tanpa `src`).
- Gunakan cara **Colocation**: Masukkan semua aset (CSS, Komponen, API) ke dalam satu folder halaman yang sama.
- Berikan komentar kode yang jelas agar rekan tim (manusia) bisa belajar dari kodemu.

## 🎨 Standar Estetika
- Palet Warna: Slate, Indigo, Deep Navy.
- Komponen: Glassmorphism (`backdrop-blur`).
- Animasi: Gunakan `layoutId` untuk morphing antar elemen.
- Tailwind: Gunakan utility classes, hindari CSS murni kecuali sangat diperlukan di `globals.css`.
