"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Crosshair, MapPin, Anchor, Flame, Wind, Activity, Zap, Terminal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TentangKamiPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero / Operational Briefing */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(247,127,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(247,127,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 bg-[#F77F00]/10 text-[#F77F00] border border-[#F77F00]/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6">
              <Terminal className="w-3 h-3" /> DECLASSIFIED DOCUMENT
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Forged <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F77F00] to-orange-400">For The</span> <br/>
              Unforgiving.
            </h1>
            <p className="text-sm md:text-base font-mono text-[#6C757D] dark:text-neutral-400 max-w-xl leading-relaxed">
              TrailForge bukanlah sekadar merek pakaian. Ini adalah perlengkapan taktis untuk mereka yang menolak kompromi. Dirancang di persimpangan antara estetika *cyberpunk* dan ketahanan militer.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="w-full aspect-square relative bg-[#050505] border border-white/10 dark:border-white/5 overflow-hidden flex items-center justify-center group rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* CRT Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-20 mix-blend-overlay"></div>

              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(247,127,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(247,127,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* Axis Lines (Crosshairs) */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#F77F00]/20"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#F77F00]/20"></div>
              </div>

              {/* Concentric Distance Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] aspect-square rounded-full border border-[#F77F00]/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full border border-[#F77F00]/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full border border-[#F77F00]/5 border-dashed"></div>

              {/* Real Radar Sweep Gradient */}
              <div className="absolute inset-0 z-10 animate-[spin_3s_linear_infinite] rounded-full" style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(247,127,0,0.1) 350deg, rgba(247,127,0,0.8) 360deg)' }}></div>

              {/* Random Target Blips */}
              <div className="absolute top-[35%] left-[65%] w-2 h-2 bg-[#F77F00] rounded-full z-10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.8s' }}></div>
              <div className="absolute top-[65%] left-[25%] w-1.5 h-1.5 bg-[#F77F00] rounded-full z-10 animate-ping" style={{ animationDuration: '3s', animationDelay: '2.2s' }}></div>
              <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-[#F77F00] rounded-full z-10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>

              {/* Central Glowing Hub */}
              <div className="relative z-20 w-28 h-28 bg-[#0a0a0a] flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(247,127,0,0.4)] ring-1 ring-[#F77F00]/30">
                <div className="absolute inset-0 rounded-full border border-[#F77F00]/40 animate-ping" style={{ animationDuration: '2s' }}></div>
                <Crosshair className="w-12 h-12 text-[#F77F00] drop-shadow-[0_0_12px_rgba(247,127,0,1)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manifesto / Directives */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Core Directives</h2>
            <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-[#121212] border-2 border-black/10 dark:border-white/10 p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F77F00]/5 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <Activity className="w-10 h-10 text-[#F77F00] mb-6 relative z-10" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Misi (Parameters)</h3>
              <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 leading-relaxed relative z-10">
                Menyediakan perlengkapan *Techwear* dan *Tactical* dengan daya tahan maksimal tanpa mengorbankan mobilitas. Setiap jahitan, setiap ritsleting, dan setiap material diuji untuk bertahan di lingkungan paling ekstrem, dari hutan belantara hingga hutan beton perkotaan.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#212529] text-white dark:bg-white dark:text-black border-2 border-transparent p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 dark:bg-black/5 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <Zap className="w-10 h-10 text-[#F77F00] mb-6 relative z-10" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Visi (Endgame)</h3>
              <p className="text-sm font-mono text-neutral-400 dark:text-[#6C757D] leading-relaxed relative z-10">
                Menjadi anomali di industri *fashion*. Kami tidak mengikuti tren; kami mempersiapkan Anda untuk apa pun yang akan datang. TrailForge bertujuan menjadi standar emas global untuk *utilitarian apparel* yang mengutamakan fungsi di atas bentuk.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Gear Philosophy */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#F77F00] font-mono text-xs tracking-widest uppercase mb-2 block">Material Science</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Anatomi Perlengkapan Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white/10 p-8 flex flex-col items-center text-center hover:border-[#F77F00] transition-colors">
              <ShieldCheck className="w-12 h-12 text-[#F77F00] mb-6" />
              <h4 className="text-xl font-black uppercase tracking-widest mb-3">Ballistic Resistance</h4>
              <p className="text-xs font-mono text-neutral-400">Material Kevlar-weave dan ripstop nilon memastikan pakaian tidak akan robek bahkan saat bergesekan dengan aspal atau batu tajam.</p>
            </div>
            <div className="border border-white/10 p-8 flex flex-col items-center text-center hover:border-[#F77F00] transition-colors">
              <Wind className="w-12 h-12 text-[#F77F00] mb-6" />
              <h4 className="text-xl font-black uppercase tracking-widest mb-3">Climate Adaptation</h4>
              <p className="text-xs font-mono text-neutral-400">Teknologi membran mikro-pori memungkinkan sirkulasi udara optimal sekaligus memblokir penetrasi air dan angin badai.</p>
            </div>
            <div className="border border-white/10 p-8 flex flex-col items-center text-center hover:border-[#F77F00] transition-colors">
              <Anchor className="w-12 h-12 text-[#F77F00] mb-6" />
              <h4 className="text-xl font-black uppercase tracking-widest mb-3">Tactical Utility</h4>
              <p className="text-xs font-mono text-neutral-400">Sistem kompartemen modular. Sembunyikan dan amankan perangkat komunikasi, alat pertahanan diri, hingga suplai darurat dengan presisi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Command Center / Contact */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-10 md:p-20 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 opacity-5">
            <Flame className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 justify-between">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Establish Commlink</h2>
              <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 mb-8">
                Saluran komunikasi kami selalu terbuka. Baik untuk negosiasi suplai logistik besar, pelaporan cacat material, atau pertanyaan intelijen mengenai rilis produk selanjutnya.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F77F00] text-white flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#6C757D]">Koordinat Markas (HQ)</span>
                    <span className="block font-mono text-sm">SCBD Tower 4, Lantai 42, Jakarta Selatan</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#212529] text-white dark:bg-white dark:text-black flex items-center justify-center">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#6C757D]">Enkripsi Email</span>
                    <span className="block font-mono text-sm">dispatch@trailforge.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#f8f9fa] dark:bg-[#1a1a1a] p-8 border border-black/10 dark:border-white/10">
              <h3 className="font-black uppercase tracking-widest mb-6">Transmisi Pesan</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Kode Panggilan (Nama)" className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors" />
                <input type="email" placeholder="Saluran Balik (Email)" className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors" />
                <textarea placeholder="Isi Transmisi..." rows={4} className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors resize-none"></textarea>
                <button type="button" className="w-full bg-[#F77F00] text-white font-black uppercase tracking-widest text-xs py-4 hover:bg-[#e06f00] transition-colors">
                  Kirim Transmisi
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
