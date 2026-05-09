"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, ChevronRight, Plus, Minus,
  Heart, Share2, Check, Package, RotateCcw, Award, ChevronDown, ArrowUpRight,
  ThumbsUp, ImageIcon, X, Globe, MessageSquare, Copy, Search
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ALL_PRODUCTS } from "../../lib/products";

// Variasi animasi global
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } })
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
    { name: "Ember Orange", hex: "#F77F00" }
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
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? "fill-[#F77F00] text-[#F77F00]" : "fill-neutral-300 dark:fill-neutral-700 text-neutral-300 dark:text-neutral-700"}`} />
      ))}
    </div>
  );
}

export default function ProfessionalPDP() {
  const pathname = usePathname();
  const router = useRouter();
  const idProduk = pathname.split('/').pop() || "102";
  
  // Cari produk dari database dummy berdasarkan ID
  const foundProduct = ALL_PRODUCTS.find(item => item.id === idProduk);
  
  // Merge data dasar dari ALL_PRODUCTS dengan detail lengkap dari mock data
  const p = foundProduct ? {
    ...productData,
    name: foundProduct.name,
    category: foundProduct.category,
    price: foundProduct.price,
    originalPrice: foundProduct.originalPrice,
    rating: foundProduct.rating,
    reviewCount: foundProduct.reviews,
    soldCount: foundProduct.sold,
    images: [foundProduct.image, ...productData.images.slice(1)]
  } : productData;

  const { addToCart } = useCart();

  // State UI
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("highlights");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewSort, setReviewSort] = useState("helpful");
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const { user } = useAuth(); // Action Guard Listener
  const [guestAlert, setGuestAlert] = useState(false);

  // Refs untuk scroll-triggered animations
  const reviewRef = useRef(null);
  const relatedRef = useRef(null);
  const reviewInView = useInView(reviewRef, { once: true, margin: "-100px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-100px" });

  const sizeSurcharge = activeSize === "L" ? 50000 : activeSize === "XL" ? 100000 : 0;
  const currentPrice = p.price + sizeSurcharge;
  const currentOriginalPrice = p.originalPrice + sizeSurcharge;

  const discount = Math.round((1 - currentPrice / currentOriginalPrice) * 100);

  const showGuestWarning = () => {
    setGuestAlert(true);
    setTimeout(() => setGuestAlert(false), 3000);
  };

  const executeAddToCart = () => {
    addToCart({
      id: idProduk,
      name: `${p.name} - ${activeSize} - ${p.colors[activeColor].name}`,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: p.images[0],
      category: p.category,
      quantity: quantity
    });
  };

  const handleAddToCart = () => {
    if (!user) return showGuestWarning();
    executeAddToCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) return showGuestWarning();
    const buyNowItem = {
      id: idProduk,
      name: `${p.name} - ${activeSize} - ${p.colors[activeColor].name}`,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      image: p.images[0],
      category: p.category,
      quantity: quantity
    };
    sessionStorage.setItem("trailforge_buynow", JSON.stringify([buyNowItem]));
    router.push('/keranjang?mode=buynow');
  };

  const handleWishlist = () => {
    if (!user) return showGuestWarning();
    setWishlisted(!wishlisted);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      
      {/* NAVBAR GLOBAL */}
      <Navbar />

      {/* KONTEN UTAMA */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mb-8 mt-2">
          <Link href="/" className="hover:text-[#F77F00] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/katalog" className="hover:text-[#F77F00] transition-colors">{p.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">{p.name}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">

          {/* KOLOM KIRI: GALERI FOTO */}
          <motion.div
            variants={staggerContainer} initial="hidden" animate="visible"
            className="w-full lg:w-[50%] flex flex-col gap-3"
          >
            <div className="relative aspect-square bg-[#e9ecef] dark:bg-[#121212] overflow-hidden border border-black/10 dark:border-white/10 group">
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
                className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-[#F77F00] text-white text-[10px] font-black uppercase tracking-widest"
              >
                Best Seller
              </motion.div>

              {p.stock <= 30 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                  className="absolute top-5 right-5 z-10 px-3 py-1.5 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
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
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden border transition-all ${activeImage === i ? "border-[#F77F00]" : "border-black/10 dark:border-white/10 opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* TAB SECTION (DIPINDAH KE KOLOM KIRI) */}
            <div className="flex flex-col mt-8 border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] p-6">
              {/* TAB HEADERS */}
              <div className="flex border-b border-black/10 dark:border-white/10 mb-4">
                <button 
                  onClick={() => setOpenAccordion("highlights")} 
                  className={`flex-1 pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${openAccordion === "highlights" ? "text-[#F77F00] border-b-2 border-[#F77F00]" : "text-[#6C757D] dark:text-neutral-500 hover:text-[#212529] dark:hover:text-white"}`}
                >
                  Keunggulan
                </button>
                <button 
                  onClick={() => setOpenAccordion("desc")} 
                  className={`flex-1 pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${openAccordion === "desc" ? "text-[#F77F00] border-b-2 border-[#F77F00]" : "text-[#6C757D] dark:text-neutral-500 hover:text-[#212529] dark:hover:text-white"}`}
                >
                  Deskripsi
                </button>
                <button 
                  onClick={() => setOpenAccordion("specs")} 
                  className={`flex-1 pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${openAccordion === "specs" ? "text-[#F77F00] border-b-2 border-[#F77F00]" : "text-[#6C757D] dark:text-neutral-500 hover:text-[#212529] dark:hover:text-white"}`}
                >
                  Spesifikasi
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="pt-2">
                <AnimatePresence mode="wait">
                  {openAccordion === "highlights" && (
                    <motion.div key="highlights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <ul className="flex flex-col gap-4">
                        {p.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#6C757D] dark:text-neutral-400 font-medium">
                            <Check className="w-4 h-4 text-[#F77F00] mt-0.5 flex-shrink-0" /> {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {openAccordion === "desc" && (
                    <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <p className="text-sm text-[#6C757D] dark:text-neutral-400 leading-relaxed font-mono">{p.description}</p>
                    </motion.div>
                  )}

                  {openAccordion === "specs" && (
                    <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <table className="w-full">
                        <tbody>
                          {Object.entries(p.specs).map(([key, val], i) => (
                            <tr key={i} className="border-b border-black/5 dark:border-white/5 last:border-0">
                              <td className="py-4 text-[10px] font-black text-[#6C757D] dark:text-neutral-500 uppercase tracking-widest w-[40%]">{key}</td>
                              <td className="py-4 text-sm text-[#212529] dark:text-white font-mono">{val}</td>
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

          {/* KOLOM KANAN: DETAIL PRODUK */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="w-full lg:w-[50%] lg:sticky lg:top-32 flex flex-col pt-4 lg:pt-0"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F77F00]">{p.category}</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-[1.05] text-[#212529] dark:text-white">
              {p.name}
            </motion.h1>

            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <RatingStars rating={p.rating} size="sm" />
                <span className="text-xs font-bold text-[#212529] dark:text-white">{p.rating}</span>
              </div>
              <span className="text-[10px] text-[#6C757D] dark:text-neutral-500">({p.reviewCount} ulasan)</span>
              <span className="text-xs text-black/20 dark:text-white/20">•</span>
              <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 font-bold uppercase tracking-widest">{p.soldCount} terjual</span>
            </motion.div>

            <motion.div variants={fadeUp} custom={0} className="flex items-end gap-4 mb-8 pb-8 border-b border-black/10 dark:border-white/10">
              <span className="text-3xl font-black text-[#212529] dark:text-white tracking-tight">{formatRupiah(currentPrice)}</span>
              <span className="text-base font-medium text-[#6C757D] dark:text-neutral-500 line-through">{formatRupiah(currentOriginalPrice)}</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-[10px] font-black text-white bg-red-600 px-2 py-1 uppercase tracking-widest"
              >-{discount}% OFF</motion.span>
            </motion.div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Warna: <span className="text-[#212529] dark:text-white">{p.colors[activeColor].name}</span></span>
              </div>
              <div className="flex gap-3">
                {p.colors.map((c, i) => (
                  <button
                    key={i} onClick={() => { setActiveColor(i); setActiveImage(i % p.images.length); }}
                    className={`w-10 h-10 transition-all flex items-center justify-center border-2 ${activeColor === i ? "border-[#F77F00] scale-110" : "border-transparent hover:scale-110"
                      }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {activeColor === i && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Ukuran</span>
                <button className="text-[9px] uppercase tracking-widest text-[#F77F00] font-bold hover:underline">Panduan Ukuran</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["S", "M", "L", "XL"].map(size => (
                  <button
                    key={size} onClick={() => setActiveSize(size)}
                    className={`h-12 transition-all text-xs font-black uppercase tracking-widest border ${activeSize === size
                      ? "bg-[#212529] dark:bg-white text-white dark:text-black border-[#212529] dark:border-white"
                      : "bg-transparent border-black/20 dark:border-white/20 text-[#212529] dark:text-white hover:border-[#F77F00]"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 block mb-3">Jumlah</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center w-fit border border-black/20 dark:border-white/20 bg-transparent">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#212529] dark:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-14 h-12 flex items-center justify-center text-base font-black border-x border-black/20 dark:border-white/20 text-[#212529] dark:text-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[#212529] dark:text-white"
                  >
                    <Plus className="w-4 h-4" />
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
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Total</span>
                    <span className="text-xl font-black text-[#212529] dark:text-white tracking-tight">{formatRupiah(currentPrice * quantity)}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                className={`w-full h-16 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-[#F77F00] text-black hover:bg-orange-600 hover:text-white"
                  }`}
              >
                {addedToCart ? <><Check className="w-5 h-5" /> Ditambahkan!</> : <><ShoppingBag className="w-5 h-5" /> Tambah Ke Keranjang</>}
              </motion.button>
              <button 
                onClick={handleBuyNow}
                className="w-full h-16 bg-transparent border-2 border-[#212529] dark:border-white font-black uppercase tracking-widest text-[#212529] dark:text-white hover:bg-[#212529] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Beli Sekarang
              </button>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 h-14 flex items-center justify-center gap-2 border transition-all font-bold text-xs uppercase tracking-widest ${wishlisted ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400" : "bg-transparent border-black/20 dark:border-white/20 text-[#212529] dark:text-white hover:border-[#F77F00]"}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                  {wishlisted ? "Disimpan" : "Wishlist"}
                </button>

                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full h-14 flex items-center justify-center gap-2 border border-black/20 dark:border-white/20 bg-transparent text-[#212529] dark:text-white hover:border-[#F77F00] transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Share2 className="w-4 h-4" /> Bagikan
                  </button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                         initial={{ opacity: 0, scale: 0.95, y: 10 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95, y: 10 }}
                         className="absolute bottom-full left-0 right-0 mb-3 z-50 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-4 shadow-2xl min-w-[220px]"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Bagikan</span>
                          <button onClick={() => setShowShareMenu(false)}><X className="w-4 h-4 text-neutral-500" /></button>
                        </div>
                        <div className="flex flex-col gap-1">
                          {[
                            { icon: <Copy className="w-4 h-4" />, label: "Salin Link" },
                            { icon: <Globe className="w-4 h-4" />, label: "Facebook" },
                            { icon: <MessageSquare className="w-4 h-4" />, label: "WhatsApp" },
                          ].map((item, i) => (
                            <button key={i} onClick={() => setShowShareMenu(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold text-[#212529] dark:text-white uppercase tracking-widest">
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

            <div className="grid grid-cols-3 gap-4 mb-10 pt-8 border-t border-black/10 dark:border-white/10">
              {[
                { icon: <Truck className="w-6 h-6" />, title: "Gratis Ongkir", sub: "Min. 500rb" },
                { icon: <RotateCcw className="w-6 h-6" />, title: "30 Hari Retur", sub: "Mudah" },
                { icon: <Award className="w-6 h-6" />, title: "100% Original", sub: "Garansi" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 py-6 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10">
                  <span className="text-[#F77F00]">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-[#212529] dark:text-white">{badge.title}</span>
                  <span className="text-[9px] text-[#6C757D] dark:text-neutral-500 font-bold">{badge.sub}</span>
                </div>
              ))}
            </div>


          </motion.div>
        </div>

        {/* SECTION: ULASAN */}
        <section ref={reviewRef} className="mt-32 pt-16 border-t border-black/10 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#212529] dark:text-white mb-4">Ulasan Lapangan</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={p.rating} size="md" />
                  <span className="text-2xl font-black text-[#212529] dark:text-white">{p.rating}</span>
                </div>
                <span className="text-sm text-[#6C757D] dark:text-neutral-500 font-bold">dari {p.reviewCount} ulasan</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 font-black uppercase tracking-widest">Filter:</span>
              {["helpful", "newest"].map(opt => (
                <button
                  key={opt} onClick={() => setReviewSort(opt)}
                  className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 border transition-all ${reviewSort === opt ? "bg-[#212529] dark:bg-white text-white dark:text-black border-[#212529] dark:border-white" : "border-black/20 dark:border-white/20 text-[#6C757D] dark:text-neutral-400 hover:border-[#F77F00]"
                    }`}
                >
                  {opt === "helpful" ? "Top Intel" : "Terbaru"}
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
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-8 hover:border-[#F77F00] transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#212529] dark:bg-white flex items-center justify-center text-sm font-black text-white dark:text-black">
                      {rev.avatar}
                    </div>
                    <div>
                      <span className="text-base font-black text-[#212529] dark:text-white block uppercase tracking-widest">{rev.name}</span>
                      <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 font-black uppercase tracking-widest">Ukuran: {rev.size} • {rev.date}</span>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-sm text-[#212529] dark:text-white leading-relaxed font-mono mb-8">"{rev.text}"</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/10 dark:border-white/10">
                  {rev.hasPhoto && (
                    <div className="flex items-center gap-2 text-[10px] text-[#F77F00] font-black uppercase tracking-widest">
                      <ImageIcon className="w-4 h-4" /> Ada Visual
                    </div>
                  )}
                  <button className="flex items-center gap-2 text-[10px] text-[#6C757D] dark:text-neutral-500 hover:text-[#F77F00] transition-colors font-black uppercase tracking-widest">
                    <ThumbsUp className="w-4 h-4" /> {rev.helpful} Terbantu
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {!showAllReviews && p.reviews.length > 2 && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => setShowAllReviews(true)} className="px-12 py-5 bg-transparent border-2 border-[#212529] dark:border-white text-xs font-black uppercase tracking-widest text-[#212529] dark:text-white hover:bg-[#212529] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                Dekripsi Semua Ulasan
              </button>
            </div>
          )}
        </section>

        {/* SECTION: TERKAIT */}
        <section ref={relatedRef} className="mt-32 pt-16 border-t border-black/10 dark:border-white/10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#212529] dark:text-white">Gear Alternatif</h2>
            <Link href="/katalog" className="text-[10px] font-black text-[#F77F00] uppercase tracking-widest hover:text-orange-400 transition-colors flex items-center gap-2">
              Katalog Lengkap <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {p.relatedProducts.map((rp, idx) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 40 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/produk/${rp.id}`} className="group flex flex-col">
                  <div className="relative aspect-square bg-[#e9ecef] dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden mb-4">
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#F77F00]/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-[#212529] dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Inspect
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-tight mb-2 text-[#212529] dark:text-white group-hover:text-[#F77F00] transition-colors line-clamp-1">{rp.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <RatingStars rating={rp.rating} />
                    <span className="text-[9px] text-[#6C757D] dark:text-neutral-500 font-bold">{rp.rating}</span>
                  </div>
                  <span className="text-sm font-black text-[#212529] dark:text-white">{formatRupiah(rp.price)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      
      {/* FOOTER GLOBAL */}
      <Footer />

      {/* Guest Alert Toast */}
      <AnimatePresence>
        {guestAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4"
          >
            <ShieldCheck className="w-6 h-6" />
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Akses Terbatas</p>
              <p className="text-[10px] font-mono opacity-80">Silakan login untuk bertransaksi.</p>
            </div>
            <Link href="/login" className="ml-4 px-4 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-neutral-100 transition-colors">
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
