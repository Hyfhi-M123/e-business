"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, selectedCartTotal, selectedCartCount, selectedItemIds, toggleSelect, toggleSelectAll } = useCart();

  const FREE_SHIPPING_THRESHOLD = 2500000;
  const progress = Math.min((selectedCartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - selectedCartTotal, 0);

  function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex justify-end"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
            onClick={() => setIsCartOpen(false)} 
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full md:w-[480px] h-full bg-[#f8f9fa] dark:bg-[#0a0a0a] border-l border-black/10 dark:border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#F77F00] dark:text-orange-500" />
                <h2 className="text-xl font-black uppercase tracking-tighter text-[#212529] dark:text-white">Keranjang <span className="text-[#6C757D] dark:text-neutral-500">({selectedCartCount})</span></h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Endowed Progress (Gratis Ongkir Bar) */}
            <div className="p-6 md:px-8 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#121212]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#212529] dark:text-white mb-3">
                {remainingForFreeShipping > 0 
                  ? <>Belanja <span className="text-[#F77F00] dark:text-orange-500">{formatRupiah(remainingForFreeShipping)}</span> lagi untuk GRATIS ONGKIR</>
                  : <span className="text-emerald-600 dark:text-emerald-500">YAY! Anda mendapatkan GRATIS ONGKIR!</span>
                }
              </p>
              <div className="w-full h-1.5 bg-[#DEE2E6] dark:bg-white/10 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${progress === 100 ? "bg-emerald-500" : "bg-[#F77F00] dark:bg-orange-500"}`}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#6C757D] dark:text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">Keranjang Kosong</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-[-10px]">
                    <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono text-[#212529] dark:text-white/80 hover:text-black dark:hover:text-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedItemIds.length === cartItems.length && cartItems.length > 0}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[#F77F00] cursor-pointer"
                      />
                      PILIH SEMUA
                    </label>
                  </div>
                  <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-4 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10"
                    >
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 accent-[#F77F00] cursor-pointer"
                        />
                      </div>
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-[#f8f9fa] dark:bg-[#0a0a0a]" />
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xs font-black uppercase tracking-tight text-[#212529] dark:text-white line-clamp-1">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#6C757D] dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">{item.category}</span>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border border-black/20 dark:border-white/20">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-[#212529] dark:text-white hover:bg-black/5 dark:hover:bg-white/10">-</button>
                            <span className="w-7 h-7 flex items-center justify-center text-[10px] font-black text-[#212529] dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-[#212529] dark:text-white hover:bg-black/5 dark:hover:bg-white/10">+</button>
                          </div>
                          <span className="text-sm font-black text-[#212529] dark:text-white">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 md:p-8 bg-white dark:bg-[#121212] border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Subtotal Sementara</span>
                  <span className="text-2xl font-black text-[#212529] dark:text-white tracking-tighter">{formatRupiah(selectedCartTotal)}</span>
                </div>

                <Link href="/keranjang" onClick={() => setIsCartOpen(false)} className="w-full py-4 bg-[#F77F00] dark:bg-orange-500 hover:bg-[#e06f00] dark:hover:bg-orange-400 text-neutral-950 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-colors mb-4">
                  LANJUT KE PEMBAYARAN <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-6 mt-4 opacity-70">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pembayaran Aman
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
                    <CreditCard className="w-3.5 h-3.5" /> SSL Enkripsi
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
