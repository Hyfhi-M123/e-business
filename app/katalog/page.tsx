"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Filter, ChevronDown, ChevronRight, ShoppingBag, ArrowUpRight, Search, Menu, 
  Star, Heart, X, Grid3X3, List, SlidersHorizontal, ChevronUp, Package
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import Link from "next/link";

// ==========================================
// DATA PRODUK LENGKAP (Nantinya dari Supabase)
// ==========================================
const ALL_PRODUCTS = [
  { id: "101", name: "Vertex Summit Tent", category: "Tenda", price: 3450000, originalPrice: 4200000, tag: "Ultralight", rating: 4.9, reviews: 87, sold: 342, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" },
  { id: "102", name: "Timberline X-Coat Arctic", category: "Pakaian", price: 1200000, originalPrice: 1800000, tag: "Thermal", rating: 4.8, reviews: 124, sold: 892, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80" },
  { id: "103", name: "AeroStep Mountain Boot", category: "Sepatu", price: 2150000, originalPrice: 2150000, tag: "GORE-TEX", rating: 4.7, reviews: 203, sold: 1540, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { id: "104", name: "Polaris Compass Pro", category: "Navigasi", price: 450000, originalPrice: 600000, tag: "Akurasi 99%", rating: 4.6, reviews: 56, sold: 230, image: "https://images.unsplash.com/photo-1504376830547-506dedee1643?w=600&q=80" },
  { id: "105", name: "Everest Sleeping Bag", category: "Tenda", price: 1800000, originalPrice: 2200000, tag: "-15°C Rated", rating: 4.9, reviews: 167, sold: 678, image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&q=80" },
  { id: "106", name: "Titanium Cookset Elite", category: "Alat Masak", price: 850000, originalPrice: 850000, tag: "Tahan Karat", rating: 4.5, reviews: 89, sold: 445, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
  { id: "107", name: "Storm Shell V2 Jacket", category: "Pakaian", price: 980000, originalPrice: 1400000, tag: "Windproof", rating: 4.6, reviews: 78, sold: 310, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { id: "108", name: "Glacier Down Parka", category: "Pakaian", price: 1500000, originalPrice: 1500000, tag: "800-Fill", rating: 4.9, reviews: 201, sold: 920, image: "https://images.unsplash.com/photo-1532054950669-026859e2185c?w=600&q=80" },
  { id: "109", name: "Summit Fleece Pro", category: "Pakaian", price: 650000, originalPrice: 750000, tag: "Midlayer", rating: 4.7, reviews: 145, sold: 780, image: "https://images.unsplash.com/photo-1495103033382-fe343886b671?w=600&q=80" },
  { id: "110", name: "Trailblazer 55L Pack", category: "Tas", price: 2800000, originalPrice: 3500000, tag: "Ergonomic", rating: 4.8, reviews: 312, sold: 1100, image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80" },
  { id: "111", name: "NightVision Headlamp", category: "Navigasi", price: 380000, originalPrice: 380000, tag: "1200 Lumens", rating: 4.4, reviews: 94, sold: 560, image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80" },
  { id: "112", name: "Carbon Trekking Poles", category: "Navigasi", price: 1250000, originalPrice: 1600000, tag: "Ultralight", rating: 4.8, reviews: 176, sold: 890, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80" },
];

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
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function KatalogPage() {
  // State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("popular");
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });

  // Toggle wishlist
  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Quick add to cart
  const quickAdd = (id: string) => {
    setAddedItems(prev => [...prev, id]);
    setTimeout(() => setAddedItems(prev => prev.filter(x => x !== id)), 2000);
  };

  // Filter + Sort Logic
  const processed = useMemo(() => {
    let items = [...ALL_PRODUCTS];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }

    // Category
    if (activeCategory !== "Semua") {
      items = items.filter(p => p.category === activeCategory);
    }

    // Price Range
    items = items.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low": items.sort((a, b) => a.price - b.price); break;
      case "price-high": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "popular": items.sort((a, b) => b.sold - a.sold); break;
      default: break;
    }

    return items;
  }, [search, activeCategory, sortBy, priceRange]);

  const visibleProducts = processed.slice(0, visibleCount);
  const hasMore = visibleCount < processed.length;

  // Active filters for tags
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (activeCategory !== "Semua") activeFilters.push({ label: activeCategory, onRemove: () => setActiveCategory("Semua") });
  if (search.trim()) activeFilters.push({ label: `"${search}"`, onRemove: () => setSearch("") });
  if (priceRange[0] > 0 || priceRange[1] < 5000000) activeFilters.push({ label: `${formatRupiah(priceRange[0])} - ${formatRupiah(priceRange[1])}`, onRemove: () => setPriceRange([0, 5000000]) });

  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans pt-24 pb-20 selection:bg-[#F77F00] dark:bg-orange-500 selection:text-[#212529] dark:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-[#F8F9FA] dark:bg-neutral-950 border-b border-[#1B4332]/10 dark:border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer">
            <Menu className="w-4 h-4" />
          </div>
          <Link href="/" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
            TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full animate-pulse"></span>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Search className="w-5 h-5 text-[#212529] dark:text-white cursor-pointer hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
          <Link href="/produk/101" className="relative cursor-pointer group">
            <ShoppingBag className="w-5 h-5 text-[#212529] dark:text-white group-hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
            <span className="absolute -top-1 -right-2 bg-[#F77F00] dark:bg-orange-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
        </div>
      </nav>

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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
              Katalog<br/><span className="text-[#ADB5BD] dark:text-neutral-600">Ekspedisi.</span>
            </h1>
            <p className="text-[#6C757D] dark:text-neutral-400 max-w-md text-sm leading-relaxed">
              {processed.length} produk peralatan adventure yang telah lolos uji di kondisi ekstrem.
            </p>
          </motion.div>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-[400px] relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C757D] dark:text-neutral-500" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk, kategori, atau fitur..."
              className="w-full bg-white dark:bg-neutral-900 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white pl-12 pr-4 py-4 text-sm font-medium placeholder:text-[#ADB5BD] dark:text-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-[#F77F00] dark:ring-orange-500/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors" />
              </button>
            )}
          </motion.div>
        </div>

        {/* TOOLBAR: Filter + Sort + View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-8 border-b border-[#1B4332]/10 dark:border-white/5"
        >
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-[#6C757D] dark:text-neutral-500 flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                className={`text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? "bg-white text-neutral-950" 
                    : "bg-white dark:bg-neutral-900 text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white hover:bg-[#E9ECEF] dark:bg-neutral-800 border border-[#1B4332]/10 dark:border-white/5"
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
                className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-[#1B4332]/10 dark:border-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Harga <ChevronDown className={`w-3 h-3 transition-transform ${showPriceFilter ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showPriceFilter && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-12 bg-white dark:bg-neutral-900 border border-[#DEE2E6] dark:border-white/10 p-5 rounded-xl shadow-2xl z-40 min-w-[280px]"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 block mb-4">Rentang Harga</span>
                    <div className="flex items-center gap-3 mb-4">
                      <input 
                        type="number" value={priceRange[0]} step={100000}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-[#E9ECEF] dark:bg-neutral-800 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[#6C757D] dark:text-neutral-500 text-sm">—</span>
                      <input 
                        type="number" value={priceRange[1]} step={100000}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-[#E9ECEF] dark:bg-neutral-800 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button onClick={() => setShowPriceFilter(false)} className="w-full bg-[#F77F00] dark:bg-orange-500 text-neutral-950 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#E06F00] dark:hover:bg-orange-400 transition-colors">
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
                className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-[#1B4332]/10 dark:border-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors"
              >
                Urutkan <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-12 bg-white dark:bg-neutral-900 border border-[#DEE2E6] dark:border-white/10 rounded-xl shadow-2xl z-40 min-w-[200px] overflow-hidden"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button 
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          sortBy === opt.value ? "bg-[#F77F00] dark:bg-[#F77F00]/10 dark:bg-orange-500/10 text-[#F77F00] dark:text-orange-500" : "text-[#6C757D] dark:text-neutral-400 hover:bg-[#E9ECEF] dark:bg-white/5 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white"
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
            <div className="hidden md:flex items-center bg-white dark:bg-neutral-900 border border-[#1B4332]/10 dark:border-white/5 overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-white text-neutral-950" : "text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-white text-neutral-950" : "text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white"}`}>
                <List className="w-4 h-4" />
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
                  className="flex items-center gap-2 bg-[#F77F00] dark:bg-[#F77F00]/10 dark:bg-orange-500/10 text-[#F77F00] dark:text-orange-500 border border-orange-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#F77F00] dark:bg-orange-500/20 transition-colors"
                >
                  {f.label} <X className="w-3 h-3" />
                </motion.button>
              ))}
              <button 
                onClick={() => { setActiveCategory("Semua"); setSearch(""); setPriceRange([0, 5000000]); }}
                className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors underline"
              >
                Hapus Semua
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT GRID / LIST */}
        <div ref={gridRef}>
          {processed.length === 0 ? (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Package className="w-16 h-16 text-[#DEE2E6] dark:text-neutral-700 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Tidak Ditemukan</h3>
              <p className="text-[#6C757D] dark:text-neutral-500 max-w-md mb-8">Tidak ada produk yang cocok dengan filter Anda. Coba ubah kategori atau kata kunci pencarian.</p>
              <button 
                onClick={() => { setActiveCategory("Semua"); setSearch(""); setPriceRange([0, 5000000]); }}
                className="px-8 py-3 bg-[#F77F00] dark:bg-orange-500 text-neutral-950 font-black uppercase tracking-widest text-sm hover:bg-[#E06F00] dark:hover:bg-orange-400 transition-colors"
              >
                Reset Filter
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer} initial="hidden" animate={gridInView ? "visible" : "hidden"}
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col gap-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product) => {
                  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
                  const isWished = wishlist.includes(product.id);
                  const isAdded = addedItems.includes(product.id);

                  return viewMode === "grid" ? (
                    /* ====== GRID MODE CARD ====== */
                    <motion.div
                      key={product.id} layout variants={cardReveal}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group cursor-pointer bg-white dark:bg-neutral-900/50 border border-[#1B4332]/10 dark:border-white/5 overflow-hidden hover:border-orange-500/20 transition-colors"
                    >
                      {/* Image */}
                      <Link href={`/produk/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-white dark:bg-neutral-900">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                        
                        {/* Badge Diskon */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-red-600 text-[#212529] dark:text-white text-[10px] font-black uppercase tracking-widest">
                            -{discount}%
                          </div>
                        )}
                        
                        {/* Tag */}
                        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-[#F8F9FA] dark:bg-neutral-950/70 backdrop-blur-md border border-[#DEE2E6] dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-neutral-200">
                          {product.tag}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.preventDefault(); quickAdd(product.id); }}
                            className={`flex-1 py-3 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors ${
                              isAdded ? "bg-green-600 text-[#212529] dark:text-white" : "bg-white text-neutral-950 hover:bg-[#F77F00] dark:bg-orange-500"
                            }`}
                          >
                            {isAdded ? "✓ Ditambahkan" : <><ShoppingBag className="w-3.5 h-3.5" /> Quick Add</>}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                            className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                              isWished ? "bg-red-500 border-red-500 text-[#212529] dark:text-white" : "bg-[#F8F9FA] dark:bg-neutral-950/50 backdrop-blur-md border-white/20 text-[#212529] dark:text-white hover:border-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWished ? "fill-white" : ""}`} />
                          </motion.button>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-[#F77F00] dark:fill-orange-500 text-[#F77F00] dark:text-orange-500" : "fill-[#DEE2E6] dark:fill-neutral-700 text-[#DEE2E6] dark:text-neutral-700"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 font-bold">{product.rating} ({product.reviews})</span>
                        </div>
                        
                        <Link href={`/produk/${product.id}`}>
                          <h3 className="text-sm font-bold uppercase tracking-tight mb-3 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors leading-tight">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-end gap-2">
                          <span className="text-lg font-black text-[#212529] dark:text-white tracking-tight">{formatRupiah(product.price)}</span>
                          {discount > 0 && <span className="text-xs text-[#6C757D] dark:text-neutral-500 line-through">{formatRupiah(product.originalPrice)}</span>}
                        </div>
                        <span className="text-[10px] text-[#ADB5BD] dark:text-neutral-600 font-mono mt-1 block">{product.sold} terjual</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* ====== LIST MODE CARD ====== */
                    <motion.div
                      key={product.id} layout variants={cardReveal}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex bg-white dark:bg-neutral-900/50 border border-[#1B4332]/10 dark:border-white/5 overflow-hidden hover:border-orange-500/20 transition-colors"
                    >
                      <Link href={`/produk/${product.id}`} className="relative w-48 md:w-64 flex-shrink-0 overflow-hidden bg-white dark:bg-neutral-900">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-red-600 text-[#212529] dark:text-white text-[9px] font-black uppercase tracking-widest">
                            -{discount}%
                          </div>
                        )}
                      </Link>
                      
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-[#F77F00] dark:text-orange-500 uppercase tracking-widest">{product.category}</span>
                            <span className="text-[9px] font-mono text-[#ADB5BD] dark:text-neutral-600 uppercase tracking-widest">{product.tag}</span>
                          </div>
                          <Link href={`/produk/${product.id}`}>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors">{product.name}</h3>
                          </Link>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-[#F77F00] dark:fill-orange-500 text-[#F77F00] dark:text-orange-500" : "fill-[#DEE2E6] dark:fill-neutral-700 text-[#DEE2E6] dark:text-neutral-700"}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#6C757D] dark:text-neutral-500 font-bold">{product.rating} ({product.reviews}) • {product.sold} terjual</span>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">{formatRupiah(product.price)}</span>
                            {discount > 0 && <span className="text-sm text-[#6C757D] dark:text-neutral-500 line-through">{formatRupiah(product.originalPrice)}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleWishlist(product.id)}
                              className={`w-10 h-10 flex items-center justify-center border transition-colors ${isWished ? "bg-red-500 border-red-500 text-[#212529] dark:text-white" : "border-[#DEE2E6] dark:border-white/10 text-[#6C757D] dark:text-neutral-500 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white"}`}
                            >
                              <Heart className={`w-4 h-4 ${isWished ? "fill-white" : ""}`} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => quickAdd(product.id)}
                              className={`px-6 py-2.5 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors ${
                                isAdded ? "bg-green-600 text-[#212529] dark:text-white" : "bg-[#F77F00] dark:bg-orange-500 text-neutral-950 hover:bg-[#E06F00] dark:hover:bg-orange-400"
                              }`}
                            >
                              {isAdded ? "✓ Added" : <><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</>}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* LOAD MORE / PAGINATION */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-16 gap-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
              Menampilkan {visibleCount} dari {processed.length} produk
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-10 py-4 border border-[#DEE2E6] dark:border-white/10 text-sm font-black uppercase tracking-widest hover:bg-white hover:text-neutral-950 transition-all duration-300 flex items-center gap-3"
            >
              Muat Lebih Banyak <ChevronDown className="w-4 h-4" />
            </motion.button>
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
    </main>
  );
}
