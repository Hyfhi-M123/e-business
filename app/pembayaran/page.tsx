"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Copy, ArrowRight, Lock, CheckCircle2, ChevronRight, Home, Smartphone, QrCode as QrCodeIcon, Wallet, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [method, setMethod] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);
  
  // Payment Status Simulation
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending");

  useEffect(() => {
    setIsMounted(true);
    setMethod(searchParams.get("method"));
    setTotal(searchParams.get("total"));
    
    const urlStatus = searchParams.get("status");
    if (urlStatus === "success") {
      setPaymentStatus("success");
      
      const orderId = searchParams.get("order_id") || "TRF-991203";
      const redirectTimer = setTimeout(() => {
        router.push(`/pesanan/${orderId}`);
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    } else {
      // Simulate real-time payment success after 10-15 seconds if pending
      const successTimer = setTimeout(async () => {
        setPaymentStatus("success");
        const orderId = searchParams.get("order_id");
        if (orderId) {
          try {
            await fetch("/api/orders", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: orderId, status: "Menunggu Konfirmasi" })
            });
          } catch (e) {
            console.error(e);
          }
        }
      }, Math.floor(Math.random() * 5000) + 10000);
      
      return () => clearTimeout(successTimer);
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, paymentStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatRupiah = (n: number | string | null) => {
    if (!n) return "Rp 0";
    return "Rp " + Number(n).toLocaleString("id-ID");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const virtualAccountNumber = "8801" + Math.floor(100000000 + Math.random() * 900000000);

  const handleManualCheck = async () => {
    setPaymentStatus("success");
    const orderId = searchParams.get("order_id");
    if (orderId) {
      try {
        await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId, status: "Menunggu Konfirmasi" })
        });
      } catch (e) {
        console.error(e);
      }
      
      setTimeout(() => {
        router.push(`/pesanan/${orderId}`);
      }, 3000);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white transition-colors duration-300 pb-20">
      <Navbar />
      
      {/* Brutalist Header Context */}
      <div className="bg-[#212529] dark:bg-[#1a1a1a] border-b border-black/10 dark:border-white/10 pt-32 pb-16 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6">
            <Lock className="w-3 h-3" /> SSL SECURE 256-BIT
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
            {paymentStatus === "success" ? "PEMBAYARAN DITERIMA" : "SELESAIKAN PEMBAYARAN"}
          </h1>
          <p className="text-neutral-400 font-mono text-sm max-w-xl">
            {paymentStatus === "success" 
              ? "Sistem kami telah mengkonfirmasi penerimaan dana. Pesanan Anda akan segera diproses."
              : "Sistem Payment Gateway kami mendeteksi pesanan baru. Segera selesaikan pembayaran agar pesanan dapat diproses."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-3xl -mt-8 relative z-20">
        
        {/* Success State */}
        {paymentStatus === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-[#121212] border border-emerald-500/50 shadow-2xl overflow-hidden p-10 text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 animate-[bounce_1s_ease-in-out]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-emerald-500">LUNAS</h2>
            <p className="text-[#6C757D] dark:text-neutral-400 font-mono text-sm mb-4">Dana sebesar <strong className="text-black dark:text-white">{formatRupiah(total)}</strong> telah diverifikasi.</p>
            
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-8 font-mono text-xs uppercase">
              <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              Mengalihkan ke pelacakan pesanan...
            </div>
            
            <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 mb-8"></div>
            
            <Link href={`/track/${searchParams.get("order_id") || "TRF-991203"}`} className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
              LIHAT PESANAN <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          
          /* Pending State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Timer Header */}
            <div className="bg-[#F77F00] p-6 text-white text-center">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-2 opacity-80">Batas Waktu Pembayaran</span>
              <div className="text-5xl font-mono font-black tracking-widest">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Total Block */}
            <div className="p-8 border-b border-black/10 dark:border-white/10 flex flex-col items-center text-center">
              <span className="text-xs font-black text-[#6C757D] uppercase tracking-widest mb-2">Total Tagihan</span>
              <div className="text-3xl md:text-4xl font-black font-mono">
                {formatRupiah(total)}
              </div>
              <button 
                onClick={() => copyToClipboard(total || "")}
                className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F77F00] hover:text-[#e06f00] transition-colors bg-[#F77F00]/10 px-3 py-1.5"
              >
                <Copy className="w-3 h-3" /> {copied ? "DISALIN" : "SALIN NOMINAL"}
              </button>
            </div>

            {/* Instruction Body based on Method */}
            <div className="p-8 bg-[#fcfaf8] dark:bg-[#1a1a1a]">
              
              {/* QRIS Layout */}
              {method === "qris" && (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-xs aspect-square bg-white border border-black/10 p-4 mb-6 shadow-sm relative group cursor-pointer">
                    {/* Simulated QR Code (Placeholder) */}
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-2 shadow-lg">
                      <QrCodeIcon className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  <h3 className="font-black uppercase tracking-widest mb-2 text-center">Scan QRIS ini</h3>
                  <p className="text-xs text-center font-mono text-[#6C757D] dark:text-neutral-400 mb-6">Gunakan aplikasi Gopay, OVO, ShopeePay, Dana, atau Mobile Banking pilihanmu.</p>
                </div>
              )}

              {/* Transfer Bank / VA Layout */}
              {method === "transfer" && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#212529] text-white flex items-center justify-center rounded-2xl mb-4">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest mb-1 text-center">Nomor Virtual Account</h3>
                  <p className="text-xs text-center font-mono text-[#6C757D] dark:text-neutral-400 mb-6">Bank BCA, Mandiri, BNI, BRI</p>
                  
                  <div className="w-full bg-white dark:bg-[#121212] border-2 border-dashed border-[#F77F00]/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-2xl md:text-3xl font-mono font-black tracking-widest text-[#F77F00]">
                      {virtualAccountNumber}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(virtualAccountNumber)}
                      className="px-4 py-3 bg-[#F77F00] text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#e06f00] transition-colors w-full md:w-auto justify-center"
                    >
                      <Copy className="w-4 h-4" /> {copied ? "DISALIN" : "SALIN NOMOR"}
                    </button>
                  </div>
                </div>
              )}

              {/* E-Wallet Layout */}
              {method === "ewallet" && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#212529] text-white flex items-center justify-center rounded-2xl mb-4">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest mb-4 text-center">Pembayaran Otomatis</h3>
                  <p className="text-sm text-center font-mono text-[#6C757D] dark:text-neutral-400 mb-8 max-w-sm">
                    Klik tombol di bawah ini untuk membuka aplikasi E-Wallet Anda dan menyelesaikan pembayaran.
                  </p>
                  <button className="w-full max-w-xs px-6 py-4 bg-[#F77F00] text-white font-black uppercase text-xs tracking-widest hover:bg-[#e06f00] transition-colors flex justify-center items-center gap-3">
                    BUKA APLIKASI SEKARANG <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Credit Card Layout */}
              {method === "cc" && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#212529] text-white flex items-center justify-center rounded-2xl mb-4">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="font-black uppercase tracking-widest mb-4 text-center">Redirecting...</h3>
                  <p className="text-sm text-center font-mono text-[#6C757D] dark:text-neutral-400 mb-8 max-w-sm">
                    Anda sedang dialihkan ke sistem otorisasi bank Visa / Mastercard yang aman...
                  </p>
                  <div className="w-8 h-8 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

            </div>

            {/* Footer / Cek Status */}
            <div className="p-6 bg-white dark:bg-[#121212] border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-mono text-[#6C757D] dark:text-neutral-500 uppercase tracking-widest">
                ID Transaksi: {searchParams.get("order_id") || `TRF-${Math.floor(Math.random() * 100000000)}`}
              </span>
              <button 
                onClick={handleManualCheck}
                className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-2"
              >
                SAYA SUDAH BAYAR <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </motion.div>
        )}
        
      </div>
    </main>
  );
}
