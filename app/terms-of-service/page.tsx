"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck, Scale, FileText, Lock } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-6 py-32 md:py-40">
        <div className="mb-12">
          <div className="w-16 h-16 bg-[#F77F00]/10 flex items-center justify-center rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-[#F77F00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-[#6C757D] dark:text-neutral-400 font-mono text-sm tracking-widest uppercase">Pembaruan Terakhir: 14 Mei 2026</p>
        </div>

        <div className="space-y-12 text-[#495057] dark:text-neutral-300 leading-relaxed text-sm md:text-base">
          
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-[#F77F00]"></span> 1. Ketentuan Umum
            </h2>
            <p className="mb-4">
              Selamat datang di situs resmi PT TrailForge Indonesia. Dengan mengakses, menelusuri, atau melakukan pembelian di situs web kami, Anda secara tegas menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda dilarang menggunakan layanan kami.
            </p>
            <p>
              Kami berhak untuk memperbarui, mengubah, atau mengganti bagian apa pun dari Ketentuan Layanan ini dengan mengunggah pembaruan pada halaman ini. Anda bertanggung jawab untuk memeriksa halaman ini secara berkala.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-[#F77F00]"></span> 2. Produk & Harga
            </h2>
            <p className="mb-4">
              Semua deskripsi perlengkapan ekspedisi (*gear*), spesifikasi, dan harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Kami berusaha semaksimal mungkin untuk menampilkan warna dan gambar produk seakurat mungkin, namun kami tidak menjamin tampilan layar perangkat Anda akan 100% akurat.
            </p>
            <p>
              Kami berhak untuk membatasi jumlah penjualan produk atau layanan kami kepada individu atau wilayah geografis mana pun.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-[#F77F00]"></span> 3. Ekspedisi & Pengiriman
            </h2>
            <p className="mb-4">
              Biaya pengiriman (*ongkir*) dikalkulasi secara otomatis menggunakan integrasi pihak ketiga (Biteship). Waktu transit yang ditampilkan hanyalah estimasi dan dapat berubah akibat kondisi cuaca ekstrem, medan ekspedisi, atau kendala logistik.
            </p>
            <p>
              PT TrailForge Indonesia tidak bertanggung jawab atas keterlambatan, kerusakan, atau kehilangan paket setelah paket tersebut diserahkan secara resmi kepada mitra logistik/kurir (JNE, SiCepat, dll). Namun, kami akan membantu memfasilitasi klaim asuransi jika pelanggan memilih opsi perlindungan tambahan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4 flex items-center gap-3">
              <span className="w-6 h-1 bg-[#F77F00]"></span> 4. Garansi Intelektual
            </h2>
            <p className="mb-4">
              Semua konten yang ada pada platform ini—termasuk logo, grafik, teks, desain sirkuit antarmuka, dan arsitektur perangkat lunak—adalah properti intelektual milik PT TrailForge Indonesia. Dilarang keras mereproduksi, mendistribusikan, atau mengeksploitasi konten tersebut untuk tujuan komersial tanpa izin tertulis dari pihak kami.
            </p>
          </section>

          <div className="p-6 bg-[#212529] dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-2xl flex gap-4 items-start">
            <ShieldCheck className="w-6 h-6 text-[#F77F00] flex-shrink-0" />
            <p className="text-sm text-neutral-300">
              Pertanyaan mengenai Ketentuan Layanan dapat langsung dikirimkan kepada kami di <span className="text-[#F77F00] font-bold">legal@trailforge.id</span> atau melalui jalur komunikasi darurat Basecamp.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
