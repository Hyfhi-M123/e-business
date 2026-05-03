"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, ChevronRight, Plus, Minus,
  Heart, Share2, Check, Package, RotateCcw, Award, ChevronDown, ArrowUpRight,
  ThumbsUp, ImageIcon, X, Globe, MessageSquare, Copy, Search
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
    {
      id: 1, name: "Rizky Pratama", avatar: "RP", rating: 5, date: "2 minggu lalu", size: "L",
      text: "Jaket ini luar biasa! Saya pakai di Gunung Rinjani suhu 2°C dan badan tetap hangat. Bahannya ringan tapi sangat kokoh. Recommended banget!", helpful: 42, hasPhoto: true
    },
    {
      id: 2, name: "Dian Safitri", avatar: "DS", rating: 5, date: "1 bulan lalu", size: "M",
      text: "Kualitas jahitan rapi banget, waterproof-nya beneran terbukti waktu hiking di musim hujan. Worth every penny!", helpful: 28, hasPhoto: false
    },
    {
      id: 3, name: "Ahmad Fauzi", avatar: "AF", rating: 4, date: "1 bulan lalu", size: "XL",
      text: "Bagus sih, cuma agak kebesaran di bagian lengan untuk ukuran XL. Mungkin size chart-nya perlu diperbaiki. Selain itu perfect.", helpful: 15, hasPhoto: true
    },
    {
      id: 4, name: "Maya Angelina", avatar: "MA", rating: 5, date: "3 bulan lalu", size: "S",
      text: "Desainnya keren dan elegan! Bisa dipakai casual juga, nggak cuma buat hiking. Saya sering dapat pujian waktu pakai ini.", helpful: 33, hasPhoto: false
    }
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
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? "fill-[#F77F00] text-[#F77F00]" : "fill-neutral-200 text-neutral-200"}`} />
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
    <main className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans selection:bg-[#F77F00] selection:text-white pb-32">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-xl bg-white/80 border-b border-[#1B4332]/10">
        <Link href="/katalog" className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[#1B4332] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors">
            <Search className="w-5 h-5 text-[#212529]" />
          </button>
          <Link href="/keranjang" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors relative">
            <ShoppingBag className="w-5 h-5 text-[#212529]" />
            <span className="absolute top-1 right-1 bg-[#F77F00] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-20">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 mt-2">
          <Link href="/" className="hover:text-[#1B4332] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/katalog" className="hover:text-[#1B4332] transition-colors">{p.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529]">{p.name}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">

          {/* KOLOM KIRI: GALERI FOTO */}
          <motion.div
            variants={staggerContainer} initial="hidden" animate="visible"
            className="w-full lg:w-[50%] flex flex-col gap-3"
          >
            <div className="relative aspect-square bg-neutral-200 overflow-hidden rounded-[32px] shadow-2xl group border border-neutral-100">
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

              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-[#F77F00] text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
              >
                Best Seller
              </motion.div>

              {p.stock <= 30 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                  className="absolute top-5 right-5 z-10 px-3 py-1.5 bg-white/90 text-[#1B4332] text-[10px] font-black uppercase tracking-widest backdrop-blur-sm shadow-lg border border-neutral-100"
                >
                  Stok Terbatas: {p.stock}
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {p.images.map((img, i) => (
                <motion.button
                  key={i}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden transition-all rounded-xl ${activeImage === i ? "ring-2 ring-[#1B4332] ring-offset-2 ring-offset-[#F8F9FA]" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* KOLOM KANAN: DETAIL PRODUK */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="w-full lg:w-[50%] lg:sticky lg:top-24 flex flex-col pt-4 lg:pt-0"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#40916C]">{p.category}</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 leading-[1.05] text-[#1B4332]">
              {p.name}
            </motion.h1>

            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <RatingStars rating={p.rating} size="sm" />
                <span className="text-xs font-bold text-neutral-700">{p.rating}</span>
              </div>
              <span className="text-[10px] text-neutral-400">({p.reviewCount} ulasan)</span>
              <span className="text-xs text-neutral-300">•</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{p.soldCount} terjual</span>
            </motion.div>

            <motion.div variants={fadeUp} custom={0} className="flex items-end gap-3 mb-6 pb-6 border-b border-neutral-200">
              <span className="text-2xl font-black text-[#1B4332] tracking-tight">{formatRupiah(p.price)}</span>
              <span className="text-base font-medium text-neutral-400 line-through">{formatRupiah(p.originalPrice)}</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-xs font-black text-white bg-red-500 px-1.5 py-0.5 rounded"
              >-{discount}%</motion.span>
            </motion.div>

            <div className="mb-5">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Warna: <span className="text-[#212529]">{p.colors[activeColor].name}</span></span>
              </div>
              <div className="flex gap-2">
                {p.colors.map((c, i) => (
                  <button
                    key={i} onClick={() => setActiveColor(i)}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center border-2 ${activeColor === i ? "border-[#1B4332] scale-110 shadow-md" : "border-transparent hover:scale-110"
                      }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {activeColor === i && <Check className="w-3 h-3 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Ukuran</span>
                <button className="text-[9px] uppercase tracking-widest text-[#40916C] font-bold hover:underline">Panduan Ukuran</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map(size => (
                  <button
                    key={size} onClick={() => setActiveSize(size)}
                    className={`h-10 transition-all text-xs rounded-lg ${activeSize === size
                      ? "bg-[#1B4332] text-white font-black shadow-lg shadow-[#1B4332]/20"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:border-[#40916C] font-medium"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-3">Jumlah</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0 w-fit border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-400 hover:text-[#1B4332]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center text-base font-black border-x border-neutral-100 text-[#1B4332]">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-400 hover:text-[#1B4332]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={quantity}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex flex-col"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Total</span>
                    <span className="text-lg font-black text-[#1B4332] tracking-tight">{formatRupiah(p.price * quantity)}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                className={`w-full h-14 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all rounded-xl shadow-xl shadow-[#1B4332]/10 ${addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-[#1B4332] text-white hover:bg-[#2d5a47]"
                  }`}
              >
                {addedToCart ? <><Check className="w-5 h-5" /> Ditambahkan!</> : <><ShoppingBag className="w-5 h-5" /> Tambah Ke Keranjang</>}
              </motion.button>
              <button className="w-full h-14 bg-white border-2 border-[#1B4332] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#1B4332]/5 transition-colors rounded-xl">
                Beli Sekarang
              </button>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${wishlisted ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-neutral-200 text-neutral-600 hover:border-[#1B4332]"}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-600" : ""}`} />
                  {wishlisted ? "Disimpan" : "Wishlist"}
                </button>

                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:border-[#1B4332] transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Share2 className="w-4 h-4" /> Bagikan
                  </button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full left-0 right-0 mb-3 z-50 bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xl min-w-[220px]"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Bagikan</span>
                          <button onClick={() => setShowShareMenu(false)}><X className="w-4 h-4 text-neutral-400" /></button>
                        </div>
                        <div className="flex flex-col gap-1">
                          {[
                            { icon: <Copy className="w-4 h-4" />, label: "Salin Link" },
                            { icon: <Globe className="w-4 h-4" />, label: "Facebook" },
                            { icon: <MessageSquare className="w-4 h-4" />, label: "WhatsApp" },
                          ].map((item, i) => (
                            <button key={i} onClick={() => setShowShareMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-600 hover:text-[#1B4332]">
                              {item.icon} {item.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 pt-6 border-t border-neutral-200">
              {[
                { icon: <Truck className="w-5 h-5" />, title: "Gratis Ongkir", sub: "Min. 500rb" },
                { icon: <RotateCcw className="w-5 h-5" />, title: "30 Hari Retur", sub: "Mudah" },
                { icon: <Award className="w-5 h-5" />, title: "100% Original", sub: "Garansi" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 py-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <span className="text-[#F77F00]">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-[#1B4332]">{badge.title}</span>
                  <span className="text-[9px] text-neutral-400 font-bold">{badge.sub}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <div className="border-b border-neutral-200">
                <button onClick={() => toggleAccordion("highlights")} className="w-full flex justify-between items-center py-5 text-sm font-black uppercase tracking-widest text-[#1B4332] hover:text-[#40916C] transition-colors">
                  Keunggulan Produk <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "highlights" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "highlights" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <ul className="pb-5 flex flex-col gap-3">
                        {p.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-neutral-600 font-medium">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-neutral-200">
                <button onClick={() => toggleAccordion("desc")} className="w-full flex justify-between items-center py-5 text-sm font-black uppercase tracking-widest text-[#1B4332] hover:text-[#40916C] transition-colors">
                  Deskripsi <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "desc" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "desc" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="pb-5 text-sm text-neutral-500 leading-relaxed font-medium">{p.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-neutral-200">
                <button onClick={() => toggleAccordion("specs")} className="w-full flex justify-between items-center py-5 text-sm font-black uppercase tracking-widest text-[#1B4332] hover:text-[#40916C] transition-colors">
                  Spesifikasi Teknis <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === "specs" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === "specs" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <table className="w-full mb-5">
                        <tbody>
                          {Object.entries(p.specs).map(([key, val], i) => (
                            <tr key={i} className="border-b border-neutral-50 last:border-0">
                              <td className="py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest w-[40%]">{key}</td>
                              <td className="py-3 text-sm text-neutral-700 font-bold">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION: ULASAN */}
        <section ref={reviewRef} className="mt-24 pt-16 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1B4332] mb-2">Ulasan Pelanggan</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={p.rating} size="md" />
                  <span className="text-2xl font-black text-[#1B4332]">{p.rating}</span>
                </div>
                <span className="text-sm text-neutral-400 font-bold">dari {p.reviewCount} ulasan</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-black uppercase tracking-widest">Urutkan:</span>
              {["helpful", "newest"].map(opt => (
                <button
                  key={opt} onClick={() => setReviewSort(opt)}
                  className={`text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border-2 transition-all ${reviewSort === opt ? "bg-[#1B4332] text-white border-[#1B4332] shadow-lg shadow-[#1B4332]/20" : "border-neutral-200 text-neutral-400 hover:border-[#40916C]"
                    }`}
                >
                  {opt === "helpful" ? "Terpopuler" : "Terbaru"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(showAllReviews ? p.reviews : p.reviews.slice(0, 2)).map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 30 }}
                animate={reviewInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-[#1B4332]/5 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center text-sm font-black text-white shadow-lg">
                      {rev.avatar}
                    </div>
                    <div>
                      <span className="text-base font-black text-[#1B4332] block">{rev.name}</span>
                      <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Ukuran: {rev.size} • {rev.date}</span>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed font-medium mb-6 italic">"{rev.text}"</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-50">
                  {rev.hasPhoto && (
                    <div className="flex items-center gap-2 text-[10px] text-[#40916C] font-black uppercase tracking-widest">
                      <ImageIcon className="w-3.5 h-3.5" /> Foto Pembeli
                    </div>
                  )}
                  <button className="flex items-center gap-2 text-xs text-neutral-400 hover:text-[#F77F00] transition-colors font-black uppercase tracking-widest">
                    <ThumbsUp className="w-3.5 h-3.5" /> {rev.helpful} Terbantu
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {!showAllReviews && p.reviews.length > 2 && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => setShowAllReviews(true)} className="px-10 py-4 bg-white border-2 border-neutral-200 text-sm font-black uppercase tracking-widest text-[#1B4332] hover:border-[#1B4332] hover:bg-neutral-50 transition-all rounded-2xl">
                Lihat Semua {p.reviewCount} Ulasan
              </button>
            </div>
          )}
        </section>

        {/* SECTION: TERKAIT */}
        <section ref={relatedRef} className="mt-24 pt-16 border-t border-neutral-200">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1B4332]">Pilihan Lainnya</h2>
            <Link href="/katalog" className="text-[10px] font-black text-[#40916C] uppercase tracking-widest hover:text-[#1B4332] transition-colors flex items-center gap-2">
              Katalog Lengkap <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {p.relatedProducts.map((rp, idx) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 40 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/produk/${rp.id}`} className="group flex flex-col">
                  <div className="relative aspect-square bg-neutral-200 overflow-hidden mb-4 rounded-xl shadow-sm">
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1B4332]/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white text-[#1B4332] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Detail
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-tight mb-1 text-[#1B4332] group-hover:text-[#40916C] transition-colors line-clamp-1">{rp.name}</h4>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <RatingStars rating={rp.rating} />
                    <span className="text-[9px] text-neutral-400 font-bold">{rp.rating}</span>
                  </div>
                  <span className="text-sm font-black text-[#1B4332]">{formatRupiah(rp.price)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
