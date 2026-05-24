"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Star, ArrowUpRight, AlertTriangle, Clock, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import QuickAddModal from "../components/QuickAddModal";

// ==========================================
// DATA PRODUK (Filter Khusus Diskon)
// ==========================================
// DATA PRODUK PROMO AKAN DI-FETCH DARI DATABASE
// ==========================================

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// Animasi Variants
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
const cardReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function PromoPage() {
  const { addToCart } = useCart();
  const { user } = useAuth(); // Action Guard Listener
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [promoProducts, setPromoProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [guestAlert, setGuestAlert] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<any>(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; // Selesai
      });
    }, 1000);

    const fetchPromoProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const discounted = data.filter((p: any) => p.original_price > p.price).map((item: any) => ({
            ...item,
            originalPrice: item.original_price
          }));
          setPromoProducts(discounted);
        }
      } catch (err) {
        console.error("Failed to fetch promo products:", err);
      }
      setIsLoading(false);
    };

    fetchPromoProducts();

    return () => clearInterval(timer);
  }, []);

  const showGuestWarning = () => {
    setGuestAlert(true);
    setTimeout(() => setGuestAlert(false), 3000);
  };

  const openQuickAdd = (product: any) => {
    if (!user) return showGuestWarning();
    setQuickAddProduct(product);
  };

  const handleConfirmQuickAdd = (cartItem: any) => {
    setAddedItems(prev => [...prev, cartItem.id]);
    addToCart(cartItem);
    setTimeout(() => setAddedItems(prev => prev.filter(x => x !== cartItem.id)), 2000);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-red-600 selection:text-white transition-colors duration-300">
      <Navbar />

      {/* HERO PROMO (MINIMALIST BANNER) */}
      <div className="w-full pt-28 pb-8 px-6 md:px-12 border-b border-black/10 dark:border-white/10 bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          
          {/* Kiri: Judul */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-600/10 text-red-500 text-[9px] font-black tracking-[0.2em] uppercase mb-4 border border-red-500/20">
              <AlertTriangle className="w-3 h-3" />
              Limited Time Event
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#212529] dark:text-white leading-none">
              Archive <span className="text-red-600 dark:text-red-500">Sale</span>
            </h1>
            <p className="text-[#6C757D] dark:text-neutral-400 font-mono text-[10px] tracking-widest uppercase mt-3">
              Potongan harga hingga 40% untuk perlengkapan musim lalu.
            </p>
          </motion.div>

          {/* Kanan: Mini Countdown */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-4 shadow-sm"
          >
            <div className="flex flex-col mr-4">
              <span className="text-[9px] text-[#6C757D] dark:text-neutral-500 font-bold uppercase tracking-widest">Sale Ends In</span>
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-black tracking-widest uppercase">Timer</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-xl font-black tracking-tighter tabular-nums leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Hrs</span>
              </div>
              <span className="text-lg text-neutral-600 font-black mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl font-black tracking-tighter tabular-nums leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Min</span>
              </div>
              <span className="text-lg text-neutral-600 font-black mb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xl font-black tracking-tighter tabular-nums text-red-500 leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Sec</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* FILTER SIMPLE & PRODUCT GRID */}
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto pt-16">
        
        {/* Toolbar Minimalis */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-black/10 dark:border-white/10 pb-6 gap-6">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#212529] dark:text-white">Flash Deals</h2>
            <span className="text-[#6C757D] dark:text-neutral-500 font-mono text-[10px] ml-2">[{promoProducts.length} ITEMS]</span>
          </div>
          
          <div className="flex gap-2">
            <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-[#212529] text-white dark:bg-white dark:text-black border border-[#212529] dark:border-white">Diskon Terbesar</button>
            <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-transparent text-[#6C757D] dark:text-neutral-400 border border-black/10 dark:border-white/10 hover:border-[#212529] hover:text-[#212529] dark:hover:border-white dark:hover:text-white transition-colors">Terpopuler</button>
          </div>
        </div>

        {/* Grid Katalog Khusus Diskon */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {promoProducts.sort((a, b) => ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice)).map((product) => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              const isWished = isInWishlist(product.id);
              const isAdded = addedItems.includes(product.id);

            return (
              <motion.div
                key={product.id} variants={cardReveal}
                className="group flex flex-col cursor-pointer bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden hover:border-red-600 hover:shadow-xl transition-all relative h-full"
              >
                {/* Image */}
                <Link href={`/produk/${product.id}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-black/20">
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge Diskon Agresif */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest shadow-md dark:shadow-[0_0_15px_rgba(220,38,38,0.8)] flex items-center gap-1">
                    <Zap className="w-3 h-3" /> -{discount}%
                  </div>
                  
                  {/* Tag */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-300">
                    {product.tag}
                  </div>

                  {/* Hover Overlay Buttons */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.preventDefault(); openQuickAdd(product); }}
                      className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors border ${
                        isAdded ? "bg-emerald-500 border-emerald-500 text-neutral-950" : "bg-white/90 dark:bg-black/60 backdrop-blur-md border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
                    >
                      {isAdded ? "✓ ADDED" : <><ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD</>}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { 
                        e.preventDefault(); 
                        if(!user) return showGuestWarning();
                        toggleWishlist({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          category: product.category || "Promo",
                          discount: Math.round((1 - product.price / product.originalPrice) * 100)
                        }); 
                      }}
                      className={`w-11 h-11 flex items-center justify-center border transition-colors ${
                        isWished ? "bg-[#212529] border-[#212529] text-white dark:bg-white dark:border-white dark:text-black" : "bg-white/90 dark:bg-black/60 backdrop-blur-md border-black/20 dark:border-white/20 text-[#212529] dark:text-white hover:border-[#212529] hover:bg-[#212529] hover:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
                    </motion.button>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-white dark:bg-[#121212]">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-red-600 text-red-600 dark:fill-red-500 dark:text-red-500" : "fill-[#DEE2E6] text-[#DEE2E6] dark:fill-neutral-800 dark:text-neutral-800"}`} />
                        ))}
                      </div>
                      <span className="text-[9px] text-red-600 dark:text-red-500/70 font-mono tracking-widest">STOCK TERBATAS</span>
                    </div>
                    
                    <Link href={`/produk/${product.id}`}>
                      <h3 className="text-sm font-black uppercase tracking-tight mb-4 text-[#212529] dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 line-through mb-0.5">{formatRupiah(product.originalPrice)}</span>
                      <span className="text-xl font-black text-[#212529] dark:text-white tracking-tighter flex items-center gap-2">
                        {formatRupiah(product.price)}
                        <span className="text-[9px] text-red-600 dark:text-red-500 bg-red-600/10 dark:bg-red-500/10 px-1.5 py-0.5 border border-red-600/20 dark:border-red-500/20 tracking-widest">SAVE {formatRupiah(product.originalPrice - product.price)}</span>
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#ADB5BD] dark:text-neutral-600 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
            })}
          </motion.div>
        )}

      </div>
      
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
              <p className="text-[10px] font-mono opacity-80">Silakan login untuk menikmati Flash Sale.</p>
            </div>
            <Link href="/login" className="ml-4 px-4 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-neutral-100 transition-colors">
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickAddModal 
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        product={quickAddProduct}
        onAdd={handleConfirmQuickAdd}
      />
    </main>
  );
}
