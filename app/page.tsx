"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Elemen Mewah Berputar & Morphing di Latar Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[120px]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[400px] h-[400px] bg-indigo-600/30"
        />
      </div>

      {/* Konten Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-indigo-300">
          <Sparkles size={16} />
          <span>The New Era of Digital Assets</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Kelola Produk Digital <br /> Lebih Berkelas.
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
          Dapatkan akses ke Canva Premium, ChatGPT, dan aset digital pilihan lainnya dengan sistem pengiriman instan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold flex items-center gap-2 transition-all hover:bg-indigo-50"
          >
            Mulai Belanja <ArrowRight size={20} />
          </motion.button>
          
          <button className="px-8 py-4 glass rounded-2xl font-semibold hover:bg-white/5 transition-all">
            Lihat Katalog
          </button>
        </div>
      </motion.div>

      {/* Section Produk Simpel (Grid Mewah) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          { name: "Canva Pro", price: "Rp 15k", tag: "Hot" },
          { name: "ChatGPT Plus", price: "Rp 50k", tag: "Smart" },
          { name: "YouTube Premium", price: "Rp 10k", tag: "Best" }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 glass rounded-3xl text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 mb-4 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1">{item.name}</h3>
            <p className="text-slate-400 text-sm mb-4">Akses premium legal & bergaransi.</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-indigo-400">{item.price}</span>
              <span className="text-[10px] px-2 py-1 glass rounded-md uppercase tracking-widest">{item.tag}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
