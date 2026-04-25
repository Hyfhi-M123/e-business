"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, ChevronRight, Plus, Minus,
  Heart, Share2, Check, Package, RotateCcw, Award, ChevronDown, ArrowUpRight,
  ThumbsUp, ImageIcon, X, Globe, MessageSquare, Copy
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

// Variasi animasi global
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } })
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } })
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

// ==========================================
// DATA SIMULASI PRODUK (Nantinya dari Supabase)
// ==========================================
const productData = {
  name: "Timberline X-Coat Arctic Pro",
  category: "Jaket Ekspedisi",
  price: 1200000,
  originalPrice: 1800000,
  rating: 4.8,
  reviewCount: 124,
  soldCount: 892,
  stock: 23,
  sku: "TF-ARC-2026-BLK",
  description: `Timberline X-Coat Arctic Pro adalah puncak inovasi pakaian penahan dingin untuk penjelajahan di suhu ekstrem. 
  Didesain menggunakan serat mikro isolasi ganda generasi terbaru yang mampu menjaga panas tubuh secara optimal 
  tanpa menambah beban berlebih. Cocok untuk pendakian gunung es, ekspedisi kutub, maupun aktivitas outdoor 
  di musim dingin yang menantang.`,
  highlights: [
    "Teknologi Aerogel Insulation generasi ke-4",
    "Tahan air 20,000mm dengan lapisan GORE-TEX Pro",
    "Ventilasi ketiak dengan sirkulasi udara cerdas",
    "Helm kompatibel dengan hood yang adjustable",
    "Reflective safety strips untuk visibilitas malam"
  ],
  specs: {
    "Material": "100% GORE-TEX Pro 3-Layer",
    "Berat Bersih": "450 gram",
    "Waterproof Rating": "20,000mm",
    "Breathability": "25,000g/m²/24hr",
    "Warna Tersedia": "Midnight Black, Alpine White, Ember Orange",
    "Negara Produksi": "Jepang",
    "Standar Keamanan": "EN 14058:2017 (Cold Protection)"
  },
  colors: [
    { name: "Midnight Black", hex: "#1a1a1a" },
    { name: "Alpine White", hex: "#e8e8e8" },
    { name: "Ember Orange", hex: "#ea580c" }
  ],
  images: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1532054950669-026859e2185c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1495103033382-fe343886b671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ],
  reviews: [
    { id: 1, name: "Rizky Pratama", avatar: "RP", rating: 5, date: "2 minggu lalu", size: "L", 
      text: "Jaket ini luar biasa! Saya pakai di Gunung Rinjani suhu 2°C dan badan tetap hangat. Bahannya ringan tapi sangat kokoh. Recommended banget!", helpful: 42, hasPhoto: true },
    { id: 2, name: "Dian Safitri", avatar: "DS", rating: 5, date: "1 bulan lalu", size: "M",
      text: "Kualitas jahitan rapi banget, waterproof-nya beneran terbukti waktu hiking di musim hujan. Worth every penny!", helpful: 28, hasPhoto: false },
    { id: 3, name: "Ahmad Fauzi", avatar: "AF", rating: 4, date: "1 bulan lalu", size: "XL",
      text: "Bagus sih, cuma agak kebesaran di bagian lengan untuk ukuran XL. Mungkin size chart-nya perlu diperbaiki. Selain itu perfect.", helpful: 15, hasPhoto: true },
    { id: 4, name: "Maya Angelina", avatar: "MA", rating: 5, date: "3 bulan lalu", size: "S",
      text: "Desainnya keren dan elegan! Bisa dipakai casual juga, nggak cuma buat hiking. Saya sering dapat pujian waktu pakai ini.", helpful: 33, hasPhoto: false }
  ],
  relatedProducts: [
    { id: "124", name: "Storm Shell V2", price: 980000, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80", rating: 4.6 },
    { id: "125", name: "Glacier Down Parka", price: 1500000, image: "https://images.unsplash.com/photo-1532054950669-026859e2185c?w=400&q=80", rating: 4.9 },
    { id: "126", name: "Summit Fleece Pro", price: 650000, image: "https://images.unsplash.com/photo-1495103033382-fe343886b671?w=400&q=80", rating: 4.7 },
    { id: "127", name: "Basecamp Rain Shell", price: 750000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", rating: 4.5 }
  ]
};

// Helper Format Rupiah
function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// Komponen Rating Stars
function RatingStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? "fill-orange-500 text-orange-500" : "fill-neutral-700 text-neutral-700"}`} />
      ))}
    </div>
  );
}

export default function ProfessionalPDP() {
  const pathname = usePathname();
  const idProduk = pathname.split('/').pop() || "123";
  const p = productData;

  // State UI
  const [activeSize, setActiveSize] = useState("L");
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("highlights");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewSort, setReviewSort] = useState("helpful");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Refs untuk scroll-triggered animations
  const reviewRef = useRef(null);
  const relatedRef = useRef(null);
  const reviewInView = useInView(reviewRef, { once: true, margin: "-100px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-100px" });

  const discount = Math.round((1 - p.price / p.originalPrice) * 100);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500 selection:text-white pb-32">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-neutral-950 border-b border-white/5">
        <Link href="/katalog" className="flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)} 
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors relative"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setWishlisted(!wishlisted)} 
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Share Popup */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-[72px] right-6 md:right-12 z-50 bg-neutral-900 border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[220px]"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Bagikan</span>
              <button onClick={() => setShowShareMenu(false)}><X className="w-4 h-4 text-neutral-500" /></button>
            </div>
            <div className="flex flex-col gap-1">
              {[
                { icon: <Copy className="w-4 h-4" />, label: "Salin Link" },
                { icon: <Globe className="w-4 h-4" />, label: "Facebook" },
                { icon: <MessageSquare className="w-4 h-4" />, label: "Twitter / X" },
              ].map((item, i) => (
                <button key={i} onClick={() => setShowShareMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-neutral-300 hover:text-white">
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24">
        
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-8 mt-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/katalog" className="hover:text-white transition-colors">{p.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{p.name}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">
          
          {/* ================================================================
              KOLOM KIRI: GALERI FOTO (60% Lebar, Scrollable) 
              ================================================================ */}
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="w-full lg:w-[58%] flex flex-col gap-3"
          >
            
            {/* Gambar Utama (Besar) dengan animasi ganti gambar */}
            <motion.div variants={staggerItem} className="relative w-full aspect-[4/5] bg-neutral-900 overflow-hidden cursor-zoom-in group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  src={p.images[activeImage]} alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              </AnimatePresence>
              
              {/* Badge Diskon */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest"
              >
                -{discount}%
              </motion.div>

              {/* Stok Terbatas */}
              {p.stock <= 30 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                  className="absolute top-5 right-5 z-10 px-3 py-1.5 bg-orange-500/90 text-neutral-950 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
                >
                  <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mr-2" />
                  Sisa {p.stock} unit
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail Grid dengan Stagger */}
            <div className="grid grid-cols-4 gap-3">
              {p.images.map((img, i) => (
                <motion.button 
                  key={i} 
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden transition-all ${
                    activeImage === i ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-neutral-950" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ================================================================
              KOLOM KANAN: DETAIL PRODUK (Sticky saat di Desktop)
              ================================================================ */}
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="w-full lg:w-[42%] lg:sticky lg:top-24 flex flex-col pt-4 lg:pt-0"
          >
            
            {/* Kategori + SKU */}
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{p.category}</span>
              <span className="text-[10px] font-mono text-neutral-600">SKU: {p.sku}</span>
            </motion.div>

            {/* Nama Produk */}
            <motion.h1 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 leading-[1.05]">
              {p.name}
            </motion.h1>

            {/* Rating + Terjual */}
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <RatingStars rating={p.rating} />
                <span className="text-sm font-bold text-neutral-300">{p.rating}</span>
              </div>
              <span className="text-xs text-neutral-500">({p.reviewCount} ulasan)</span>
              <span className="text-xs text-neutral-600">•</span>
              <span className="text-xs text-neutral-500">{p.soldCount} terjual</span>
            </motion.div>

            {/* Harga */}
            <motion.div variants={fadeUp} custom={0} className="flex items-end gap-3 mb-8 pb-8 border-b border-white/5">
              <span className="text-3xl font-black text-white tracking-tight">{formatRupiah(p.price)}</span>
              <span className="text-lg font-medium text-neutral-500 line-through">{formatRupiah(p.originalPrice)}</span>
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-sm font-black text-red-500 bg-red-500/10 px-2 py-0.5"
              >-{discount}%</motion.span>
            </motion.div>

            {/* Warna */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Warna: <span className="text-white">{p.colors[activeColor].name}</span></span>
              </div>
              <div className="flex gap-3">
                {p.colors.map((c, i) => (
                  <button 
                    key={i} onClick={() => setActiveColor(i)}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                      activeColor === i ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-neutral-950" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {activeColor === i && <Check className="w-4 h-4 text-white drop-shadow-lg" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori Ukuran */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Ukuran</span>
                <button className="text-[10px] uppercase tracking-widest text-neutral-500 underline decoration-neutral-700 hover:text-white transition-colors">Panduan Ukuran</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map(size => (
                  <button 
                    key={size} onClick={() => setActiveSize(size)}
                    className={`h-12 transition-all text-sm ${
                      activeSize === size 
                      ? "bg-white text-neutral-950 font-black" 
                      : "bg-transparent border border-neutral-800 text-neutral-400 hover:border-neutral-500 font-medium"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-4">Jumlah</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0 w-fit border border-neutral-800 overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-12 flex items-center justify-center text-lg font-bold border-x border-neutral-800">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Total Harga Otomatis */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={quantity}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total</span>
                    <span className="text-xl font-black text-white tracking-tight">{formatRupiah(p.price * quantity)}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
              {quantity >= p.stock && <p className="text-[10px] text-orange-500 mt-2 font-bold">Maksimum stok tercapai</p>}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <motion.button 
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                className={`w-full h-14 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  addedToCart 
                    ? "bg-green-600 text-white" 
                    : "bg-orange-500 text-neutral-950 hover:bg-orange-400"
                }`}
              >
                {addedToCart ? <><Check className="w-5 h-5" /> Ditambahkan!</> : <><ShoppingBag className="w-5 h-5" /> Tambah Ke Keranjang</>}
              </motion.button>
              <button className="w-full h-14 bg-transparent border border-neutral-800 font-bold uppercase tracking-widest text-neutral-300 hover:bg-neutral-900 transition-colors">
                Beli Langsung
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8 pt-6 border-t border-white/5">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Gratis Ongkir", sub: "Min. 500rb" },
                { icon: <RotateCcw className="w-5 h-5" />, title: "30 Hari Retur", sub: "Tanpa Ribet" },
                { icon: <Award className="w-5 h-5" />, title: "100% Original", sub: "Bergaransi" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 py-4 bg-neutral-900/50 rounded-xl border border-white/5">
                  <span className="text-orange-500">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{badge.title}</span>
                  <span className="text-[9px] text-neutral-500 font-medium">{badge.sub}</span>
                </div>
              ))}
            </div>

            {/* Detail Accordion */}
            <div className="border-t border-white/10 flex flex-col">
              {/* Highlights */}
              <div className="border-b border-neutral-800">
                <button onClick={() => toggleAccordion("highlights")} className="w-full flex justify-between items-center py-5 text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                  Keunggulan Produk <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "highlights" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "highlights" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <ul className="pb-5 flex flex-col gap-3">
                        {p.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Deskripsi */}
              <div className="border-b border-neutral-800">
                <button onClick={() => toggleAccordion("desc")} className="w-full flex justify-between items-center py-5 text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                  Deskripsi Produk <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "desc" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "desc" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="pb-5 text-sm text-neutral-400 leading-relaxed whitespace-pre-line">{p.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spesifikasi */}
              <div className="border-b border-neutral-800">
                <button onClick={() => toggleAccordion("specs")} className="w-full flex justify-between items-center py-5 text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                  Spesifikasi Teknis <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "specs" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "specs" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <table className="w-full mb-5">
                        <tbody>
                          {Object.entries(p.specs).map(([key, val], i) => (
                            <tr key={i} className="border-b border-neutral-900 last:border-0">
                              <td className="py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider w-[40%]">{key}</td>
                              <td className="py-3 text-sm text-neutral-300">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pengiriman */}
              <div className="border-b border-neutral-800">
                <button onClick={() => toggleAccordion("shipping")} className="w-full flex justify-between items-center py-5 text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                  Pengiriman & Pengembalian <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "shipping" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "shipping" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="pb-5 flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <Package className="w-5 h-5 text-neutral-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-neutral-200">Pengiriman Standar (2-4 hari)</p>
                            <p className="text-xs text-neutral-500">Gratis untuk pesanan di atas Rp 500.000</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Truck className="w-5 h-5 text-neutral-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-neutral-200">Express (1 hari)</p>
                            <p className="text-xs text-neutral-500">Rp 25.000 — Khusus Jabodetabek</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <RotateCcw className="w-5 h-5 text-neutral-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-neutral-200">Pengembalian 30 Hari</p>
                            <p className="text-xs text-neutral-500">Produk belum dipakai, tag masih terpasang</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </div>

        {/* ================================================================
            SECTION: ULASAN PELANGGAN
            ================================================================ */}
        <section ref={reviewRef} className="mt-24 pt-16 border-t border-white/5">
          
          {/* Header Review */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Ulasan Pelanggan</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={p.rating} size="md" />
                  <span className="text-2xl font-black">{p.rating}</span>
                </div>
                <span className="text-sm text-neutral-500 font-medium">dari {p.reviewCount} ulasan</span>
              </div>
            </div>
            
            {/* Sort & Filter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Urutkan:</span>
              {["helpful", "newest"].map(opt => (
                <button 
                  key={opt} onClick={() => setReviewSort(opt)}
                  className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
                    reviewSort === opt ? "bg-white text-neutral-950 border-white" : "border-neutral-800 text-neutral-500 hover:border-neutral-500"
                  }`}
                >
                  {opt === "helpful" ? "Terpopuler" : "Terbaru"}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Distribution Bar (Animasi Bar Mengisi) */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mb-10">
            <div className="flex flex-col gap-2">
              {[5,4,3,2,1].map((star, idx) => {
                const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-400 w-3">{star}</span>
                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={reviewInView ? { width: `${pct}%` } : {}}
                        transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-orange-500 rounded-full" 
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(showAllReviews ? p.reviews : p.reviews.slice(0, 2)).map((rev, idx) => (
              <motion.div 
                key={rev.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={reviewInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, borderColor: "rgba(249,115,22,0.3)" }}
                className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-[0_0_30px_rgba(249,115,22,0.05)]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-black text-white">
                      {rev.avatar}
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{rev.name}</span>
                      <span className="text-[10px] text-neutral-500 font-medium">Ukuran: {rev.size} • {rev.date}</span>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">{rev.text}</p>
                {rev.hasPhoto && (
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                    <ImageIcon className="w-3 h-3" /> Menyertakan Foto
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors w-fit mt-auto font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" /> Membantu ({rev.helpful})
                </motion.button>
              </motion.div>
            ))}
          </div>

          {!showAllReviews && p.reviews.length > 2 && (
            <div className="mt-8 flex justify-center">
              <button onClick={() => setShowAllReviews(true)} className="px-8 py-3 border border-neutral-800 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded-full">
                Lihat Semua {p.reviewCount} Ulasan
              </button>
            </div>
          )}
        </section>

        {/* ================================================================
            SECTION: PRODUK TERKAIT / REKOMENDASI
            ================================================================ */}
        <section ref={relatedRef} className="mt-24 pt-16 border-t border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={relatedInView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-10"
          >
            <h2 className="text-3xl font-black uppercase tracking-tighter">Mungkin Kamu Suka</h2>
            <Link href="/katalog" className="text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:text-orange-500 transition-colors hidden md:flex items-center gap-2">
              Lihat Semua <ArrowUpRight className="w-3 h-3" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {p.relatedProducts.map((rp, idx) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 40 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/produk/${rp.id}`} className="group flex flex-col">
                  <motion.div 
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-4"
                  >
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 text-center text-[10px] font-black uppercase tracking-widest text-white bg-orange-500 py-2"
                    >
                      Lihat Detail
                    </motion.div>
                  </motion.div>
                  <h4 className="text-sm font-bold uppercase tracking-tight mb-1 group-hover:text-orange-500 transition-colors">{rp.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <RatingStars rating={rp.rating} />
                    <span className="text-[10px] text-neutral-500 font-bold">{rp.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-300">{formatRupiah(rp.price)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
