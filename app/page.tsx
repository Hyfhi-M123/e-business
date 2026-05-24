"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, ArrowRight, ArrowUpRight, MountainSnow, Crosshair, ShieldCheck, Truck, RefreshCcw, Lock, Star, ChevronDown, User, X } from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ALL_REVIEWS = [
  {
    text: "Timberline X-Coat Arctic menyelamatkan saya di suhu ekstrem. Benar-benar gear tanpa kompromi. Pelayanan dari TrailForge juga sangat profesional.",
    name: "Arya S.", role: "Pendaki Profesional", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80", productId: "102", rating: 5
  },
  {
    text: "Vertex Summit Tent sangat ringan tapi sanggup menahan badai Rinjani selama dua hari berturut-turut. Kualitas material sekelas brand internasional.",
    name: "Bima W.", role: "Pemandu Ekspedisi", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", productId: "101", rating: 5
  },
  {
    text: "Sepatu AeroStep Mountain Boot ini sangat nyaman. Kaki tidak lecet meskipun dipakai berhari-hari menembus hutan tropis. Wajib dibawa untuk pendakian panjang! Grip sol luar biasa menggigit di jalur basah berbatu, sangat direkomendasikan.",
    name: "Citra D.", role: "Solo Hiker", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", productId: "103", rating: 5
  },
  {
    text: "Lumayan bagus, tapi pengiriman agak lambat. Overall oke.",
    name: "Deni R.", role: "Casual Camper", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80", productId: "106", rating: 4
  },
  {
    text: "Mantap! Barang sesuai ekspektasi.",
    name: "Eka P.", role: "Hiker Pemula", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80", productId: "105", rating: 5
  },
  {
    text: "Tas Trailblazer 55L sangat membantu manajemen beban saat mendaki berhari-hari. Kompartemennya sangat pas dan ergonominya sangat menjaga punggung dari cedera. Saya bisa membawa tenda dan sleeping bag tanpa merasa berat sama sekali.",
    name: "Fajar T.", role: "Pemandu Ekspedisi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", productId: "110", rating: 5
  }
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loadingBestSellers, setLoadingBestSellers] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          // Sort by sold descending
          const sorted = data.sort((a, b) => {
            const soldA = a.sold || 0;
            const soldB = b.sold || 0;
            if (soldB !== soldA) {
              return soldB - soldA;
            }
            // Tie-breaker: Price descending
            return (b.price || 0) - (a.price || 0);
          });
          // Take top 3
          setBestSellers(sorted.slice(0, 3));
        }
      })
      .catch(err => console.error("Failed to load best sellers:", err))
      .finally(() => setLoadingBestSellers(false));
  }, []);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  
  // Advanced Parallax Effect
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "-5%"]);
  
  // Hero Parallax
  const heroTextY = useTransform(smoothProgress, [0, 0.2], ["0%", "150%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Pro-level Animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const popUpVariant = {
    hidden: { opacity: 0, y: 80, scale: 0.9, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 } 
    }
  };

  const textRevealVariant = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: "0%", 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <main className="text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] dark:bg-orange-500 selection:text-[#212529] dark:text-white relative min-h-screen overflow-x-hidden">
      
      {/* FIXED GLOBAL PARALLAX BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-[#F8F9FA] dark:bg-neutral-950 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-20" />
        <motion.img 
          style={{ y: backgroundY }}
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80" 
          alt="Mountain Summit" 
          className="w-full h-[110vh] object-cover object-center origin-top opacity-100 brightness-[0.85] dark:opacity-70 dark:brightness-[0.4] dark:grayscale-[40%]"
        />
        {/* Dynamic Overlay ensuring contrast everywhere */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 dark:from-neutral-950/10 dark:to-neutral-950/60 z-10 backdrop-blur-[1px]" />
      </div>

      <Navbar />

      {/* HERO SECTION (100VH) */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-center z-10">
        {/* HUD Elements */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none flex flex-col justify-between py-24 px-8 text-[#212529] dark:text-white"
        >
          <div className="flex justify-between items-start w-full border-t border-[#212529]/30 dark:border-white/20 pt-2">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase">ELEV: 8,848M<br/>TEMP: -41°C</span>
            <Crosshair className="w-6 h-6 animate-[spin_10s_linear_infinite] opacity-50" />
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-right">LAT: 27°59'17"N<br/>LON: 86°55'31"E</span>
          </div>
          <div className="flex justify-between items-end w-full border-b border-[#212529]/30 dark:border-white/20 pb-2">
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase">SYS: ONLINE</span>
            <div className="w-1/3 h-px bg-[#212529]/30 dark:bg-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/4 bg-[#212529]/60 dark:bg-white/60 animate-[slide_2s_ease-in-out_infinite_alternate]" />
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-right">O2: 33% (CRIT)</span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 flex flex-col items-center mt-12"
        >
          {/* a. LIVE EXPEDITION timbul (delay 0.2s) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="px-5 py-2 mb-8 border border-white/30 backdrop-blur-xl bg-white/40 dark:bg-black/40 shadow-2xl flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-full text-[#212529] dark:text-white"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Expedition Series
          </motion.div>
          
          <div className="overflow-hidden">
            {/* b. ASCEND naik dari bawah (delay 0.6s) */}
            <motion.h1 
              initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.85] text-[#212529] dark:text-white drop-shadow-2xl"
            >
              ASCEND
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            {/* c. TO APEX naik dari bawah setelah ASCEND (delay 0.9s) */}
            <motion.h1 
              initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.85] text-[#212529] dark:text-white drop-shadow-2xl"
            >
              TO APEX.
            </motion.h1>
          </div>

          {/* d. Subtitle swipe dari kiri ke kanan (delay 1.3s) dengan legibilitas tinggi */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            className="mt-8 relative flex items-center justify-center w-full"
          >
            {/* Soft halo/glow effect behind text for legibility without hard borders */}
            <div className="absolute w-[80%] max-w-xl h-[300%] bg-white/50 dark:bg-black/60 blur-[30px] rounded-full pointer-events-none" />
            <p className="relative z-10 text-black dark:text-white text-xs sm:text-sm md:text-lg font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-center px-4 drop-shadow-[0_0_15px_rgba(255,255,255,1)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
              Peralatan Ekspedisi Tanpa Kompromi.
            </p>
          </motion.div>
          
          {/* e. Mulai Penjelajahan timbul (delay 1.8s) */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
            <Link href="/katalog" className="mt-10 group relative flex items-center gap-4 bg-[#F77F00] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all hover:scale-110 shadow-[0_0_40px_rgba(247,127,0,0.4)] overflow-hidden">
              <span className="relative z-10 flex items-center gap-4">Mulai Penjelajahan <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* MAIN CONTENT AREA - GLASSMORPHISM */}
      <div className="relative z-20 w-full">
        
        {/* SECTION: TRUST SIGNALS */}
        <motion.section 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto px-4 md:px-8 py-8 mb-16"
        >
          <div className="bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] py-6 px-6 shadow-xl border border-white/50 dark:border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-black/10 dark:divide-white/10">
              {[
                { icon: ShieldCheck, title: "Garansi Seumur Hidup", desc: "Ketangguhan terjamin." },
                { icon: Truck, title: "Gratis Ongkir", desc: "Seluruh Nusantara." },
                { icon: RefreshCcw, title: "Pengembalian 7 Hari", desc: "Tidak puas? Uang kembali." },
                { icon: Lock, title: "Pembayaran Aman", desc: "Enkripsi bank standar." },
              ].map((item, i) => (
                <motion.div variants={popUpVariant} key={i} className="flex flex-row items-center justify-start lg:justify-center text-left group lg:px-4 gap-4">
                  <div className="bg-[#F77F00]/10 dark:bg-orange-500/10 p-3 rounded-full group-hover:scale-110 group-hover:bg-[#F77F00] dark:group-hover:bg-orange-500 group-hover:text-white text-[#F77F00] dark:text-orange-500 transition-all duration-300 shrink-0">
                    <item.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-[#212529] dark:text-white">{item.title}</h4>
                    <p className="text-[10px] text-[#6C757D] dark:text-neutral-400 font-medium mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* SECTION: KATEGORI / ARMORY */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-24"
        >
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-[#DEE2E6] dark:border-white/10">
            <div className="flex flex-col">
              <span className="text-[#F77F00] dark:text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mb-2">Persiapan Ekspedisi</span>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Armory.</h3>
            </div>
            <Link href="/katalog" className="hidden md:flex text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors items-center gap-2 border border-black/20 dark:border-white/20 px-6 py-3 rounded-full hover:border-orange-500 backdrop-blur-md">
              Akses Seluruh Katalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards */}
            <motion.div variants={popUpVariant}>
              <Link href="/katalog?category=Navigasi" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute bottom-8 left-8 z-20 w-[80%]">
                  <span className="text-[9px] font-black text-[#F77F00] dark:text-orange-500 uppercase tracking-widest mb-2 block">Kategori 01</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none text-white">Peralatan<br/>Panjat</h3>
                  <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-700 mb-4" />
                  <p className="text-[10px] text-white/70 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-[#F77F00]" /></p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={popUpVariant}>
              <Link href="/katalog?category=Pakaian" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute bottom-8 left-8 z-20 w-[80%]">
                  <span className="text-[9px] font-black text-[#40916C] dark:text-blue-400 uppercase tracking-widest mb-2 block">Kategori 02</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none text-white">Pakaian<br/>Termal</h3>
                  <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-700 mb-4" />
                  <p className="text-[10px] text-white/70 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-[#40916C]" /></p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={popUpVariant}>
              <Link href="/katalog?search=Jacket" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute bottom-8 left-8 z-20 w-[80%]">
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2 block">Kategori 03</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none text-white">Jaket<br/>Badai</h3>
                  <div className="w-0 h-px bg-white group-hover:w-full transition-all duration-700 mb-4" />
                  <p className="text-[10px] text-white/70 font-mono tracking-widest uppercase flex items-center gap-2">Initiate <ArrowUpRight className="w-3 h-3 text-rose-500" /></p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* INFINITE MARQUEE BANNER */}
        <div className="w-full overflow-hidden bg-[#F77F00] text-black py-4 -rotate-1 scale-[1.02] my-12 shadow-2xl z-30 relative border-y-4 border-black/20">
          <motion.div 
            animate={{ x: [0, -1500] }} 
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="flex whitespace-nowrap gap-8 text-2xl md:text-3xl font-black uppercase tracking-[0.2em]"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                ASCEND TO APEX <Crosshair className="w-8 h-8" /> PUSH LIMITS <Crosshair className="w-8 h-8" /> EXTREME GEAR
              </span>
            ))}
          </motion.div>
        </div>

        {/* SECTION: STEAL DEALS / FLASH SALE */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-6 md:px-12 mb-32 relative z-20"
        >
          <div className="bg-[#1a1a1a]/95 dark:bg-black/90 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 border border-rose-500/20 shadow-[0_30px_60px_rgba(225,29,72,0.15)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Left */}
            <div className="flex-1 relative z-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em]">Flash Expedition Sale</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight drop-shadow-lg">
                Gear <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 animate-gradient-x">Ekstrem.</span><br/>Harga Hancur.
              </h2>
              <p className="text-white/70 text-sm md:text-base font-medium mb-10 max-w-md">
                Diskon hingga 50% untuk persediaan sangat terbatas. Persiapkan dirimu untuk pendakian selanjutnya sebelum kehabisan.
              </p>
              
              {/* Fake Countdown */}
              <div className="flex gap-4 mb-10">
                {[
                  { label: "JAM", value: "12" },
                  { label: "MENIT", value: "45" },
                  { label: "DETIK", value: "30" }
                ].map((time, i) => (
                  <div key={i} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl w-20 py-3 backdrop-blur-sm">
                    <span className="text-2xl font-black text-rose-500 mb-1">{time.value}</span>
                    <span className="text-[9px] font-bold tracking-widest text-white/50">{time.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/promo" className="inline-flex items-center gap-4 bg-rose-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-rose-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                Klaim Promo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Promo Card Right */}
            <div className="w-full lg:w-[400px] relative z-10">
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80" alt="Promo Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Discount Tag */}
                <div className="absolute top-6 right-6 bg-rose-600 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest shadow-lg rotate-3 group-hover:-rotate-3 transition-transform">
                  -50% OFF
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Alpha Trekking Boots</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-rose-500 font-black text-xl">Rp 899.000</span>
                    <span className="text-white/40 line-through text-xs font-bold">Rp 1.798.000</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* SECTION: BEST SELLERS (ROYAL / PREMIUM VIBE) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-[3rem] mb-32 border border-amber-500/20 dark:border-amber-500/10 shadow-[0_20px_50px_rgba(245,158,11,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Subtle gold glow behind the section */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 relative z-10">
            <div>
              <span className="text-amber-600 dark:text-amber-500 text-[10px] font-black tracking-[0.2em] uppercase mb-2 block flex items-center gap-2">
                <span className="w-4 h-px bg-amber-500"></span> TrailForge Exclusive
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 dark:from-yellow-400 dark:via-amber-600 dark:to-yellow-400 animate-gradient-x">
                Best Sellers.
              </h2>
            </div>
            <Link href="/katalog" className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-x text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {loadingBestSellers ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-3xl" />
              ))
            ) : bestSellers.map((product, i) => {
              // Parse images
              let coverImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"; // fallback
              try {
                if (Array.isArray(product.images) && product.images.length > 0) {
                  coverImage = product.images[0];
                } else if (typeof product.images === 'string') {
                  const parsed = JSON.parse(product.images);
                  if (parsed.length > 0) coverImage = parsed[0];
                }
              } catch(e){}

              return (
                <motion.div variants={popUpVariant} key={product.id} className="group cursor-pointer" onClick={() => window.location.href=`/produk/${product.id}`}>
                  <div className="relative aspect-[4/5] bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden mb-6 border border-white/50 dark:border-white/5 shadow-lg group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 group-hover:-translate-y-2">
                    {i === 0 && (
                      <span className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-x text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border border-yellow-300/30">
                        Top #1 Terlaris
                      </span>
                    )}
                    {i === 1 && (
                      <span className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-[#F77F00] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Hot Item
                      </span>
                    )}
                    <img src={coverImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <button onClick={(e) => { e.stopPropagation(); window.location.href=`/produk/${product.id}`; }} className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-white transition-colors shadow-xl">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                  <h4 className="text-base font-black uppercase tracking-wide mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">{product.name}</h4>
                  <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 font-bold">Rp {(product.price || 0).toLocaleString("id-ID")}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* SECTION: TESTIMONIALS (SUARA PENJELAJAH) */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-20 mb-32"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-[#F77F00] dark:text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <MountainSnow className="w-4 h-4" /> Suara Penjelajah
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-[#212529] dark:text-white drop-shadow-2xl">
                Dibuat Oleh Penjelajah.<br/>Dipercaya Oleh Penjelajah.
              </h2>
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ALL_REVIEWS
              .filter(review => review.rating === 5)
              .sort((a, b) => b.text.length - a.text.length)
              .slice(0, 3)
              .map((testi, i) => (
              <motion.div 
                variants={popUpVariant} 
                key={i} 
                onClick={() => window.location.href=`/produk/${testi.productId}`}
                className="flex flex-col justify-between p-8 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-[#F77F00]/50 transition-all duration-500 cursor-pointer group"
              >
                <div>
                  <div className="text-[#F77F00] dark:text-orange-500 mb-6 flex gap-1 justify-between items-start">
                    <div className="flex gap-1">
                      {[...Array(testi.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77F00] transition-colors" />
                  </div>
                  <p className="text-base font-medium text-[#495057] dark:text-white/80 leading-relaxed mb-8 italic">
                    "{testi.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-black/10 dark:border-white/10">
                  <img src={testi.img} alt={testi.name} className="w-12 h-12 rounded-full object-cover grayscale border-2 border-transparent group-hover:grayscale-0 group-hover:border-[#F77F00] transition-all" />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#212529] dark:text-white">{testi.name}</h4>
                    <p className="text-[9px] font-bold tracking-widest text-[#F77F00] dark:text-orange-500 uppercase">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
        {/* MASSIVE PRE-FOOTER CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}
          className="w-full px-4 md:px-8 pb-16"
        >
          <div className="w-full bg-[#111] dark:bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 group">
            
            {/* Animated Background Image */}
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000&q=80" alt="CTA Background" className="w-full h-full object-cover opacity-30 dark:opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[3s] ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
            </div>

            {/* Glowing Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[50%] h-[80%] bg-orange-500/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 py-20 md:py-28 px-6 text-center flex flex-col items-center justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }}>
                <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F77F00] text-xs font-black tracking-widest uppercase mb-6 shadow-2xl">
                  Petualangan Menanti
                </span>
              </motion.div>
              
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} viewport={{ once: true }}
                className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-tight drop-shadow-2xl"
              >
                Siap Mulai<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 animate-gradient-x">Belanja?</span>
              </motion.h2>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} viewport={{ once: true }}>
                <Link href="/katalog" className="relative group/btn inline-flex items-center gap-4 bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-500 hover:scale-[1.05] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(247,127,0,0.5)] overflow-hidden">
                  {/* Hover Sweep Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 via-rose-500 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-gradient-x" />
                  
                  <span className="relative z-10 flex items-center gap-4 group-hover/btn:text-white transition-colors duration-500">
                    Buka Katalog <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* FOOTER & NEWSLETTER */}
        <Footer />

      </div>
    </main>
  );
}
