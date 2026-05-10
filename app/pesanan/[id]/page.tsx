"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, AlertTriangle, MapPin, Receipt, CreditCard, ChevronRight, Package, Copy } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DUMMY_ORDERS } from "../../lib/orders";

export default function OrderDetailPage() {
  const pathname = usePathname();
  const idPesanan = pathname.split('/').pop() || "TRF-991203";
  
  // Ambil data pesanan dari dummy database
  const order = DUMMY_ORDERS.find(o => o.id === idPesanan) || DUMMY_ORDERS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin ke clipboard!");
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />

      <div className="max-w-[800px] mx-auto w-full px-6 pt-32 pb-24">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-8">
          <Link href="/profil" className="hover:text-[#F77F00] transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Kembali ke Profil</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">Rincian Pesanan</span>
        </div>

        {/* Status Banner */}
        <div className={`p-8 rounded-t-2xl flex flex-col items-center text-center text-white relative overflow-hidden ${
          order.status === "Selesai" ? "bg-emerald-600" :
          order.status === "Dikirim" ? "bg-[#F77F00]" :
          order.status === "Belum Bayar" ? "bg-red-600" :
          "bg-[#212529] dark:bg-[#1a1a1a]"
        }`}>
          {order.status === "Selesai" && <CheckCircle2 className="w-16 h-16 mb-4 opacity-90" />}
          {order.status === "Dikirim" && <Truck className="w-16 h-16 mb-4 opacity-90" />}
          {order.status === "Belum Bayar" && <AlertTriangle className="w-16 h-16 mb-4 opacity-90" />}
          
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            Pesanan {order.status}
          </h1>
          <p className="font-mono text-xs opacity-80 tracking-widest uppercase">
            Terima kasih telah berbelanja di TrailForge.
          </p>

          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
        </div>

        {/* Info Box */}
        <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-b-2xl shadow-sm overflow-hidden mb-8">
          
          {/* Alamat Pengiriman */}
          <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-[#F77F00]">
              <MapPin className="w-4 h-4" /> Alamat Pengiriman
            </h2>
            <div className="pl-6">
              <p className="font-bold mb-1">{order.shipping.address.split('\n')[0]}</p>
              <p className="text-sm text-[#6C757D] leading-relaxed mb-2 font-mono">
                {order.shipping.address.split('\n').slice(1, -1).join(', ')}
              </p>
              <p className="text-sm font-mono text-[#6C757D]">{order.shipping.address.split('\n').pop()}</p>
            </div>
          </div>

          {/* Informasi Logistik */}
          <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-[#F77F00]">
              <Truck className="w-4 h-4" /> Informasi Logistik
            </h2>
            <div className="pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-bold mb-1">{order.shipping.courier}</p>
                <p className="text-sm text-[#6C757D] font-mono flex items-center gap-2">
                  No. Resi: {order.shipping.receipt} 
                  {order.shipping.receipt !== "-" && (
                    <button onClick={() => handleCopy(order.shipping.receipt)} className="text-[#F77F00] hover:text-[#e06f00]"><Copy className="w-3 h-3" /></button>
                  )}
                </p>
              </div>
              {order.status === "Dikirim" && (
                <Link href={`/track/${order.id}`}>
                  <button className="px-5 py-2 border border-black/20 dark:border-white/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    Lacak Pesanan
                  </button>
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Daftar Produk */}
        <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-black/5 dark:border-white/5 bg-[#f8f9fa] dark:bg-[#1a1a1a]">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4 text-[#F77F00]" /> Rincian Produk
            </h2>
          </div>
          
          <div className="p-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start mb-6 last:mb-0">
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#212529] dark:text-white line-clamp-1 mb-1">{item.name}</h4>
                  <p className="text-xs text-[#6C757D] mb-1">Variasi: {item.variant}</p>
                  <p className="text-xs font-mono text-[#6C757D]">x{item.qty}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-[#F77F00]">Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rincian Pembayaran & Tombol Aksi */}
        <div className="bg-[#fcfaf8] dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden relative">
          
          <div className="p-6 md:p-8">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6">
              <Receipt className="w-4 h-4 text-[#F77F00]" /> Rincian Pembayaran
            </h2>
            
            <div className="flex flex-col gap-3 font-mono text-xs uppercase text-[#6C757D] dark:text-neutral-400 mb-6">
              <div className="flex justify-between">
                <span>Metode Pembayaran</span>
                <span className="font-bold text-[#212529] dark:text-white">{order.payment.method}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Subtotal Produk</span>
                <span className="font-bold text-[#212529] dark:text-white">Rp {order.payment.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ongkos Kirim</span>
                <span className="font-bold text-[#212529] dark:text-white">Rp {order.payment.shipping_cost.toLocaleString('id-ID')}</span>
              </div>
              {order.payment.discount < 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Pesanan</span>
                  <span className="font-bold">-Rp {Math.abs(order.payment.discount).toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-dotted border-black/20 dark:border-white/20">
              <span className="text-sm font-black uppercase tracking-widest text-[#212529] dark:text-white">Total Pesanan</span>
              <span className="text-3xl font-black text-[#F77F00] tracking-tighter">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-[#f4f0ea] dark:bg-[#121212] border-t border-black/10 dark:border-white/10">
            {order.status === "Belum Bayar" && (
              <button className="w-full py-4 bg-[#F77F00] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Bayar Sekarang
              </button>
            )}
            {(order.status === "Dikirim" || order.status === "Selesai") && (
              <div className="flex gap-4">
                {order.status === "Dikirim" && (
                  <button className="flex-1 py-4 bg-[#F77F00] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-colors">
                    Pesanan Diterima
                  </button>
                )}
                {order.status === "Selesai" && (
                  <Link href={`/pesanan/${order.id}/nilai`} className="flex-1">
                    <button className="w-full py-4 bg-[#F77F00] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-colors">
                      Nilai Produk
                    </button>
                  </Link>
                )}
                <Link href="/katalog" className="flex-1">
                  <button className="w-full py-4 border-2 border-black/20 dark:border-white/20 text-[#212529] dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    Beli Lagi
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
