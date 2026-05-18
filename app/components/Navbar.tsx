"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, ArrowRight, ChevronDown, User, X, Package, Mountain } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jika di halaman selain Home, navbar lebih baik selalu terlihat solid atau punya background blur sejak awal
  const isHome = pathname === "/";
  const navBackground = (isScrolled || !isHome)
    ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-sm text-[#212529] dark:text-white" 
    : "bg-transparent border-b border-black/10 dark:border-white/10 text-[#212529] dark:text-white";

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-500 ease-out ${navBackground}`}>
        
        {/* Kiri - Logo & Menu */}
        <div className="flex-1 flex items-center justify-start gap-6">
          <div 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 border border-black/20 dark:border-white/30 flex items-center justify-center rounded-full cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <Menu className="w-4 h-4" />
          </div>
          <Link href="/" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 cursor-pointer">
            <Mountain className="w-5 h-5 text-[#F77F00] dark:text-orange-500" />TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full animate-pulse"></span>
          </Link>
        </div>
        
        {/* Tengah - Navigasi (Tengah Sempurna) */}
        <div className={`hidden lg:flex items-center justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${(isScrolled || !isHome) ? "text-[#495057] dark:text-neutral-300" : "text-[#212529]/80 dark:text-white/80"}`}>
          
          {/* KATALOG with Mega Menu */}
          <div className="relative group/katalog py-6">
            <Link href="/katalog" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative flex items-center gap-1">
              Katalog <ChevronDown className="w-3 h-3 group-hover/katalog:-rotate-180 transition-transform duration-300" />
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover/katalog:w-full"></span>
            </Link>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[550px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-none p-6 opacity-0 invisible translate-y-4 group-hover/katalog:opacity-100 group-hover/katalog:visible group-hover/katalog:translate-y-0 transition-all duration-400 shadow-2xl z-50 flex gap-6 text-left cursor-default">
              <div className="flex-1 border-r border-black/10 dark:border-white/10 pr-6">
                <h4 className="text-[9px] text-[#F77F00] dark:text-orange-500 tracking-widest mb-4">KATEGORI GEAR</h4>
                <ul className="space-y-4 text-xs font-black text-[#212529] dark:text-white">
                  <li><Link href="/katalog?category=Pakaian" className="group/item flex justify-between items-center hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Jaket Ekspedisi <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" /></Link></li>
                  <li><Link href="/katalog?category=Tenda" className="group/item flex justify-between items-center hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Tenda & Shelter <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" /></Link></li>
                  <li><Link href="/katalog?category=Tas" className="group/item flex justify-between items-center hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Ransel Taktis <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" /></Link></li>
                  <li><Link href="/katalog?category=Sepatu" className="group/item flex justify-between items-center hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Sepatu Gunung <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" /></Link></li>
                </ul>
              </div>
              <Link href="/produk/102" className="flex-1 flex flex-col justify-between group/feature">
                <div>
                  <h4 className="text-[9px] text-[#F77F00] dark:text-orange-500 tracking-widest mb-2 group-hover/feature:text-orange-600 transition-colors">FEATURED INOVATION</h4>
                  <p className="text-sm font-black text-[#212529] dark:text-white mb-2 uppercase leading-tight group-hover/feature:text-[#F77F00] dark:group-hover/feature:text-orange-500 transition-colors">Timberline X-Coat<br/>Arctic</p>
                  <p className="text-[9px] text-[#6C757D] dark:text-neutral-400 font-medium normal-case tracking-normal">Jaket thermal ekstrem yang mampu menahan suhu beku dengan lapisan insulasi terbaik.</p>
                </div>
                <div className="mt-4 overflow-hidden relative group/img cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 group-hover/feature:bg-transparent transition-colors z-10" />
                  <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" alt="Timberline X-Coat Arctic" className="w-full h-24 object-cover grayscale group-hover/feature:grayscale-0 group-hover/feature:scale-110 transition-all duration-500" />
                </div>
              </Link>
            </div>
          </div>

          <div className="relative py-6">
            <Link href="/promo" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group">Promo <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span></Link>
          </div>
          
          <div className="relative py-6">
            <Link href="/chat" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group flex items-center gap-1.5">
              Chat Assistant <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          <div className="relative py-6">
            <Link href="/tentang-kami" className="hover:text-[#F77F00] dark:hover:text-white transition-colors relative group">Tentang Kami <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all group-hover:w-full"></span></Link>
          </div>
        </div>

        {/* Kanan - Icons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <div className="hidden md:flex relative group/search items-center">
            <Search className="w-5 h-5 absolute left-0 text-[#212529] dark:text-white group-focus-within:text-[#F77F00] dark:group-focus-within:text-orange-500 transition-colors pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }
              }}
              placeholder="SEARCH GEAR..." 
              className="w-24 focus:w-40 lg:focus:w-56 bg-transparent border-b border-transparent focus:border-[#F77F00] dark:focus:border-orange-500 py-1 pl-8 text-[10px] font-black tracking-[0.2em] uppercase text-[#212529] dark:text-white outline-none transition-all duration-500 placeholder:text-[#212529]/50 dark:placeholder:text-white/50"
            />
          </div>
          <Search className="w-5 h-5 md:hidden cursor-pointer hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
          
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#F77F00] border-t-transparent animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-6">
              <Link href="/profil?tab=pesanan" className="cursor-pointer group flex items-center gap-3">
                <Package className="w-5 h-5 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
                <span className="hidden md:block text-[10px] font-black tracking-widest uppercase group-hover:text-[#F77F00] dark:group-hover:text-orange-500 transition-colors">Pesanan</span>
              </Link>
              <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer group flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-[10px] font-black tracking-widest uppercase">Cart</span>
              </div>
              <Link href="/profil" className="cursor-pointer group flex items-center">
                <img 
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.user_metadata?.name || 'User')}&background=F77F00&color=fff`} 
                  alt="User Profile" 
                  className="w-7 h-7 rounded-full object-cover border border-black/10 dark:border-white/20 group-hover:border-[#F77F00] transition-colors shadow-sm" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.user_metadata?.name || 'User')}&background=F77F00&color=fff`;
                  }}
                />
              </Link>
            </div>
          ) : (
            <Link href="/login" className="cursor-pointer group flex items-center gap-3">
              <User className="w-5 h-5 group-hover:text-[#F77F00] dark:text-orange-500 transition-colors" />
              <span className="hidden md:block text-[10px] font-black tracking-widest uppercase group-hover:text-[#F77F00] dark:group-hover:text-orange-500 transition-colors">Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* FULL-SCREEN OVERLAY SIDEBAR */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex"
          >
            {/* Backdrop Gelap */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            
            {/* Panel Sidebar */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[85%] md:w-[400px] h-full bg-[#f8f9fa] dark:bg-[#0a0a0a] border-r border-black/10 dark:border-white/10 p-8 md:p-12 flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Header Sidebar */}
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black tracking-tighter uppercase flex items-center gap-2"><Mountain className="w-5 h-5 text-[#F77F00] dark:text-orange-500" />TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full animate-pulse"></span></span>
                <div onClick={() => setIsMenuOpen(false)} className="w-10 h-10 border border-black/20 dark:border-white/20 flex items-center justify-center rounded-full cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                  <X className="w-4 h-4" />
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-6 flex-1 text-[#212529] dark:text-white">
                <div className="flex flex-col gap-4 border-b border-black/10 dark:border-white/10 pb-8">
                  <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Koleksi Utama</span>
                  <Link href="/katalog" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Semua Gear</Link>
                  <Link href="/katalog?kategori=ekspedisi" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Ekspedisi Pro</Link>
                  <Link href="/katalog?kategori=urban" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black uppercase tracking-tighter hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Urban Tech</Link>
                </div>

                <div className="flex flex-col gap-3 py-4 border-b border-black/10 dark:border-white/10 pb-8">
                  <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mb-2">Bantuan & Info</span>
                  <Link href="/track" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Lacak Pesanan</Link>
                  <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Customer Service</Link>
                  <Link href="/ukuran" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Panduan Ukuran</Link>
                  <Link href="/lokasi" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-[#F77F00] dark:hover:text-orange-500 transition-colors">Lokasi Toko</Link>
                </div>

                <div className="mt-auto pt-8">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    <span>IDR / ID</span>
                    <div className="flex items-center gap-4">
                      <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">IG</Link>
                      <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">TW</Link>
                      <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">YT</Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}
