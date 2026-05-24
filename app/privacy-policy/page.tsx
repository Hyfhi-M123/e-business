"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, FileText, Fingerprint, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-6 py-32 md:py-40">
        <div className="mb-12">
          <div className="w-16 h-16 bg-emerald-500/10 flex items-center justify-center rounded-2xl mb-6">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-[#6C757D] dark:text-neutral-400 font-mono text-sm tracking-widest uppercase">Pembaruan Terakhir: 14 Mei 2026</p>
        </div>

        <div className="space-y-12 text-[#495057] dark:text-neutral-300 leading-relaxed text-sm md:text-base">
          
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-emerald-500"></span> 1. Pengumpulan Data
            </h2>
            <p className="mb-4">
              Privasi Anda di ranah digital adalah prioritas taktis kami di PT TrailForge Indonesia. Kami mengumpulkan data yang secara sadar Anda berikan kepada kami saat Anda membuat akun, melakukan pemesanan (nama, alamat, nomor telepon), atau menghubungi kami.
            </p>
            <p>
              Kami juga mengumpulkan data non-personal seperti alamat IP, jenis browser, dan riwayat navigasi di situs kami untuk keperluan optimasi pengalaman pengguna (UX) dan deteksi anomali/keamanan server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-emerald-500"></span> 2. Penggunaan Data Terintegrasi
            </h2>
            <p className="mb-4">
              Data yang dikumpulkan digunakan semata-mata untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Memproses pesanan dan mengelola pengiriman (terintegrasi dengan API Biteship).</li>
              <li>Mendeteksi dan mencegah potensi tindak penipuan (Fraud Prevention) pada gateway pembayaran (terintegrasi dengan Midtrans).</li>
              <li>Personalisasi antarmuka untuk pengalaman belanja yang lebih "Cyber/Techwear".</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-emerald-500"></span> 3. Keamanan Tingkat Tinggi (Database Security)
            </h2>
            <p className="mb-4">
              Seluruh data personal dan kredensial autentikasi disimpan menggunakan protokol keamanan tingkat lanjut. Kami menggunakan Supabase dengan konfigurasi <strong>Row Level Security (RLS)</strong> yang ketat, memastikan bahwa data pengguna (seperti keranjang belanja, alamat, dan riwayat pesanan) terenkripsi dan tidak dapat diakses oleh pihak yang tidak berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-emerald-500"></span> 4. Cookies & Pelacakan
            </h2>
            <p className="mb-4">
              Kami menggunakan "Cookies" dan alat manajemen status klien (seperti Local Storage / Session Storage) untuk melacak sesi login, preferensi tema layar (Dark Mode), serta status keranjang belanja sementara sebelum *checkout*. Anda dapat mengatur browser Anda untuk menolak cookie, namun hal tersebut dapat mengurangi fungsionalitas inti web ini.
            </p>
          </section>

          <div className="p-6 bg-[#212529] dark:bg-neutral-900 border border-emerald-500/20 rounded-2xl flex gap-4 items-start">
            <Fingerprint className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <p className="text-sm text-neutral-300">
              Permintaan penghapusan data secara permanen (*Right to be Forgotten*) dari database Supabase kami dapat diajukan dengan menghubungi <span className="text-emerald-500 font-bold">privacy@trailforge.id</span>.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
