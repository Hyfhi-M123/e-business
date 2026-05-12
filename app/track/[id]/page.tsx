"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, Truck, MapPin, CheckCircle2, Clock, Phone,
  Copy, RefreshCw, ChevronRight, Navigation, Box, ShieldCheck,
  User, Building2, Warehouse, PackageCheck, CircleDot, CreditCard,
  Timer, PackageOpen, AlertTriangle
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DUMMY_ORDERS, Order, TrackingEvent } from "../../lib/orders";

// ── Lifecycle Steps ──
const LIFECYCLE = [
  { key: "Belum Bayar", label: "Bayar", icon: CreditCard },
  { key: "Menunggu Konfirmasi", label: "Konfirmasi", icon: Timer },
  { key: "Dikemas", label: "Dikemas", icon: PackageOpen },
  { key: "Dikirim", label: "Dikirim", icon: Truck },
  { key: "Selesai", label: "Selesai", icon: CheckCircle2 },
];

function getStepIndex(status: string) {
  const idx = LIFECYCLE.findIndex(s => s.key === status);
  return idx >= 0 ? idx : 0;
}

function getIcon(icon: string) {
  const cls = "w-5 h-5";
  const map: Record<string, JSX.Element> = {
    check: <CheckCircle2 className={cls} />, box: <Box className={cls} />,
    warehouse: <Warehouse className={cls} />, truck: <Truck className={cls} />,
    navigation: <Navigation className={cls} />, building: <Building2 className={cls} />,
    delivered: <PackageCheck className={cls} />,
  };
  return map[icon] || <CircleDot className={cls} />;
}

function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }); }

// ── Phase Message ──
function getPhaseInfo(order: Order) {
  switch (order.status) {
    case "Belum Bayar": return { title: "Menunggu Pembayaran", desc: "Segera selesaikan pembayaran sebelum pesanan dibatalkan otomatis.", color: "from-red-600 to-red-700", icon: <CreditCard className="w-16 h-16 text-white/80" /> };
    case "Menunggu Konfirmasi": return { title: "Menunggu Konfirmasi Penjual", desc: "Pembayaran berhasil! Pesanan sedang menunggu konfirmasi dari penjual.", color: "from-amber-500 to-amber-600", icon: <Timer className="w-16 h-16 text-white/80" /> };
    case "Dikemas": return { title: "Pesanan Sedang Dikemas", desc: "Penjual sedang menyiapkan pesananmu. Paket akan segera diserahkan ke kurir.", color: "from-blue-600 to-blue-700", icon: <PackageOpen className="w-16 h-16 text-white/80" /> };
    case "Dikirim": return { title: "Paket Dalam Pengiriman", desc: `Paket sedang diantar oleh ${order.shipping.courier} ${order.shipping.service}.`, color: "from-[#212529] to-[#343a40]", icon: <Truck className="w-16 h-16 text-white/80" /> };
    case "Selesai": return { title: "Pesanan Selesai", desc: "Paket telah diterima. Terima kasih telah berbelanja di TrailForge!", color: "from-emerald-600 to-emerald-700", icon: <CheckCircle2 className="w-16 h-16 text-white/80" /> };
    default: return { title: "Status Pesanan", desc: "", color: "from-neutral-700 to-neutral-800", icon: <Package className="w-16 h-16 text-white/80" /> };
  }
}

