"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  ShoppingBag,
  ShieldCheck,
  Smartphone,
  Wallet,
  Lock,
  ArrowRight,
  ShoppingBasket,
  Check,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

const formatRupiah = (number: number) => {
  return "Rp " + number.toLocaleString("id-ID");
};

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

const CHECKOUT_ITEMS = [
  {
    id: "101",
    name: "Vertex Summit Tent",
    price: 3450000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    variant: "Forest Green / 4P"
  },
  {
    id: "102",
    name: "Timberline X-Coat Arctic",
    price: 1200000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    variant: "Matte Black / L"
  }
];

const PAYMENT_CATEGORIES = [
  { 
    id: "bank", 
    label: "Transfer Bank", 
    icon: <CreditCard className="w-5 h-5" />,
    desc: "BCA, Mandiri, BNI",
    options: [
      { id: "bca", name: "BCA Transfer", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" },
      { id: "mandiri", name: "Mandiri Transfer", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" },
      { id: "bni", name: "BNI Transfer", logo: "https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg" }
    ]
  },
  { 
    id: "ewallet", 
    label: "E-Wallet & QRIS", 
    icon: <Smartphone className="w-5 h-5" />,
    desc: "GoPay, OVO, ShopeePay",
    options: [
      { id: "gopay", name: "GoPay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" },
      { id: "ovo", name: "OVO", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg" },
      { id: "qris", name: "QRIS", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" }
    ]
  }
];

export default function CheckoutPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const subtotal = CHECKOUT_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const adminFee = 2500;
  const total = subtotal + shipping + adminFee;

  return (
    <main className="min-h-screen bg-[#F0F4F2] text-[#212529] font-sans pb-32">
      
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/90 border-b border-[#1B4332]/10 px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/keranjang">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#1B4332] leading-none">Checkout</h1>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Order Manifest v2.4</span>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <Stepper currentStep={2} />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F77F00]/10 flex items-center justify-center text-[#F77F00]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-44">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 space-y-10">
            
            {/* 01. SHIPPING ADDRESS */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-white bg-[#1B4332] px-3 py-1 rounded-sm">01</span>
                <h2 className="text-lg font-black uppercase tracking-tighter text-[#1B4332]">Alamat Pengiriman</h2>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-white shadow-xl shadow-[#1B4332]/5 relative overflow-hidden">
                <div className="absolute top-8 right-8">
                  <div className="w-10 h-10 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="font-black text-[#1B4332] uppercase tracking-tight mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F77F00]" /> Budi Setiawan 
                    <span className="px-2 py-0.5 bg-black text-[8px] text-white rounded-full">UTAMA</span>
                  </p>
                  <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-md">
                    Jl. Puncak Jaya No. 88, Cluster Everest, Kebayoran Baru, Jakarta Selatan, 12110
                  </p>
                  <div className="mt-8 pt-6 border-t border-neutral-50 flex justify-between items-center">
                    <p className="text-[10px] font-black text-neutral-400">+62 812 3456 7890</p>
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:underline bg-[#F0F4F2] px-4 py-2 rounded-full">Ganti Alamat</button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 02. PAYMENT SELECTION (REFACTORED) */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-white bg-[#F77F00] px-3 py-1 rounded-sm">02</span>
                <h2 className="text-lg font-black uppercase tracking-tighter text-[#1B4332]">Metode Pembayaran</h2>
              </div>

              <div className="space-y-4">
                {PAYMENT_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-[28px] overflow-hidden border border-white shadow-xl shadow-[#1B4332]/5 transition-all">
                    {/* Category Button */}
                    <button
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      className={`w-full p-8 flex items-center justify-between text-left transition-all ${activeCategory === cat.id ? 'bg-[#1B4332] text-white' : 'hover:bg-neutral-50'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeCategory === cat.id ? 'bg-white/10 text-white' : 'bg-[#F0F4F2] text-[#1B4332]'}`}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-tighter text-sm">{cat.label}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'text-white/60' : 'text-neutral-400'}`}>{cat.desc}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Sub-options (Only shows when active) */}
                    <AnimatePresence>
                      {activeCategory === cat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/50">
                            {cat.options.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setSelectedMethod(opt.id)}
                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative ${
                                  selectedMethod === opt.id 
                                  ? "border-[#1B4332] bg-white shadow-lg" 
                                  : "border-transparent bg-white/50 hover:bg-white hover:border-neutral-200"
                                }`}
                              >
                                {selectedMethod === opt.id && (
                                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#1B4332] rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <div className="h-6 flex items-center justify-center">
                                  <img src={opt.logo} alt={opt.name} className={`max-h-full ${opt.id === 'bca' || opt.id === 'mandiri' || opt.id === 'bni' ? 'grayscale brightness-0' : ''}`} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-[#1B4332]">{opt.name}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 03. LOGISTICS */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black text-white bg-[#40916C] px-3 py-1 rounded-sm">03</span>
                <h2 className="text-lg font-black uppercase tracking-tighter text-[#1B4332]">Jasa Ekspedisi</h2>
              </div>

              <div className="flex items-center justify-between p-8 rounded-[32px] bg-white border border-white shadow-xl shadow-[#1B4332]/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center shadow-inner border border-neutral-100">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/JNE_Express_logo.svg" alt="JNE" className="w-10" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#1B4332] uppercase tracking-tight">JNE Reguler (Service: HQ-7)</p>
                    <p className="text-[10px] text-[#40916C] font-black uppercase tracking-[0.2em] mt-1">Status: Gratis Ongkir Aktif</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1B4332]">FREE</p>
                </div>
              </div>
            </motion.section>

          </div>

          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 space-y-8">
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-10 border border-white shadow-2xl shadow-[#1B4332]/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1B4332] via-[#F77F00] to-[#1B4332]" />
                
                <h2 className="text-xl font-black uppercase tracking-tighter text-[#1B4332] mb-10 flex items-center gap-3">
                  <ShoppingBasket className="w-6 h-6 text-[#F77F00]" /> Manifest Pesanan
                </h2>

                <div className="space-y-6 mb-10">
                  {CHECKOUT_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-[11px] font-black uppercase tracking-widest leading-tight text-[#1B4332]">{item.name}</p>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase mt-1">{item.variant}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] font-black text-neutral-400">x{item.quantity}</span>
                          <span className="text-sm font-black text-[#1B4332]">{formatRupiah(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 py-8 border-y border-neutral-50 mb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Subtotal</span>
                    <span className="text-sm font-black text-[#1B4332]">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pengiriman</span>
                    <span className="text-sm font-black text-[#40916C]">GRATIS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Biaya Admin</span>
                    <span className="text-sm font-black text-[#1B4332]">{formatRupiah(adminFee)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end mb-10">
                  <span className="text-[#1B4332]/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Total Tagihan</span>
                  <span className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">{formatRupiah(total)}</span>
                </div>

                <Link href="/pembayaran" className="block w-full">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#2d5a47" }} 
                    whileTap={{ scale: 0.98 }} 
                    className="w-full h-16 bg-[#1B4332] text-white rounded-[24px] flex items-center justify-center gap-4 font-black uppercase tracking-[0.15em] text-sm shadow-2xl shadow-[#1B4332]/20 transition-all duration-300"
                  >
                    Bayar Sekarang <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>

              <div className="bg-white rounded-[32px] p-8 border border-white flex flex-col gap-6 shadow-xl shadow-[#1B4332]/5">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#40916C]/10 flex items-center justify-center text-[#40916C]">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1B4332] mb-1">Secure Checkout.</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">Data Anda terlindungi oleh enkripsi standar perbankan.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
