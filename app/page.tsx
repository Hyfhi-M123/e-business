"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShoppingBag, Search, Menu, ArrowRight, ArrowUpRight, MountainSnow, Crosshair, ShieldCheck, Truck, RefreshCcw, Lock, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  
  // Advanced Parallax Effect
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "-5%"]);
  
  // Hero Parallax
  const heroTextY = useTransform(smoothProgress, [0, 0.2], ["0%", "150%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-500 ease-out ${
        isScrolled 
          ? "bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-white/20 shadow-lg text-[#212529] dark:text-white" 
          : "bg-transparent border-b border-[#212529]/10 dark:border-white/10 text-[#212529] dark:text-white"
      }`}>
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 border border-black/20 dark:border-white/30 flex items-center justify-center rounded-full cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            <Menu className="w-4 h-4" />
          </div>
          <Link href="/" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 cursor-pointer">TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full animate-pulse"></span></Link>
        </div>
        
        <div className={`hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isScrolled ? "text-[#495057] dark:text-neutral-300" : "text-[#212529]/80 dark:text-white/80"}`}>
          <Link href="/katalog" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group">Katalog <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span></Link>
          <Link href="#" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group">Ekspedisi <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span></Link>
          <Link href="#" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group">Teknologi <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span></Link>
        </div>

        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
          <Link href="/keranjang" className="relative cursor-pointer group flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
            <span className="hidden md:block text-[10px] font-black tracking-widest uppercase">Cart</span>
          </Link>
        </div>
      </nav>

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
            className="mt-8"
          >
            <p className="text-black dark:text-white md:text-xl font-black uppercase tracking-[0.3em] max-w-lg mx-auto bg-white/60 dark:bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/40 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-2xl">
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
              <Link href="/katalog" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
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
              <Link href="/katalog" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
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
              <Link href="/katalog" className="group relative h-[24rem] rounded-3xl overflow-hidden cursor-pointer bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 block shadow-xl hover:shadow-2xl transition-all duration-500">
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

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              { id: "1", name: "Z-Shell Apex Jacket", price: "Rp 2.499.000", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80", tag: "Hot" },
              { id: "2", name: "Titanium Carabiner", price: "Rp 349.000", img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80", tag: "" },
              { id: "3", name: "AeroTent Pro 2-Person", price: "Rp 4.199.000", img: "https://images.unsplash.com/photo-1504280741562-474d6cb58bbc?w=400&q=80", tag: "New" },
              { id: "4", name: "Thermal Base Layer", price: "Rp 799.000", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", tag: "" },
            ].map((product, i) => (
              <motion.div variants={popUpVariant} key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/5] bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden mb-6 border border-white/50 dark:border-white/5 shadow-lg group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 group-hover:-translate-y-2">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-x text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border border-yellow-300/30">
                      {product.tag}
                    </span>
                  )}
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <button onClick={(e) => { e.stopPropagation(); window.location.href=`/produk/${product.id}`; }} className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-white transition-colors shadow-xl">
                      Lihat Detail
                    </button>
                  </div>
                </div>
                <h4 className="text-base font-black uppercase tracking-wide mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{product.name}</h4>
                <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 font-bold">{product.price}</p>
              </motion.div>
            ))}
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
            {[
              {
                text: "Jaket Z-Shell menyelamatkan saya di suhu -10°C. Benar-benar gear tanpa kompromi. Pelayanan dari TrailForge juga sangat profesional dan paham kebutuhan di lapangan.",
                name: "Arya S.", role: "Pendaki Profesional", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"
              },
              {
                text: "Tenda AeroTent sangat ringan tapi sanggup menahan badai Rinjani selama dua hari berturut-turut. Kualitas material dan jahitan sekelas brand internasional.",
                name: "Bima W.", role: "Pemandu Ekspedisi", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
              },
              {
                text: "Base layernya sangat nyaman. Tidak bau meskipun dipakai berhari-hari menembus hutan tropis. Wajib dibawa untuk pendakian panjang. Luar biasa!",
                name: "Citra D.", role: "Solo Hiker", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
              }
            ].map((testi, i) => (
              <motion.div variants={popUpVariant} key={i} className="flex flex-col justify-between p-8 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div>
                  <div className="text-[#F77F00] dark:text-orange-500 mb-6 flex gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-base font-medium text-[#495057] dark:text-white/80 leading-relaxed mb-8 italic">
                    "{testi.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-black/10 dark:border-white/10">
                  <img src={testi.img} alt={testi.name} className="w-12 h-12 rounded-full object-cover grayscale border-2 border-transparent hover:grayscale-0 hover:border-[#F77F00] transition-all" />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#212529] dark:text-white">{testi.name}</h4>
                    <p className="text-[9px] font-bold tracking-widest text-[#F77F00] dark:text-orange-500 uppercase">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* FOOTER & NEWSLETTER */}
        <footer className="w-full bg-[#F8F9FA]/90 dark:bg-neutral-950/90 backdrop-blur-2xl pt-24 pb-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Newsletter */}
            <div className="lg:col-span-2">
              <span className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2 mb-4">TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full"></span></span>
              <p className="text-[#6C757D] dark:text-neutral-400 text-sm font-medium mb-6 max-w-md">
                Dapatkan intel eksklusif tentang rilisan gear terbaru dan diskon 10% untuk ekspedisi pertamamu bersama kami.
              </p>
              <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email Address..." className="flex-1 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-[#DEE2E6] dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#F77F00] outline-none transition-colors" />
                <button className="px-6 py-3 bg-[#212529] dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#F77F00] dark:hover:bg-[#F77F00] hover:text-white transition-colors shadow-lg">
                  Join
                </button>
              </form>
            </div>

            {/* Links 1 */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white mb-6">Navigasi</h4>
              <ul className="space-y-4 text-sm font-bold text-[#6C757D] dark:text-neutral-400">
                <li><Link href="/katalog" className="hover:text-[#F77F00] transition-colors">Katalog Gear</Link></li>
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">Kisah Ekspedisi</Link></li>
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">Riset Teknologi</Link></li>
                <li><Link href="/login" className="hover:text-[#F77F00] transition-colors">Masuk Basecamp</Link></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white mb-6">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-[#6C757D] dark:text-neutral-400">
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">FAQ & Panduan</Link></li>
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">Lacak Pesanan</Link></li>
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">Garansi & Retur</Link></li>
                <li><Link href="#" className="hover:text-[#F77F00] transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#DEE2E6] dark:border-white/10 text-xs font-bold text-[#6C757D] dark:text-neutral-500">
            <p>© 2026 TrailForge Expedition Gear. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
