"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Filter, ChevronDown, ChevronRight, ShoppingBag, ArrowUpRight, Search, Menu, 
  Star, Heart, X, Grid3X3, List, SlidersHorizontal, ChevronUp, Package, ShieldCheck
} from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { supabase } from "../lib/supabase";
import QuickAddModal from "../components/QuickAddModal";

const CATEGORIES = ["Semua", "Pakaian", "Tenda", "Sepatu", "Navigasi", "Tas", "Alat Masak"];
const SORT_OPTIONS = [
  { value: "popular", label: "Terpopuler" },
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Harga Terendah" },
  { value: "price-high", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// Animasi Variants
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};
const cardReveal = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function KatalogPage() {
  const { addToCart } = useCart();
  const { user } = useAuth(); // Action Guard Listener
  const searchParams = useSearchParams();
  
  // State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeAudience, setActiveAudience] = useState("Semua");
  const [sortBy, setSortBy] = useState("popular");
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [quickAddProduct, setQuickAddProduct] = useState<any>(null);
  
  // Toast Alert State for Guests
  const [guestAlert, setGuestAlert] = useState(false);

  // Database State
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  
  // Infinite Scroll Observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        const formattedData = data.map((item: any) => ({
          ...item,
          originalPrice: item.original_price
        }));
        setAllProducts(formattedData);
      } catch (error: any) {
        console.error("Error fetching products:", error.message || error);
      }
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    // Ambil parameter dari URL secara dinamis (bereaksi terhadap perubahan rute Next.js)
    const cat = searchParams.get("category");
    const q = searchParams.get("search");
    
    if (cat && CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
    }
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  const showGuestWarning = () => {
    setGuestAlert(true);
    setTimeout(() => setGuestAlert(false), 3000);
  };

  // Toggle wishlist
  const handleToggleWishlist = (product: any) => {
    if (!user) return showGuestWarning();
    const discount = product.originalPrice && product.originalPrice > product.price 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0;
    
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      discount: discount
    });
  };

  // Quick add to cart
  const openQuickAdd = (product: any) => {
    if (!user) return showGuestWarning();
    setQuickAddProduct(product);
  };

  const handleConfirmQuickAdd = (cartItem: any) => {
    setAddedItems(prev => [...prev, cartItem.id]);
    addToCart(cartItem);
    setTimeout(() => setAddedItems(prev => prev.filter(x => x !== cartItem.id)), 2000);
  };

  // Filter + Sort Logic
  const processed = useMemo(() => {
    let items = [...allProducts];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.category && p.category.toLowerCase().includes(q)) || 
        (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== "Semua") {
      items = items.filter(p => p.category === activeCategory);
    }

    // Audience (Gender)
    if (activeAudience !== "Semua") {
      items = items.filter(p => p.gender === activeAudience || p.gender === "Unisex");
    }

    // Price Range
    items = items.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low": items.sort((a, b) => a.price - b.price); break;
      case "price-high": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => a.rating - b.rating); break;
      case "popular": items.sort((a, b) => b.sold - a.sold); break;
      default: break;
    }

    return items;
  }, [allProducts, search, activeCategory, sortBy, priceRange]);

  const visibleProducts = processed.slice(0, visibleCount);
  const hasMore = visibleCount < processed.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setTimeout(() => {
            setVisibleCount(prev => prev + 6);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore]);

  // Active filters for tags
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (activeCategory !== "Semua") activeFilters.push({ label: activeCategory, onRemove: () => setActiveCategory("Semua") });
  if (activeAudience !== "Semua") activeFilters.push({ label: activeAudience, onRemove: () => setActiveAudience("Semua") });
  if (search.trim()) activeFilters.push({ label: `"${search}"`, onRemove: () => setSearch("") });
  if (priceRange[0] > 0 || priceRange[1] < 5000000) activeFilters.push({ label: `${formatRupiah(priceRange[0])} - ${formatRupiah(priceRange[1])}`, onRemove: () => setPriceRange([0, 5000000]) });

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans pt-32 lg:pt-36 pb-20 selection:bg-[#F77F00] dark:selection:bg-orange-500 selection:text-[#212529] dark:selection:text-white">
      
      {/* NAVBAR */}
      <Navbar />

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">

        {/* BREADCRUMB */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mb-8"
        >
          <Link href="/" className="hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">Katalog</span>
        </motion.div>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
              Katalog<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F77F00] to-orange-400">Ekspedisi.</span>
            </h1>
            <p className="text-[#6C757D] dark:text-neutral-500 max-w-md text-[10px] font-mono tracking-widest uppercase mt-6">
              // {processed.length} TACTICAL GEAR FOUND
            </p>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-[400px] relative group"
          >
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#212529] dark:text-white group-focus-within:text-[#F77F00] dark:group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH GEAR..."
              className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 text-[#212529] dark:text-white pl-8 pr-8 py-3 text-[11px] font-black tracking-widest uppercase placeholder:text-neutral-500 focus:outline-none focus:border-[#F77F00] dark:focus:border-orange-500 transition-all duration-300"
            />
            <AnimatePresence>
              {search && (
                <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSearch("")} className="absolute right-0 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-neutral-500 hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* AUDIENCE SELECTION CARDS (Pria, Wanita, Anak) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16 bg-black/10 dark:bg-white/10 p-1"
        >
          {[
            { id: "Pria", label: "MENS", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80" },
            { id: "Wanita", label: "WOMENS", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
            { id: "Anak", label: "YOUTH", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80" }
          ].map((item) => (
            <motion.div
              key={item.id}
              onClick={() => { setActiveAudience(item.id); setVisibleCount(6); }}
              className={`relative h-48 md:h-64 overflow-hidden cursor-pointer group transition-all duration-500 bg-black ${
                activeAudience === item.id ? "ring-2 ring-[#F77F00] dark:ring-orange-500 ring-inset z-10" : "hover:opacity-90"
              }`}
            >
              <img src={item.img} alt={item.label} className={`w-full h-full object-cover transition-all duration-700 ${activeAudience === item.id ? "scale-105 opacity-60" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-60"}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-2xl transition-colors duration-300 ${activeAudience === item.id ? "text-[#F77F00] dark:text-orange-500" : "text-white group-hover:text-[#F77F00] dark:group-hover:text-orange-500"}`}>{item.label}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* TOOLBAR: Filter + Sort + View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-black/10 dark:border-white/10"
        >
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-neutral-500 flex-shrink-0 mr-2" />
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                    ? "bg-[#212529] dark:bg-white text-white dark:text-[#212529] border-[#212529] dark:border-white" 
                    : "bg-transparent text-neutral-500 border-black/10 dark:border-white/10 hover:border-[#F77F00] hover:text-[#F77F00] dark:hover:border-orange-500 dark:hover:text-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Side: Sort + Price + View */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Price Filter */}
            <div className="relative">
              <button 
                onClick={() => { setShowPriceFilter(!showPriceFilter); setShowSort(false); }}
                className="flex items-center gap-2 bg-transparent border border-black/10 dark:border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:border-[#F77F00] hover:text-[#F77F00] dark:hover:border-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                <SlidersHorizontal className="w-3 h-3" /> Harga <ChevronDown className={`w-3 h-3 transition-transform ${showPriceFilter ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showPriceFilter && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-10 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-5 shadow-2xl z-40 min-w-[280px]"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-4">Rentang Harga</span>
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="number" value={priceRange[0]} step={100000}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#F77F00] dark:focus:border-orange-500 text-[#212529] dark:text-white px-3 py-2 text-[11px] font-mono font-bold focus:outline-none transition-colors"
                      />
                      <span className="text-neutral-500 text-sm">—</span>
                      <input 
                        type="number" value={priceRange[1]} step={100000}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#F77F00] dark:focus:border-orange-500 text-[#212529] dark:text-white px-3 py-2 text-[11px] font-mono font-bold focus:outline-none transition-colors"
                      />
                    </div>
                    <button onClick={() => setShowPriceFilter(false)} className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-[#F77F00] dark:hover:bg-orange-500 hover:text-white dark:hover:text-white py-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                      Terapkan
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowSort(!showSort); setShowPriceFilter(false); }}
                className="flex items-center gap-2 bg-transparent border border-black/10 dark:border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:border-[#F77F00] hover:text-[#F77F00] dark:hover:border-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                Urutkan <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-10 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 shadow-2xl z-40 min-w-[200px] overflow-hidden"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button 
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                          sortBy === opt.value ? "bg-[#F77F00]/10 text-[#F77F00] dark:text-orange-500 border-l-2 border-[#F77F00] dark:border-orange-500" : "text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-black/10 dark:border-white/10 overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#212529] dark:bg-white text-white dark:text-[#212529]" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}>
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#212529] dark:bg-white text-white dark:text-[#212529]" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ACTIVE FILTER TAGS */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 mb-8 overflow-hidden"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 flex-shrink-0">Filter Aktif:</span>
              {activeFilters.map((f, i) => (
                <motion.button
                  key={i} layout
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={f.onRemove}
                  className="flex items-center gap-2 bg-[#F77F00]/10 dark:bg-orange-500/10 text-[#F77F00] dark:text-orange-500 border border-[#F77F00]/20 dark:border-orange-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#F77F00]/20 dark:hover:bg-orange-500/20 transition-colors"
                >
                  {f.label} <X className="w-3 h-3" />
                </motion.button>
              ))}
              <button 
                onClick={() => { setActiveCategory("Semua"); setActiveAudience("Semua"); setSearch(""); setPriceRange([0, 5000000]); }}
                className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors underline"
              >
                Hapus Semua
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT GRID / LIST */}
        <div ref={gridRef}>
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="w-8 h-8 border-4 border-[#F77F00] dark:border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
                MEMUAT DATA...
              </span>
            </motion.div>
          ) : processed.length === 0 ? (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Package className="w-16 h-16 text-[#DEE2E6] dark:text-neutral-700 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Tidak Ditemukan</h3>
              <p className="text-[#6C757D] dark:text-neutral-500 max-w-md mb-8">Tidak ada produk yang cocok dengan filter Anda. Coba ubah kategori atau kata kunci pencarian.</p>
              <button 
                onClick={() => { setActiveCategory("Semua"); setActiveAudience("Semua"); setSearch(""); setPriceRange([0, 5000000]); }}
                className="px-8 py-3 bg-[#F77F00] dark:bg-orange-500 text-neutral-950 font-black uppercase tracking-widest text-sm hover:bg-[#E06F00] dark:hover:bg-orange-400 transition-colors"
              >
                Reset Filter
              </button>
            </motion.div>
          ) : (
            <div 
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col gap-6"
              }
            >
                {visibleProducts.map((product, idx) => {
                  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
                  const isWished = isInWishlist(product.id);
                  const isAdded = addedItems.includes(product.id);

                  return viewMode === "grid" ? (
                    /* ====== GRID MODE CARD ====== */
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex flex-col cursor-pointer bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden hover:border-[#F77F00] dark:hover:border-orange-500 hover:shadow-2xl transition-all relative h-full"
                    >
                      {/* Image */}
                      <Link href={`/produk/${product.id}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-black/5 dark:bg-white/5">
                        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge Diskon */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#F77F00] dark:bg-orange-500 text-neutral-950 text-[10px] font-black uppercase tracking-widest">
                            -{discount}%
                          </div>
                        )}
                        
                        {/* Tag */}
                        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-black/10 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-neutral-950 dark:text-white">
                          {product.tag}
                        </div>

                        {/* Hover Overlay Buttons */}
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.preventDefault(); openQuickAdd(product); }}
                            className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors border ${
                              isAdded ? "bg-emerald-500 border-emerald-500 text-neutral-950" : "bg-black/50 dark:bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-[#F77F00] hover:border-[#F77F00] hover:text-black dark:hover:bg-orange-500 dark:hover:border-orange-500"
                            }`}
                          >
                            {isAdded ? "✓ ADDED" : <><ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD</>}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.preventDefault(); handleToggleWishlist(product); }}
                            className={`w-11 h-11 flex items-center justify-center border transition-colors ${
                              isWished ? "bg-red-500 border-red-500 text-white" : "bg-black/50 dark:bg-black/50 backdrop-blur-md border-white/20 text-white hover:border-red-500 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
                          </motion.button>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-[#F77F00] dark:fill-orange-500 text-[#F77F00] dark:text-orange-500" : "fill-neutral-300 dark:fill-neutral-800 text-neutral-300 dark:text-neutral-800"}`} />
                              ))}
                            </div>
                            <span className="text-[9px] text-neutral-500 font-mono tracking-widest">{product.sold > 0 ? `${product.sold} TERJUAL` : "BARU"}</span>
                          </div>
                          
                          <Link href={`/produk/${product.id}`}>
                            <h3 className="text-sm font-black uppercase tracking-tight mb-4 group-hover:text-[#F77F00] dark:group-hover:text-orange-500 transition-colors leading-snug">
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            {discount > 0 && <span className="text-[10px] text-neutral-500 line-through mb-0.5">{formatRupiah(product.originalPrice)}</span>}
                            <span className="text-lg font-black text-[#212529] dark:text-white tracking-tighter">{formatRupiah(product.price)}</span>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-[#F77F00] dark:group-hover:text-orange-500 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ====== LIST MODE CARD ====== */
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex flex-col md:flex-row bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden hover:border-[#F77F00] dark:hover:border-orange-500 hover:shadow-2xl transition-all h-auto md:h-56"
                    >
                      <Link href={`/produk/${product.id}`} className="relative w-full md:w-56 h-64 md:h-full flex-shrink-0 overflow-hidden bg-black/5 dark:bg-white/5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#F77F00] dark:bg-orange-500 text-neutral-950 text-[10px] font-black uppercase tracking-widest">
                            -{discount}%
                          </div>
                        )}
                      </Link>
                      
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-[#F77F00] dark:text-orange-500 uppercase tracking-widest">{product.category}</span>
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest border border-black/10 dark:border-white/10 px-2 py-0.5">{product.tag}</span>
                          </div>
                          <Link href={`/produk/${product.id}`}>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-[#F77F00] dark:group-hover:text-orange-500 transition-colors">{product.name}</h3>
                          </Link>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-[#F77F00] dark:fill-orange-500 text-[#F77F00] dark:text-orange-500" : "fill-neutral-300 dark:fill-neutral-800 text-neutral-300 dark:text-neutral-800"}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono tracking-widest">{product.rating} ({product.reviews}) • {product.sold > 0 ? `${product.sold} TERJUAL` : "BARU"}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4 md:mt-0">
                          <div className="flex flex-col">
                            {discount > 0 && <span className="text-[10px] text-neutral-500 line-through mb-0.5">{formatRupiah(product.originalPrice)}</span>}
                            <span className="text-2xl font-black text-[#212529] dark:text-white tracking-tighter">{formatRupiah(product.price)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.preventDefault(); handleToggleWishlist(product); }}
                              className={`w-10 h-10 flex items-center justify-center border transition-colors ${isWished ? "bg-red-500 border-red-500 text-white" : "border-black/20 dark:border-white/20 text-neutral-500 hover:border-red-500 hover:text-red-500"}`}
                            >
                              <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.preventDefault(); openQuickAdd(product); }}
                              className={`px-6 py-2.5 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors border ${
                                isAdded ? "bg-emerald-500 border-emerald-500 text-neutral-950" : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white"
                              }`}
                            >
                              {isAdded ? "✓ ADDED" : <><ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD</>}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>

        {/* INFINITE SCROLL TRIGGER */}
        {hasMore && (
          <motion.div 
            ref={loadMoreRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center mt-16 mb-8 gap-4 h-24"
          >
            <div className="w-5 h-5 border-2 border-transparent border-t-[#F77F00] dark:border-t-orange-500 border-l-[#F77F00] dark:border-l-orange-500 rounded-full animate-spin"></div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
              MENGAMBIL DATA... ({visibleCount} / {processed.length})
            </span>
          </motion.div>
        )}

        {/* Scroll to Top */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white dark:bg-neutral-900 border border-[#DEE2E6] dark:border-white/10 flex items-center justify-center hover:bg-[#F77F00] dark:bg-orange-500 hover:text-neutral-950 transition-colors z-40 shadow-2xl"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>

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
              <p className="text-[10px] font-mono opacity-80">Silakan login untuk menambahkan ke keranjang.</p>
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
