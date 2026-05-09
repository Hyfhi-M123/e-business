"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ChevronRight,
  ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight, ShoppingCart, Check,
  MapPin, ShoppingBasket
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

// Mock Data Keranjang
const INITIAL_CART = [
  {
    id: "101",
    name: "Vertex Summit Tent",
    category: "Tenda",
    price: 3450000,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    color: "Forest Green",
    size: "4P",
    quantity: 1
  },
  {
    id: "102",
    name: "Timberline X-Coat Arctic",
    category: "Pakaian",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    color: "Matte Black",
    size: "L",
    quantity: 1
  }
];

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Keranjang", "Checkout", "Pembayaran"];
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i + 1 <= currentStep ? "bg-[#1B4332] text-white" : "bg-neutral-200 text-neutral-400"}`}>
              {i + 1}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${i + 1 <= currentStep ? "text-[#1B4332]" : "text-neutral-400"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && <div className="w-8 h-px bg-neutral-200" />}
        </div>
      ))}
    </div>
  );
};

export default function KeranjangPage() {
  const [items, setItems] = useState(INITIAL_CART);
  const [selectedIds, setSelectedIds] = useState<string[]>(INITIAL_CART.map(i => i.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i.id));
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  const selectedItems = useMemo(() => items.filter(item => selectedIds.includes(item.id)), [items, selectedIds]);
  const subtotal = useMemo(() => selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [selectedItems]);
  const shipping = subtotal > 2000000 || subtotal === 0 ? 0 : 50000;
  const total = subtotal + shipping;

  const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F0F4F2] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[40px] shadow-2xl shadow-[#1B4332]/5 flex flex-col items-center max-w-md w-full border border-white"
        >
          <div className="w-24 h-24 bg-[#F0F4F2] rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="w-10 h-10 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1B4332] mb-4">Keranjang Kosong</h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">Peralatan petualangan Anda masih kosong. Mari mulai perjalanan!</p>
          <Link href="/katalog" className="w-full h-14 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-[#2d5a47] transition-all shadow-xl shadow-[#1B4332]/20">
            Mulai Belanja
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F4F2] text-[#212529] font-sans pb-32">

      {/* SHARED TRANSACTION HEADER */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/90 border-b border-[#1B4332]/10 px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#1B4332] leading-none">Keranjang</h1>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Order Manifest v2.4</span>
          </div>
        </div>

        <div className="hidden lg:block">
          <Stepper currentStep={1} />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F77F00]/10 flex items-center justify-center text-[#F77F00]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-44">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* KOLOM KIRI: DAFTAR ITEM */}
          <div className="flex-1 space-y-6">

            {/* Header Control */}
            <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[24px] border border-[#1B4332]/5 shadow-xl shadow-[#1B4332]/5">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={toggleSelectAll}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm ${selectedIds.length === items.length ? "bg-[#1B4332] border-[#1B4332]" : "bg-white border-neutral-300 group-hover:border-[#1B4332]"}`}
                >
                  {selectedIds.length === items.length && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1B4332]">Pilih Semua ({items.length})</span>
              </label>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] p-6 border border-white shadow-xl shadow-[#1B4332]/5 flex flex-col md:flex-row items-center gap-6 group hover:border-[#1B4332]/10 transition-all"
                >
                  {/* Checkbox */}
                  <div 
                    onClick={() => toggleSelect(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-all shadow-sm ${selectedIds.includes(item.id) ? "bg-[#1B4332] border-[#1B4332]" : "bg-white border-neutral-300 hover:border-[#1B4332]"}`}
                  >
                    {selectedIds.includes(item.id) && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Image */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[9px] font-black text-[#F77F00] uppercase tracking-widest mb-1 block">{item.category}</span>
                    <h3 className="text-lg font-black text-[#1B4332] uppercase tracking-tighter leading-tight mb-2">{item.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 bg-[#F0F4F2] rounded-full text-[9px] font-bold text-[#1B4332] uppercase">{item.color}</span>
                      <span className="px-3 py-1 bg-[#F0F4F2] rounded-full text-[9px] font-bold text-[#1B4332] uppercase">Size {item.size}</span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-[#F0F4F2] p-1 rounded-xl border border-[#1B4332]/5">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Subtotal</p>
                      <p className="text-xl font-black text-[#1B4332] tracking-tighter">{formatRupiah(item.price * item.quantity)}</p>
                    </div>
                  </div>

                  {/* Trash */}
                  <button onClick={() => removeItem(item.id)} className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* KOLOM KANAN: RINGKASAN */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 space-y-6">

              <div className="bg-white rounded-[40px] p-10 border border-white shadow-2xl shadow-[#1B4332]/10 relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1B4332] via-[#F77F00] to-[#1B4332]" />

                <h2 className="text-xl font-black uppercase tracking-tighter text-[#1B4332] mb-10 flex items-center gap-3">
                  <ShoppingBasket className="w-6 h-6 text-[#F77F00]" /> Ringkasan
                </h2>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Produk</span>
                    <span className="text-sm font-black text-[#1B4332]">{selectedIds.length} Item</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Estimasi Pengiriman</span>
                    <span className={`text-sm font-black ${shipping === 0 ? "text-[#40916C]" : "text-[#1B4332]"}`}>{shipping === 0 ? "GRATIS" : formatRupiah(shipping)}</span>
                  </div>
                  <div className="h-px bg-neutral-100 my-4" />
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Pembayaran</span>
                      <span className="text-3xl font-black text-[#1B4332] tracking-tighter mt-1">{formatRupiah(total)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#2d5a47" }} whileTap={{ scale: 0.98 }}
                    disabled={selectedIds.length === 0}
                    className={`w-full h-16 text-white rounded-[24px] flex items-center justify-center gap-4 font-black uppercase tracking-[0.15em] text-sm shadow-2xl transition-all ${selectedIds.length === 0 ? "bg-neutral-200 cursor-not-allowed shadow-none" : "bg-[#1B4332] shadow-[#1B4332]/20"}`}
                  >
                    Lanjut Ke Checkout <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                {/* Promo */}
                <div className="mt-8 pt-8 border-t border-neutral-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#F77F00]" /> Punya Voucher?
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="KODE PROMO" 
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:border-[#1B4332] outline-none transition-all"
                    />
                    <button className="px-4 py-3 bg-[#1B4332] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2d5a47] transition-all">Gunakan</button>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[24px] border border-white shadow-sm flex flex-col items-center text-center">
                  <ShieldCheck className="w-6 h-6 text-[#40916C] mb-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]">100% Ori</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-white shadow-sm flex flex-col items-center text-center">
                  <RotateCcw className="w-6 h-6 text-[#F77F00] mb-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]">Easy Return</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
