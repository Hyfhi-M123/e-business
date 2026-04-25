"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Compass, ShoppingBag, Search, Menu, ArrowRight, ArrowUpRight, ChevronDown, MountainSnow, Wind, Crosshair, Map, ThermometerSnowflake } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // LOGIKA SCROLL-SYNC CINEMATIC
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"] 
  });
  
  const smoothProgress = useSpring(scrollYProgress, { damping: 25, stiffness: 100, mass: 0.5 });

  // Animasi Background Gunung
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.3]);
  const bgFilter = useTransform(smoothProgress, [0.6, 1], ["brightness(0.7) blur(0px)", "brightness(0.2) blur(10px)"]);
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  
  // Animasi HUD (Head-Up Display)
  const hudOpacity = useTransform(smoothProgress, [0, 0.05], [0.3, 1]);

  // Animasi Teks Tiap Lapisan
  const layer1Opacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const layer1Y = useTransform(smoothProgress, [0, 0.15], [0, -150]);

  const layer2Opacity = useTransform(smoothProgress, [0.15, 0.25, 0.45, 0.55], [0, 1, 1, 0]);
  const layer2Y = useTransform(smoothProgress, [0.15, 0.3, 0.45, 0.55], [150, 0, 0, -150]);
  const card1X = useTransform(smoothProgress, [0.15, 0.3], [100, 0]);

  const layer3Opacity = useTransform(smoothProgress, [0.45, 0.55, 0.75, 0.85], [0, 1, 1, 0]);
  const layer3Y = useTransform(smoothProgress, [0.45, 0.55, 0.75, 0.85], [150, 0, 0, -150]);
  const card2X = useTransform(smoothProgress, [0.45, 0.55], [-100, 0]);

  return (
    <main className="bg-neutral-950 text-white font-sans selection:bg-orange-500 selection:text-white">
      
      {/* HUD (HEAD-UP DISPLAY) - ORNAMENT TEKNOLOGI YANG MENEMPEL PERMANEN */}
      <motion.div style={{ opacity: hudOpacity }} className="fixed inset-0 pointer-events-none z-[50] flex flex-col justify-between py-24 px-8 mix-blend-overlay">
        <div className="flex justify-between items-start w-full border-t border-white/20 pt-2">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">ELEV: 8,848M<br/>TEMP: -41°C</span>
          <Crosshair className="w-6 h-6 animate-[spin_10s_linear_infinite] opacity-50" />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-right">LAT: 27°59'17"N<br/>LON: 86°55'31"E</span>
        </div>
        <div className="flex justify-between items-end w-full border-b border-white/20 pb-2">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">SYS: ONLINE</span>
          <div className="w-1/3 h-px bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/4 bg-white/60 animate-[slide_2s_ease-in-out_infinite_alternate]" />
          </div>
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-right">O2: 33% (CRIT)</span>
        </div>
      </motion.div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm bg-neutral-950/20 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">TrailForge<span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-300">
          <a href="#" className="hover:text-white transition-colors relative group">Katalog <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span></a>
          <a href="#" className="hover:text-white transition-colors relative group">Ekspedisi <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span></a>
          <a href="#" className="hover:text-white transition-colors relative group">Teknologi <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span></a>
        </div>

        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-white cursor-pointer hover:text-orange-500 transition-colors" />
          <div className="relative cursor-pointer group flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-white group-hover:text-orange-500 transition-colors" />
            <span className="hidden md:block text-[10px] font-black tracking-widest uppercase">Cart (0)</span>
          </div>
        </div>
      </nav>

      {/* KONTINER UTAMA SCROLLING */}
      <div ref={containerRef} className="relative w-full h-[400vh]">
        
        {/* LAPISAN 0: BACKGROUND GUNUNG HD */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-neutral-950">
          <div className="absolute inset-0 z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
          <motion.img 
            style={{ scale: bgScale, filter: bgFilter, y: bgY }}
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80" 
            alt="Mountain Summit" 
            className="w-full h-full object-cover origin-bottom opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950 z-10" />
        </div>

        {/* LAPISAN FOREGROUND */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          
          {/* SCENE 0: HERO TITLE */}
          <motion.div 
            style={{ opacity: layer1Opacity, y: layer1Y }}
            className="h-screen flex flex-col items-center justify-center text-center mt-6 relative"
          >
            <div className="flex flex-col items-center">
              <div className="px-5 py-2 mb-8 border border-white/10 backdrop-blur-md bg-neutral-950/40 shadow-2xl flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Expedition Series
              </div>
              <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.8] mix-blend-screen text-white/90 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                ASCEND<br/>TO APEX.
              </h1>
              <p className="mt-8 text-neutral-300 md:text-xl font-bold uppercase tracking-[0.4em] max-w-lg mx-auto drop-shadow-md">
                Peralatan Ekspedisi Tanpa Kompromi.
              </p>
            </div>

            <motion.div 
              animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute bottom-16 flex flex-col items-center gap-4"
            >
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500">Engage Scroll</span>
            </motion.div>
          </motion.div>

          {/* SCENE 1: Cerita Fitur Kiri + Kartu Kaca Kanan */}
          <motion.div 
            style={{ opacity: layer2Opacity, y: layer2Y }}
            className="absolute top-[100vh] w-full h-screen flex items-center justify-between px-8 md:px-20 lg:px-32"
          >
            <div className="max-w-xl">
               <ThermometerSnowflake className="w-12 h-12 text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" />
               <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                 Suhu Titik<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200">Mati.</span>
               </h2>
               <p className="text-lg md:text-xl font-medium text-neutral-300 leading-relaxed max-w-md border-l-2 border-blue-400/50 pl-6">
                 Lapisan komposit Aerogel mengunci panas 37°C di dalam jaket Anda meski termometer alam menunjuk angka -40°C.
               </p>
            </div>

            {/* Kartu UI Glassmorphism Floating (Menambah Kepadatan Elemen) */}
            <motion.div style={{ x: card1X }} className="hidden lg:flex flex-col gap-4 max-w-xs pointer-events-auto">
              <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex justify-between">
                  <span>Modul Insulasi</span> <span>Active</span>
                </h4>
                <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-blue-400 w-[85%]" />
                </div>
                <p className="text-xs text-neutral-400 font-mono">Heat Retention: 85% Volumetric.</p>
              </div>
              <div className="bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 p-6 rounded-2xl shadow-2xl cursor-pointer hover:bg-orange-500/20 transition-colors">
                <h4 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-1">Eksplor Seri Termal</h4>
                <p className="text-xs text-orange-200">Lihat katalog jaket extreme cold.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* SCENE 2: Cerita Fitur Kanan + Kartu UI Kiri */}
          <motion.div 
            style={{ opacity: layer3Opacity, y: layer3Y }}
            className="absolute top-[200vh] w-full h-screen flex items-center justify-between px-8 md:px-20 lg:px-32 flex-row-reverse"
          >
            <div className="max-w-xl flex flex-col items-end text-right">
               <Wind className="w-12 h-12 text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
               <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                 Tanpa<br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-red-600">Ampun.</span>
               </h2>
               <p className="text-lg md:text-xl font-medium text-neutral-300 leading-relaxed max-w-md border-r-2 border-orange-500/50 pr-6">
                 Struktur nilon ballistic setara militer meredam robekan angin 120km/jam. Alam liar tidak punya belas kasihan, begitu juga desain kami.
               </p>
            </div>

            <motion.div style={{ x: card2X }} className="hidden lg:flex flex-col gap-4 max-w-sm pointer-events-auto">
               <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-neutral-950 z-0 opacity-50 group-hover:opacity-20 transition-opacity" />
                  <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80" className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-luminosity opacity-30 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8">Kajian Material</h4>
                    <span className="text-2xl font-black uppercase tracking-tight">Katalog Z-Shell</span>
                    <p className="text-xs text-neutral-400 mt-2 flex items-center gap-2">Baca Riset Selengkapnya <ArrowUpRight className="w-3 h-3"/></p>
                  </div>
               </div>
            </motion.div>
          </motion.div>

          {/* SCENE 3: Katalog Produk Bawah */}
          <div className="absolute top-[300vh] w-full h-screen flex flex-col justify-end pb-20 px-6 md:px-12 pointer-events-auto bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent">
             
             <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mb-2">Persiapan Ekspedisi</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter">Armory.</h3>
                </div>
                <Link href="/katalog" className="hidden md:flex text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-orange-500 transition-colors items-center gap-2 border border-white/20 px-6 py-3 rounded-full hover:border-orange-500">
                  Akses Seluruh Katalog <ArrowRight className="w-3 h-3" />
                </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div onClick={() => window.location.href='/produk/123'} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent z-10" />
                  <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                  <div className="absolute bottom-6 left-6 z-20 w-[80%]">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2 block">Kategori 01</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">Peralatan<br/>Panjat</h3>
                    <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-500 mb-3" />
                    <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-orange-500" /></p>
                  </div>
                </div>

                {/* Card 2 */}
                <div onClick={() => window.location.href='/produk/124'} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent z-10" />
                  <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                  <div className="absolute bottom-6 left-6 z-20 w-[80%]">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Kategori 02</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">Pakaian<br/>Termal</h3>
                    <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-500 mb-3" />
                    <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-blue-400" /></p>
                  </div>
                </div>

                {/* Card 3 */}
                <div onClick={() => window.location.href='/produk/125'} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent z-10" />
                  <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                  <div className="absolute bottom-6 left-6 z-20 w-[80%]">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2 block">Kategori 03</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">Jaket<br/>Badai</h3>
                    <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-500 mb-3" />
                    <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-rose-500" /></p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
