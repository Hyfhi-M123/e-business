"use client";

import { motion } from "framer-motion";
import { Compass, Mountain, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Animasi Elemen Alam (Deep Green Glow) di Latar Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[150px]">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
            borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 60%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[500px] h-[500px] bg-emerald-900/40"
        />
      </div>

      {/* Konten Hero TrailForge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-emerald-400 font-medium tracking-wide">
          <Mountain size={16} />
          <span>PROVEN IN THE WILD. BUILT FOR YOU.</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-emerald-800 uppercase leading-[0.9]">
          Gear Up.<br />Go Wild.
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Temukan peralatan outdoor kelas dunia yang dikurasi khusus untuk ekspedisi paling menantang. Tangguh, ringan, dan siap menemani perjalananmu.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all text-lg"
          >
            Jelajahi Gear <ArrowRight size={20} />
          </motion.button>
          
          <button className="px-10 py-5 glass rounded-2xl font-bold hover:bg-white/5 transition-all text-lg border border-white/10">
            Panduan Survival
          </button>
        </div>
      </motion.div>

      {/* Fitur Utama (Adventure Specs) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
      >
        {[
          { 
            title: "Tough Tested", 
            desc: "Setiap alat telah diuji di kondisi ekstrem pegunungan tinggi.",
            icon: <ShieldCheck size={28} />
          },
          { 
            title: "Ultralight", 
            desc: "Material aero-grade yang meminimalisir beban di punggungmu.",
            icon: <Zap size={28} />
          },
          { 
            title: "Precision Navigation", 
            desc: "Akurasi tanpa batas untuk memastikan kamu tidak pernah tersesat.",
            icon: <Compass size={28} />
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -12, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            className="p-8 glass rounded-[32px] text-left group cursor-pointer transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 mb-6 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              {item.icon}
            </div>
            <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