export default function TrackingPage() {
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";
  const order = DUMMY_ORDERS.find(o => o.id === orderId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTracking, setRealTracking] = useState<any>(null);

  useEffect(() => {
    if (order && (order.status === "Dikirim" || order.status === "Selesai") && order.shipping.receipt !== "-") {
      const fetchTracking = async () => {
        try {
          const res = await fetch(`/api/shipping/track?waybill=${order.shipping.receipt}&courier=${order.shipping.courier_code}`);
          const data = await res.json();
          if (data.success && data.history) {
            setRealTracking(data.history);
          }
        } catch (e) {
          console.error("Failed to fetch tracking", e);
        }
      };
      fetchTracking();
    }
  }, [order]);

  if (!order) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-32">
          <AlertTriangle className="w-16 h-16 text-[#6C757D]" />
          <h1 className="text-2xl font-black uppercase">Pesanan Tidak Ditemukan</h1>
          <Link href="/profil?tab=pesanan" className="text-sm text-[#F77F00] font-bold uppercase tracking-widest hover:underline">Kembali ke Pesanan</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const stepIdx = getStepIndex(order.status);
  const phase = getPhaseInfo(order);
  const hasTracking = order.shipping.tracking && order.shipping.tracking.length > 0;
  const hasReceipt = order.shipping.receipt !== "-";

  const handleRefresh = async () => { 
    setIsRefreshing(true);
    if (order && (order.status === "Dikirim" || order.status === "Selesai") && order.shipping.receipt !== "-") {
      try {
        const res = await fetch(`/api/shipping/track?waybill=${order.shipping.receipt}&courier=${order.shipping.courier_code}`);
        const data = await res.json();
        if (data.success && data.history) {
          setRealTracking(data.history);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setTimeout(() => setIsRefreshing(false), 500); 
  };
  const handleCopy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <div className="max-w-[900px] mx-auto w-full px-6 pt-32 pb-24">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-8">
          <Link href="/profil?tab=pesanan" className="hover:text-[#F77F00] transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Pesanan Saya</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">{order.id}</span>
        </div>

        {/* ── HERO STATUS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl p-8 md:p-10 mb-8 bg-gradient-to-br ${phase.color}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="shrink-0">{phase.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">{phase.title}</h1>
              <p className="text-sm text-white/70 max-w-lg">{phase.desc}</p>
            </div>
            <button onClick={handleRefresh} disabled={isRefreshing}
              className="self-start px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2 border border-white/10">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> {isRefreshing ? "Memuat..." : "Refresh"}
            </button>
          </div>
        </motion.div>

        {/* ── LIFECYCLE STEPPER ── */}
        <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            {LIFECYCLE.map((step, i) => {
              const done = i <= stepIdx;
              const active = i === stepIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      active ? "bg-[#F77F00] text-white shadow-lg shadow-orange-500/30 scale-110" :
                      done ? "bg-emerald-500 text-white" : "bg-black/5 dark:bg-white/5 text-[#ADB5BD]"
                    }`}>
                      {done && !active ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest text-center ${
                      active ? "text-[#F77F00]" : done ? "text-emerald-600 dark:text-emerald-400" : "text-[#ADB5BD]"
                    }`}>{step.label}</span>
                  </div>
                  {i < LIFECYCLE.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-2 mt-[-20px] ${i < stepIdx ? "bg-emerald-500" : "bg-black/5 dark:bg-white/5"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* PHASE: Belum Bayar */}
            {order.status === "Belum Bayar" && (
              <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-8 text-center">
                <CreditCard className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-60" />
                <h3 className="text-xl font-black uppercase mb-2">Selesaikan Pembayaran</h3>
                <p className="text-sm text-[#6C757D] mb-6 max-w-md mx-auto">Segera lakukan pembayaran via {order.payment.method} agar pesanan dapat segera diproses oleh penjual.</p>
                <button className="px-8 py-4 bg-[#F77F00] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#e06f00] transition-colors shadow-lg shadow-orange-500/20">
                  Bayar Sekarang — Rp {order.total.toLocaleString("id-ID")}
                </button>
              </div>
            )}

            {/* PHASE: Menunggu Konfirmasi */}
            {order.status === "Menunggu Konfirmasi" && (
              <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-8 text-center">
                <Timer className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-black uppercase mb-2">Sedang Diproses Penjual</h3>
                <p className="text-sm text-[#6C757D] mb-4 max-w-md mx-auto">Pembayaran via {order.payment.method} sudah diterima pada {order.timeline.paid_at ? fmtDate(order.timeline.paid_at) : "-"}. Penjual akan segera mengkonfirmasi pesananmu.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-xs font-bold rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Menunggu respons penjual
                </div>
              </div>
            )}

            {/* PHASE: Dikemas */}
            {order.status === "Dikemas" && (
              <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-8 text-center">
                <PackageOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase mb-2">Pesanan Sedang Dikemas</h3>
                <p className="text-sm text-[#6C757D] mb-4 max-w-md mx-auto">Penjual mengkonfirmasi pesananmu pada {order.timeline.confirmed_at ? fmtDate(order.timeline.confirmed_at) : "-"} dan sedang menyiapkan paket.</p>
                {order.shipping.courier && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-bold rounded-full">
                    <Truck className="w-3 h-3" /> Akan dikirim via {order.shipping.courier} {order.shipping.service}
                  </div>
                )}
              </div>
            )}

            {/* PHASE: Dikirim / Selesai → TRACKING TIMELINE */}
            {hasTracking && (
              <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-[#212529] dark:bg-[#1a1a1a] px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-black uppercase tracking-tighter text-white flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#F77F00]" /> Riwayat Pengiriman
                  </h2>
                  <span className="text-[10px] font-mono text-white/50">{realTracking ? realTracking.length : order.shipping.tracking!.length} AKTIVITAS</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-black/5 dark:bg-white/5" />
                    {[...(realTracking || order.shipping.tracking!)].sort((a,b) => new Date(b.updated_at || b.time).getTime() - new Date(a.updated_at || a.time).getTime()).map((event: any, i: number) => {
                      const isReal = !!realTracking;
                      const isLatest = i === 0;
                      const status = isReal ? event.status : event.status;
                      const isDel = status === "delivered";
                      const title = isReal ? (status === "delivered" ? "Paket Terkirim" : status === "dropping_off" ? "Dalam Perjalanan" : status === "allocated" ? "Sedang Diproses" : "Status Update") : event.title;
                      const desc = isReal ? event.note : event.desc;
                      const time = isReal ? event.updated_at : event.time;
                      const iconType = isReal ? (status === "delivered" ? "delivered" : status === "dropping_off" ? "navigation" : "truck") : event.icon;

                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className={`relative flex gap-5 pb-8 last:pb-0 ${isLatest ? "" : "opacity-60"}`}>
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                            isLatest ? (isDel ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-[#F77F00] text-white shadow-orange-500/30")
                            : "bg-white dark:bg-[#222] text-[#6C757D] border border-black/10 dark:border-white/10 shadow-none"
                          }`}>
                            {getIcon(iconType)}
                            {isLatest && !isDel && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#F77F00] rounded-full animate-ping" />}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className={`text-sm font-black uppercase tracking-tight ${isLatest ? "text-[#212529] dark:text-white" : "text-[#6C757D]"}`}>{title}</h3>
                                <p className={`text-xs mt-1 ${isLatest ? "text-[#6C757D]" : "text-[#ADB5BD]"}`}>{desc}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[10px] font-bold text-[#6C757D]">{fmtDate(time)}</p>
                                <p className="text-[10px] font-mono text-[#ADB5BD]">{fmtTime(time)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="flex flex-col gap-6">

            {/* Courier Info — only when shipped */}
            {hasReceipt && (order.status === "Dikirim" || order.status === "Selesai") && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#6C757D] mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F77F00]" /> Info Pengiriman
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#6C757D] text-xs">Kurir</span><span className="font-bold">{order.shipping.courier} {order.shipping.service}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6C757D] text-xs">No. Resi</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-xs">{order.shipping.receipt}</span>
                      <button onClick={() => handleCopy(order.shipping.receipt)} className="text-[#6C757D] hover:text-[#F77F00]"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Driver Info — only when shipped & driver assigned */}
            {order.shipping.driver && (order.status === "Dikirim" || order.status === "Selesai") && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#6C757D] mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F77F00]" /> Kurir Pengantar
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#F77F00]/10 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-[#F77F00]" /></div>
                  <div>
                    <p className="font-bold text-sm">{order.shipping.driver.name}</p>
                    <p className="text-[10px] font-mono text-[#6C757D]">{order.shipping.driver.plate}</p>
                  </div>
                </div>
                <a href={`tel:${order.shipping.driver.phone}`}
                  className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                  <Phone className="w-4 h-4" /> Hubungi Kurir
                </a>
              </motion.div>
            )}

            {/* Route — only when shipped */}
            {(order.status === "Dikirim" || order.status === "Selesai") && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#6C757D] mb-4 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#F77F00]" /> Rute
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center"><div className="w-7 h-7 bg-blue-500/10 rounded-full flex items-center justify-center"><Warehouse className="w-3.5 h-3.5 text-blue-500" /></div><div className="w-[2px] flex-1 bg-black/5 dark:bg-white/5 my-1" /></div>
                    <div className="pb-3"><p className="text-[9px] font-bold uppercase text-blue-500">Asal</p><p className="text-xs font-bold">Gudang TrailForge</p></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-emerald-500" /></div>
                    <div><p className="text-[9px] font-bold uppercase text-emerald-500">Tujuan</p><p className="text-xs font-bold">{order.shipping.address.split("\n")[0]}</p></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Order Summary — always visible */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6C757D] mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F77F00]" /> Pesanan
              </h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 mb-3 last:mb-0">
                  <div className="w-12 h-12 bg-[#f8f9fa] dark:bg-[#0a0a0a] rounded-lg overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{item.name}</p>
                    <p className="text-[10px] text-[#6C757D]">x{item.qty}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-[#6C757D]">Total</span>
                <span className="text-lg font-black text-[#F77F00]">Rp {order.total.toLocaleString("id-ID")}</span>
              </div>
              <Link href={`/pesanan/${order.id}`}>
                <button className="w-full mt-4 py-3 bg-black/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  Detail Pesanan <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </motion.div>

            <div className="bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-2xl p-5 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Dilindungi TrailForge</p>
                <p className="text-[9px] text-[#6C757D] font-mono mt-0.5">Garansi 100% penggantian jika paket hilang atau rusak.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
