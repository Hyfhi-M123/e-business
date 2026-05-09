"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  ExternalLink, 
  ShoppingBag,
  ArrowRight,
  Info,
  Calendar,
  ShieldCheck
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

export default function PembayaranPage() {
  const [timeLeft, setTimeLeft] = useState(86399); // 24 hours in seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F0F4F2] text-[#212529] font-sans pb-32">
      
      {/* SHARED TRANSACTION HEADER */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-white/90 border-b border-[#1B4332]/10 px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/checkout">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter text-[#1B4332] leading-none">Pembayaran</h1>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Order #TF-20240509-001</span>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <Stepper currentStep={3} />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-44">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 1. PAYMENT STATUS & TIMER */}
          <div className="bg-white rounded-[40px] p-10 border border-white shadow-2xl shadow-[#1B4332]/5 text-center relative overflow-hidden">
             {/* Gradient Background Decoration */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F0F4F2] rounded-full blur-3xl opacity-50" />
             
             <div className="relative z-10">
               <div className="w-20 h-20 bg-[#F77F00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Clock className="w-10 h-10 text-[#F77F00]" />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1B4332] mb-2">Selesaikan Pembayaran</h2>
               <p className="text-neutral-500 text-sm mb-6">Batas waktu pembayaran akan berakhir dalam:</p>
               
               <div className="flex justify-center gap-4">
                 <div className="bg-[#1B4332] text-white px-8 py-4 rounded-3xl shadow-xl shadow-[#1B4332]/20">
                   <span className="text-3xl font-black tracking-widest font-mono">{formatTime(timeLeft)}</span>
                 </div>
               </div>
             </div>
          </div>

          {/* 2. PAYMENT DETAILS */}
          <div className="bg-white rounded-[40px] p-10 border border-white shadow-2xl shadow-[#1B4332]/5 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-[#F0F4F2] rounded-2xl flex items-center justify-center text-[#1B4332]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-[#1B4332]">Transfer Bank BCA</h3>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Virtual Account / Manual Verification</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Virtual Account Number */}
              <div className="p-8 rounded-[32px] bg-[#F0F4F2]/50 border border-neutral-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Nomor Rekening / VA</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl md:text-3xl font-black text-[#1B4332] tracking-tighter">8801 1234 5678 90</span>
                  <button 
                    onClick={() => handleCopy("88011234567890")}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Berhasil" : "Salin"}
                  </button>
                </div>
              </div>

              {/* Total Amount */}
              <div className="p-8 rounded-[32px] bg-[#F0F4F2]/50 border border-neutral-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Total yang Harus Dibayar</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl md:text-3xl font-black text-[#F77F00] tracking-tighter">{formatRupiah(4652500)}</span>
                  <button 
                    onClick={() => handleCopy("4652500")}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all shadow-sm"
                  >
                    <Copy className="w-4 h-4" /> Salin
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  <Info className="w-3.5 h-3.5 text-[#F77F00]" />
                  <span>Transfer tepat sampai 3 digit terakhir untuk verifikasi otomatis.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. INSTRUCTIONS & ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[32px] p-8 border border-white shadow-xl shadow-[#1B4332]/5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-tighter text-[#1B4332] mb-4">Butuh Bantuan?</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">Jika Anda mengalami kendala saat melakukan pembayaran, silakan hubungi tim dukungan kami melalui WhatsApp atau Email.</p>
              </div>
              <button className="mt-6 flex items-center justify-center gap-3 w-full py-4 border-2 border-[#F0F4F2] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-neutral-50 transition-all">
                Hubungi Support <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-white shadow-xl shadow-[#1B4332]/5 flex flex-col justify-between">
               <div>
                <h4 className="text-sm font-black uppercase tracking-tighter text-[#1B4332] mb-4">Cek Status Pesanan</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">Setelah transfer berhasil, sistem kami akan melakukan verifikasi otomatis dalam 5-10 menit.</p>
              </div>
              <Link href="/dashboard" className="mt-6 flex items-center justify-center gap-3 w-full py-4 bg-[#1B4332] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#2d5a47] transition-all shadow-lg shadow-[#1B4332]/20">
                Lihat Pesanan Saya <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* FOOTER INDICATOR */}
          <div className="flex items-center justify-center gap-2 py-8">
            <ShieldCheck className="w-4 h-4 text-[#40916C]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#40916C]">Pembayaran Aman & Terenkripsi</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
