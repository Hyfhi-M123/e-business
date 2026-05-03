"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ChevronRight,
  ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight, ShoppingCart, Check
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
      <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[40px] shadow-2xl shadow-[#1B4332]/5 flex flex-col items-center max-w-md w-full border border-neutral-100"
        >
          <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-8">
            <ShoppingCart className="w-10 h-10 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#1B4332] mb-4">Keranjang Kosong</h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            Sepertinya Anda belum menambahkan peralatan petualangan apapun ke keranjang Anda.
          </p>
          <Link href="/katalog" className="w-full h-14 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-[#2d5a47] transition-all shadow-xl shadow-[#1B4332]/20">
            Mulai Belanja
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans pb-32">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-[#1B4332]/10 px-6 py-4 md:px-12 flex items-center justify-between">
        <Link href="/katalog" className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[#1B4332] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] font-black text-xs">
          {items.length}
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 mt-28">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-10">
          <Link href="/" className="hover:text-[#1B4332]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529]">Keranjang</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* KOLOM KIRI: DAFTAR ITEM */}
          <div className="w-full lg:w-[68%] flex flex-col gap-6">
            <div className="hidden md:grid grid-cols-[40px_1fr_120px_150px_40px] gap-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 items-center">
              <button
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${selectedIds.length === items.length ? "bg-[#1B4332] border-[#1B4332]" : "border-neutral-500 bg-neutral-100 hover:border-[#1B4332]"}`}
              >
                {selectedIds.length === items.length && <Check className="w-3 h-3 text-white" />}
              </button>
              <span>Produk</span>
              <span className="text-center">Jumlah</span>
              <span className="text-right">Subtotal</span>
              <span></span>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white p-4 md:p-6 rounded-[24px] border transition-all group ${selectedIds.includes(item.id) ? "border-[#1B4332]/20 shadow-xl shadow-[#1B4332]/5" : "border-neutral-100 opacity-80 shadow-sm"}`}
                >
                  <div className="flex flex-col md:grid md:grid-cols-[40px_1fr_120px_150px_40px] gap-6 items-center">

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 ${selectedIds.includes(item.id) ? "bg-[#1B4332] border-[#1B4332] shadow-lg shadow-[#1B4332]/20" : "border-neutral-500 bg-neutral-100 hover:border-[#1B4332]"}`}
                    >
                      {selectedIds.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    {/* Info Produk */}
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#40916C]">{item.category}</span>
                        <h3 className="text-base font-black text-[#1B4332] truncate leading-tight">{item.name}</h3>
                        <div className="flex gap-3 text-[10px] font-bold text-neutral-400">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color === "Forest Green" ? "#1B4332" : "#212529" }}></span> {item.color}</span>
                          <span>Ukuran: {item.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-0 border border-neutral-100 rounded-xl overflow-hidden bg-[#F8F9FA]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-9 h-9 flex items-center justify-center hover:bg-white text-neutral-400 hover:text-[#1B4332] transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                      <div className="w-10 h-9 flex items-center justify-center text-sm font-black text-[#1B4332]">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-9 h-9 flex items-center justify-center hover:bg-white text-neutral-400 hover:text-[#1B4332] transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* Subtotal Item */}
                    <div className="text-right w-full md:w-auto">
                      <div className="text-[10px] md:hidden font-black text-neutral-400 uppercase mb-1">Subtotal</div>
                      <span className="text-lg font-black text-[#1B4332] tracking-tight">{formatRupiah(item.price * item.quantity)}</span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

          {/* KOLOM KANAN: RINGKASAN PESANAN */}
          <div className="w-full lg:w-[32%] lg:sticky lg:top-28">
            <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-xl shadow-[#1B4332]/5">
              <h2 className="text-lg font-black uppercase tracking-tighter text-[#1B4332] mb-6 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#F77F00]" /> Ringkasan
              </h2>

              <div className="flex flex-col gap-4 pb-6 border-b border-neutral-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Produk Terpilih</span>
                  <span className="font-black text-[#1B4332]">{selectedIds.length} Item</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Subtotal</span>
                  <span className="font-black text-[#1B4332]">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-neutral-500 uppercase tracking-widest text-[9px]">Pengiriman</span>
                  <span className="font-black text-[#40916C]">{shipping === 0 ? "GRATIS" : formatRupiah(shipping)}</span>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-end mb-6">
                  <span className="font-black text-[#1B4332] uppercase tracking-widest text-[9px]">Total Bayar</span>
                  <span className="text-2xl font-black text-[#1B4332] tracking-tighter">{formatRupiah(total)}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={selectedIds.length === 0}
                  className={`w-full h-14 text-white rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all ${selectedIds.length === 0 ? "bg-neutral-200 cursor-not-allowed shadow-none" : "bg-[#1B4332] shadow-[#1B4332]/20 hover:bg-[#2d5a47]"}`}
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Promo / Voucher */}
            <div className="mt-4 bg-white rounded-2xl p-6 border border-neutral-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F77F00] flex-shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#1B4332]">Punya Kode Promo?</p>
                  <p className="text-[10px] text-neutral-400 font-bold">Gunakan diskon tambahan</p>
                </div>
              </div>
              <button className="text-xs font-black uppercase tracking-widest text-[#40916C] hover:underline">Input</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
