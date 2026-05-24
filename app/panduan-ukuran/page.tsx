"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Shirt, Footprints, Backpack, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TABS = [
  { id: "pakaian", label: "Pakaian", icon: Shirt },
  { id: "sepatu", label: "Sepatu", icon: Footprints },
  { id: "tas", label: "Tas & Ransel", icon: Backpack },
];

const SIZE_DATA: Record<string, { headers: string[]; rows: string[][] }> = {
  pakaian: {
    headers: ["Ukuran", "Lebar Dada (cm)", "Panjang Badan (cm)", "Panjang Lengan (cm)", "Lebar Bahu (cm)"],
    rows: [
      ["S", "48", "66", "58", "42"],
      ["M", "51", "69", "60", "44"],
      ["L", "54", "72", "62", "46"],
      ["XL", "57", "75", "64", "48"],
      ["XXL", "60", "78", "66", "50"],
    ],
  },
  sepatu: {
    headers: ["EU", "US", "UK", "Panjang Kaki (cm)", "Rekomendasi"],
    rows: [
      ["38", "5.5", "5", "24", "Narrow Fit"],
      ["39", "6.5", "6", "24.5", "Standard"],
      ["40", "7", "6.5", "25", "Standard"],
      ["41", "8", "7.5", "26", "Standard"],
      ["42", "8.5", "8", "26.5", "Standard"],
      ["43", "9.5", "9", "27.5", "Standard"],
      ["44", "10.5", "10", "28.5", "Wide Fit"],
      ["45", "11", "10.5", "29", "Wide Fit"],
    ],
  },
  tas: {
    headers: ["Tipe", "Volume (L)", "Tinggi (cm)", "Lebar (cm)", "Rekomendasi Penggunaan"],
    rows: [
      ["Daypack", "15-25", "45", "28", "Harian / Urban"],
      ["Hiking Pack", "30-45", "55", "32", "Day Hike / Camping Ringan"],
      ["Expedition", "50-70", "68", "36", "Multi-Day Trek"],
      ["Ultra-Light", "10-20", "42", "25", "Trail Running / Fast Hike"],
    ],
  },
};

const TIPS = [
  { title: "Cara Mengukur Dada", desc: "Lingkarkan pita ukur di bawah ketiak, melewati bagian terlebar dada. Jangan terlalu ketat." },
  { title: "Cara Mengukur Kaki", desc: "Ukur dari ujung tumit ke ujung jari terpanjang saat berdiri. Ukur di sore hari saat kaki sedikit membesar." },
  { title: "Tips Memilih Ukuran", desc: "Jika berada di antara dua ukuran, pilih ukuran yang lebih besar terutama untuk gear outdoor." },
];

export default function PanduanUkuranPage() {
  const [activeTab, setActiveTab] = useState("pakaian");
  const data = SIZE_DATA[activeTab];

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white transition-colors">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/katalog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] hover:text-[#F77F00] transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Kembali ke Katalog
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F77F00]/10 rounded-xl flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#F77F00]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Panduan Ukuran</h1>
          </div>
          <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 max-w-xl leading-relaxed">
            Referensi ukuran standar TrailForge untuk memastikan gear yang kamu pilih fit dengan sempurna di setiap medan.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#F77F00] text-white shadow-[0_8px_24px_rgba(247,127,0,0.3)]"
                  : "bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#6C757D] hover:border-[#F77F00]/50 hover:text-[#F77F00]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 dark:bg-[#111111]/80 backdrop-blur-2xl border border-black/10 dark:border-white/5 rounded-3xl overflow-hidden mb-12"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    {data.headers.map((h, i) => (
                      <th key={i} className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-[0.2em] text-[#F77F00]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-[#F77F00]/5 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-6 py-4 text-sm font-mono ${
                            cIdx === 0 ? "font-black text-[#212529] dark:text-white text-base" : "text-[#6C757D] dark:text-neutral-400"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F77F00] rounded-full"></span> Tips Pengukuran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIPS.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-2xl p-6 hover:border-[#F77F00]/30 transition-colors group"
              >
                <div className="w-8 h-8 bg-[#F77F00]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#F77F00]/20 transition-colors">
                  <span className="text-sm font-black text-[#F77F00]">{idx + 1}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#212529] dark:text-white mb-2">{tip.title}</h3>
                <p className="text-xs font-mono text-[#6C757D] dark:text-neutral-400 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-3xl p-10">
          <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 mb-4">
            Masih ragu dengan ukuranmu? Tim kami siap membantu.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F77F00] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors shadow-[0_10px_30px_rgba(247,127,0,0.3)]"
          >
            Tanya Chat Assistant
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
