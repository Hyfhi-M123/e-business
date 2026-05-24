"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Truck, AlertTriangle, MapPin, Receipt, CreditCard, ChevronRight, Package, Copy, MessageSquare, Star, X, Map, Crosshair, Loader2, Navigation, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Barcode from "react-barcode";

export default function OrderDetailPage() {
  const pathname = usePathname();
  const idPesanan = pathname.split('/').pop() || "";
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<any>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const submitReview = async () => {
    if (!user || !reviewingItem) return;
    setIsSubmittingReview(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: reviewingItem.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Guest",
          rating: newRating,
          comment: newComment
        })
      });
      alert("Ulasan berhasil dikirim!");
      setShowReviewModal(false);
      setNewComment("");
      setReviewingItem(null);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim ulasan.");
    }
    setIsSubmittingReview(false);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const found = data.orders?.find((o: any) => o.id === idPesanan);
        if (found) {
          setOrder(found);
          if ((found.status === "Dikirim" || found.status === "Selesai") && found.shipping?.receipt && found.shipping.receipt !== "-") {
            setTrackingLoading(true);
            const courierCode = (found.shipping.courier || "").toLowerCase().split(" ")[0] || "jne";
            fetch(`/api/shipping/track?waybill=${found.shipping.receipt}&courier=${courierCode}`)
              .then(r => r.json())
              .then(tData => {
                if (tData.success) setTrackingData(tData);
                else setTrackingData({ error: tData.error });
              })
              .catch(e => setTrackingData({ error: "Gagal terhubung ke radar" }))
              .finally(() => setTrackingLoading(false));
          }
        }
      } catch (e) {
        console.error("Failed to fetch order:", e);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [idPesanan]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusStep = (status: string) => {
    const steps = ["Belum Bayar", "Menunggu Konfirmasi", "Diproses", "Dikirim", "Selesai"];
    return steps.indexOf(status);
  };

  // Handler: Konfirmasi Diterima → update status ke "Selesai"
  const handleConfirmReceived = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: "Selesai" })
      });
      setOrder({ ...order, status: "Selesai" });
    } catch (e) {
      console.error("Failed to confirm:", e);
    }
    setActionLoading(false);
  };

  // Handler: Selesaikan Pembayaran → redirect ke keranjang/pembayaran
  const handleCompletePayment = () => {
    router.push(`/keranjang`);
  };

  // Handler: Beli Lagi → redirect ke katalog
  const handleBuyAgain = () => {
    router.push("/katalog");
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-32">
          <Crosshair className="w-10 h-10 animate-spin text-[#F77F00]" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase">SYNCING LOGISTICS...</span>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex flex-col min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6 opacity-50" />
          <h1 className="text-3xl md:text-5xl font-black uppercase mb-4 text-[#212529] dark:text-white tracking-tighter">DATA CORRUPTED</h1>
          <p className="text-[#6C757D] font-mono text-xs uppercase tracking-widest mb-8">Tidak ada sinyal transmisi untuk ID: {idPesanan}</p>
          <Link href="/profil" className="px-8 py-4 bg-[#F77F00] text-black text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-[0_0_30px_rgba(247,127,0,0.3)]">
            Kembali ke Basecamp
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <main className="flex flex-col min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 pt-32 pb-32">
        
        {/* Header Navigation & Barcode */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 dark:border-white/10 pb-8 gap-8">
          <div>
            <Link href="/profil" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] hover:text-[#F77F00] transition-colors flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" /> REKAM JEJAK PESANAN
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#212529] dark:text-white leading-[0.9]">
              TRACKING <br/> <span className="text-[#F77F00]">HUB.</span>
            </h1>
          </div>
          <div className="text-right flex flex-col items-start md:items-end">
            <div className="bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-black/10 dark:border-white/10 backdrop-blur-md">
              <div className="w-full h-12 overflow-hidden mix-blend-multiply dark:mix-blend-lighten opacity-80 mb-2">
                <Barcode 
                  value={order.id} 
                  format="CODE128" 
                  width={2} 
                  height={48} 
                  displayValue={false} 
                  background="transparent" 
                  lineColor="currentColor" 
                  margin={0}
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C757D] flex items-center justify-between gap-4">
                ID: {order.id}
                <button onClick={() => handleCopy(order.id)} className="hover:text-[#F77F00] transition-colors"><Copy className="w-3 h-3" /></button>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Logistics HUD */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Progress Map (Techwear HUD style) */}
            <div className="bg-white/40 dark:bg-[#111111]/80 backdrop-blur-2xl border border-black/10 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              {/* Radar Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-2 h-2 bg-[#F77F00] animate-ping rounded-full"></span>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#F77F00]">Satelit Logistik Terhubung</h2>
                </div>
                
                {/* Visual Tracker */}
                <div className="relative pt-4 pb-12">
                  <div className="absolute left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden" style={{ top: 'calc(1rem + 28px)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, (currentStep / 4) * 100))}%` }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-[#F77F00] to-orange-400"
                    />
                  </div>
                  
                  <div className="relative flex justify-between">
                    {[
                      { label: "Bayar", icon: CreditCard, detail: "Terkonfirmasi" },
                      { label: "Validasi", icon: ShieldCheck, detail: "Menunggu" },
                      { label: "Dikemas", icon: Package, detail: "Basecamp" },
                      { label: "Transit", icon: Truck, detail: "Perjalanan" },
                      { label: "Apex", icon: CheckCircle2, detail: "Diterima" }
                    ].map((step, idx) => {
                      const isPast = idx <= currentStep;
                      const isActive = idx === currentStep;
                      return (
                        <div key={idx} className="flex flex-col items-center relative group">
                          <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                            isActive ? "bg-[#F77F00] text-white shadow-[0_0_30px_rgba(247,127,0,0.6)] scale-110" :
                            isPast ? "bg-black dark:bg-white text-white dark:text-black" :
                            "bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400"
                          }`}>
                            <step.icon className={`w-4 h-4 md:w-6 md:h-6 ${isActive && "animate-pulse"}`} />
                          </div>
                          <div className="absolute top-16 md:top-20 text-center w-24">
                            <span className={`block text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-[#F77F00]" : isPast ? "text-[#212529] dark:text-white" : "text-neutral-400"}`}>
                              {step.label}
                            </span>
                            <span className="block text-[8px] font-mono text-neutral-500 mt-1 uppercase tracking-widest hidden md:block">
                              {step.detail}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current Status Highlights */}
                <div className="mt-8 bg-white/50 dark:bg-black/40 border border-black/10 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="p-4 bg-[#F77F00]/10 rounded-xl">
                      <Navigation className="w-8 h-8 text-[#F77F00] animate-[spin_4s_linear_infinite]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-1">
                        Status Saat Ini: <span className="text-[#F77F00]">{order.status}</span>
                      </h3>
                      <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 leading-relaxed max-w-xl">
                        {order.status === "Belum Bayar" && "Sistem logistik masih menunggu transmisi pembayaran via Payment Gateway."}
                        {order.status === "Menunggu Konfirmasi" && "Pembayaran tervalidasi. Tim Basecamp sedang mempersiapkan manifest pesanan Anda."}
                        {order.status === "Diproses" && "Gear sedang dikemas dengan standar keamanan ekstrem. Bersiap untuk diserahkan ke kurir."}
                        {order.status === "Dikirim" && `Pesanan Anda sedang dalam jalur distribusi oleh armada ${order.shipping?.courier || "Ekspedisi"}. Estimasi kedatangan sesuai koordinat tujuan.`}
                        {order.status === "Selesai" && "Ekspedisi sukses. Gear telah mendarat dengan aman di titik koordinat tujuan. Selamat menjelajah!"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inline Tracking Timeline */}
                {(order.status === "Dikirim" || order.status === "Selesai") && (
                  <div className="mt-8">
                    {trackingLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 bg-white/5 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5">
                        <Loader2 className="w-6 h-6 text-[#F77F00] animate-spin mb-3" />
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Menyinkronkan Satelit Logistik...</p>
                      </div>
                    ) : trackingData?.error ? (
                      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                        <p className="text-xs text-red-400 font-mono mb-1">{trackingData.error}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Gagal memuat timeline perjalanan.</p>
                      </div>
                    ) : trackingData?.history ? (() => {
                      const rawDate = order.timeline?.ordered_at || order.created_at;
                      const baseDate = rawDate ? new Date(rawDate).getTime() : Date.now();
                      const internalEvents = [
                        { note: "Pesanan berhasil dibuat. Menunggu konfirmasi transmisi.", status: "DIBUAT", updated_at: new Date(baseDate).toISOString(), isInternal: true }
                      ];
                      
                      if (order.status !== "Belum Bayar") {
                        const paidAt = order.timeline?.paid_at ? new Date(order.timeline.paid_at).toISOString() : new Date(baseDate + 5 * 60000).toISOString();
                        const packedAt = order.timeline?.confirmed_at ? new Date(order.timeline.confirmed_at).toISOString() : new Date(baseDate + 120 * 60000).toISOString();
                        internalEvents.push({ note: `Pembayaran terverifikasi via ${order.payment?.method || "Payment Gateway"}.`, status: "DIBAYAR", updated_at: paidAt, isInternal: true });
                        internalEvents.push({ note: "Pesanan dikemas dengan standar keamanan oleh Tim Basecamp.", status: "DIKEMAS", updated_at: packedAt, isInternal: true });
                      }
                      
                      const combined = [...(trackingData.history || []), ...internalEvents]
                        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

                      return (
                      <div className="bg-white/40 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-8 flex items-center gap-2">
                          <Navigation className="w-3 h-3 text-[#F77F00]" /> Jurnal Perjalanan
                        </h4>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#F77F00] before:to-transparent">
                          {combined.map((event: any, i: number) => (
                            <div key={i} className="relative flex items-start gap-4">
                              <div className="absolute left-0 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#111] border-2 border-[#F77F00] ring-4 ring-white dark:ring-[#111] z-10">
                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#F77F00] animate-ping' : 'bg-neutral-300 dark:bg-neutral-600'}`}></div>
                              </div>
                              <div className="pl-10 w-full">
                                <p className="text-sm font-bold text-[#212529] dark:text-white leading-tight mb-1">{event.note}</p>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                  <p className="text-[10px] font-mono text-[#F77F00] uppercase tracking-wider">{new Date(event.updated_at).toLocaleString('id-ID')}</p>
                                  <span className="hidden md:inline text-neutral-300 dark:text-neutral-700">&bull;</span>
                                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{event.status}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      );
                    })() : null}
                  </div>
                )}
              </div>
            </div>

            {/* Manifest Gear */}
            <div className="bg-white/40 dark:bg-[#111111]/80 backdrop-blur-2xl border border-black/10 dark:border-white/5 rounded-3xl p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-8 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F77F00]" /> Manifest Gear
              </h3>
              <div className="space-y-5">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-5 items-start group p-4 bg-white/30 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#F77F00]/30 transition-colors">
                    <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 dark:border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#212529] dark:text-white uppercase tracking-wider mb-1 line-clamp-2">{item.name}</h4>
                      <p className="text-[10px] font-mono text-[#6C757D] mb-2">Variasi: {item.variant} &bull; Qty: {item.qty}</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-black text-[#F77F00]">Rp {item.price.toLocaleString('id-ID')}</span>
                        {item.qty > 1 && (
                          <span className="text-[10px] font-mono text-[#6C757D]">(@Rp {Math.round(item.price / item.qty).toLocaleString('id-ID')}/pcs)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary di dalam Manifest */}
              <div className="mt-8 pt-6 border-t border-dashed border-black/20 dark:border-white/20 space-y-3 font-mono text-[10px] uppercase tracking-widest text-[#6C757D] dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal ({order.items.reduce((a: number, i: any) => a + i.qty, 0)} item)</span>
                  <span className="font-bold text-[#212529] dark:text-white">Rp {order.payment.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-[#212529] dark:text-white">{order.payment.shipping_cost > 0 ? `Rp ${order.payment.shipping_cost.toLocaleString('id-ID')}` : 'GRATIS'}</span>
                </div>
                {order.payment.discount < 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Diskon / Promo</span>
                    <span className="font-bold">-Rp {Math.abs(order.payment.discount).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 border-t border-black/10 dark:border-white/10">
                  <span className="text-xs font-black text-[#212529] dark:text-white normal-case tracking-widest">Total Pesanan</span>
                  <span className="text-2xl font-black text-[#F77F00] tracking-tighter">Rp {order.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Shipping & Payment */}
          <div className="space-y-8">

            {/* Titik Drop-Off */}
            <div className="bg-white/40 dark:bg-[#111111]/80 backdrop-blur-2xl border border-black/10 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F77F00]/50 transition-colors">
              <MapPin className="absolute -right-4 -top-4 w-32 h-32 text-black/5 dark:text-white/5 group-hover:text-[#F77F00]/10 transition-colors" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-6 flex items-center gap-2">
                <Map className="w-4 h-4 text-[#F77F00]" /> Titik Drop-Off
              </h3>
              <p className="text-base font-black uppercase tracking-tight text-[#212529] dark:text-white leading-snug">
                {order.shipping.address.replace(/\n/g, ', ')}
              </p>
            </div>

            {/* Ekspedisi Logistik */}
            <div className="bg-white/40 dark:bg-[#111111]/80 backdrop-blur-2xl border border-black/10 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F77F00]/50 transition-colors">
              <Truck className="absolute -right-4 -top-4 w-32 h-32 text-black/5 dark:text-white/5 group-hover:text-[#F77F00]/10 transition-colors" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-6 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#F77F00]" /> Ekspedisi Logistik
              </h3>
              <p className="text-2xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-4">{order.shipping.courier}</p>
              <div className="mb-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#6C757D] block mb-1">Nomor Resi</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-[#F77F00]">{order.shipping.receipt || "MENUNGGU MANIFEST"}</span>
                  {order.shipping.receipt && order.shipping.receipt !== "-" && (
                    <button onClick={() => handleCopy(order.shipping.receipt)} className="p-1.5 bg-[#F77F00]/10 text-[#F77F00] rounded hover:bg-[#F77F00] hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
                  )}
                </div>
              </div>
            </div>
            {/* Receipt Summary */}
            <div className="bg-[#fcfaf8] dark:bg-[#1a1a1a] border border-black/10 dark:border-white/5 rounded-3xl relative overflow-hidden">
              {/* Jagged edge effect top */}
              <div className="h-3 w-full bg-[radial-gradient(circle,transparent,transparent_4px,#fcfaf8_4px,#fcfaf8_6px,transparent_6px)] dark:bg-[radial-gradient(circle,transparent,transparent_4px,#1a1a1a_4px,#1a1a1a_6px,transparent_6px)] bg-[length:10px_10px] bg-repeat-x absolute -top-1.5 left-0 z-10" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)' }}></div>
              
              <div className="p-8 pb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C757D] mb-8 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#F77F00]" /> Transaksi Final
                </h3>
                
                <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 mb-8 border-b border-dashed border-black/20 dark:border-white/20 pb-8">
                  <div className="flex justify-between">
                    <span>Metode via</span>
                    <span className="font-bold text-[#212529] dark:text-white">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#212529] dark:text-white">Rp {order.payment.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistik</span>
                    <span className="font-bold text-[#212529] dark:text-white">Rp {order.payment.shipping_cost.toLocaleString('id-ID')}</span>
                  </div>
                  {order.payment.discount < 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Promo</span>
                      <span className="font-bold">-Rp {Math.abs(order.payment.discount).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white">Total Akhir</span>
                  <span className="text-2xl font-black text-[#F77F00] tracking-tighter">Rp {order.total.toLocaleString('id-ID')}</span>
                </div>

                {/* Actions */}
                {order.status === "Belum Bayar" && (
                  <button onClick={handleCompletePayment} className="w-full py-4 bg-[#F77F00] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-[0_10px_30px_rgba(247,127,0,0.3)]">
                    Selesaikan Pembayaran
                  </button>
                )}
                {order.status === "Dikirim" && (
                  <button onClick={handleConfirmReceived} disabled={actionLoading} className="w-full py-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] disabled:opacity-60">
                    {actionLoading ? "Memproses..." : "Konfirmasi Diterima"}
                  </button>
                )}
                {order.status === "Selesai" && (
                  <button onClick={handleBuyAgain} className="w-full py-4 border-2 border-black dark:border-white text-[#212529] dark:text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                    Beli Lagi (Re-Stock)
                  </button>
                )}
              </div>

              {/* Jagged edge effect bottom */}
              <div className="h-3 w-full bg-[radial-gradient(circle,transparent,transparent_4px,#fcfaf8_4px,#fcfaf8_6px,transparent_6px)] dark:bg-[radial-gradient(circle,transparent,transparent_4px,#1a1a1a_4px,#1a1a1a_6px,transparent_6px)] bg-[length:10px_10px] bg-repeat-x absolute -bottom-1.5 left-0 z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
