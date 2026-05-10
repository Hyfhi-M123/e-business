"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, CheckCircle2, MapPin, Package, ChevronRight, Copy } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DUMMY_ORDERS } from "../../lib/orders";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

// Import Leaflet dynamically to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon
const initLeaflet = async () => {
  const L = await import('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export default function TrackingPage() {
  const pathname = usePathname();
  const idPesanan = pathname.split('/').pop() || "TRF-991203";
  
  const order = DUMMY_ORDERS.find(o => o.id === idPesanan) || DUMMY_ORDERS[0];
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    initLeaflet().then(() => setMapReady(true));
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin ke clipboard!");
  };

  const trackingEvents = [
    { time: "Hari Ini, 08:30", desc: "Pesanan dibawa oleh kurir menuju alamat tujuan.", location: "Jakarta Selatan", active: true },
    { time: "Kemarin, 21:15", desc: "Pesanan tiba di fasilitas sortir transit utama.", location: "Jakarta Hub", active: false },
    { time: "Kemarin, 14:00", desc: "Pesanan diserahkan ke pihak logistik.", location: "TrailForge HQ", active: false },
    { time: "Kemarin, 10:30", desc: "Pesanan selesai dikemas dan menunggu penjemputan.", location: "TrailForge HQ", active: false },
    { time: "Kemarin, 09:05", desc: "Pembayaran terverifikasi. Pesanan sedang diproses.", location: "Sistem", active: false }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />

      <div className="max-w-[1000px] mx-auto w-full px-6 pt-32 pb-24 flex-1">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-8">
          <Link href={`/pesanan/${order.id}`} className="hover:text-[#F77F00] transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Kembali ke Rincian</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">Pelacakan Global</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-[#212529] dark:text-white">
            Lacak Pesanan.
          </h1>
          <p className="text-[#6C757D] dark:text-neutral-500 text-xs font-mono tracking-widest uppercase">
            ID Pesanan: <span className="text-[#F77F00]">{order.id}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Bagian Kiri: Peta & Detail */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            
            {/* Peta Peringkat */}
            <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-2 h-[400px] relative z-0">
              {mapReady ? (
                <MapContainer center={[-6.229728, 106.811463]} zoom={13} className="w-full h-full z-0" zoomControl={false}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {/* Kurir Marker */}
                  <Marker position={[-6.229728, 106.811463]}>
                    <Popup className="font-sans font-bold text-xs uppercase tracking-widest">
                      Kurir JNE - Menuju Lokasi
                    </Popup>
                  </Marker>
                  {/* Tujuan Marker */}
                  <Marker position={[-6.225, 106.80]}>
                    <Popup className="font-sans font-bold text-xs uppercase tracking-widest">
                      Lokasi Tujuan (SCBD)
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 animate-pulse flex items-center justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Memuat Peta Satelit...</span>
                </div>
              )}
            </div>

            {/* Info Resi */}
            <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 block mb-2">Layanan Logistik</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center rounded-lg">
                    <Truck className="w-5 h-5 text-[#F77F00]" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tighter text-[#212529] dark:text-white text-lg leading-none mb-1">{order.shipping.courier}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#6C757D]">{order.shipping.receipt}</span>
                      {order.shipping.receipt !== "-" && (
                        <button onClick={() => handleCopy(order.shipping.receipt)} className="text-[#F77F00] hover:text-[#e06f00]"><Copy className="w-3 h-3" /></button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 block mb-2">Status Saat Ini</span>
                <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> IN TRANSIT
                </span>
              </div>
            </div>

          </div>

          {/* Bagian Kanan: Timeline */}
          <div className="lg:w-1/3 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-6 md:p-8">
            <h3 className="font-black uppercase tracking-widest text-sm border-b border-black/10 dark:border-white/10 pb-4 mb-8 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F77F00]" /> Riwayat Perjalanan
            </h3>

            <div className="relative pl-6 border-l-2 border-black/10 dark:border-white/10 space-y-10">
              {trackingEvents.map((ev: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Circle marker */}
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-white dark:bg-[#121212] flex items-center justify-center
                    ${ev.active ? "border-[#F77F00] shadow-[0_0_10px_rgba(247,127,0,0.5)]" : "border-black/20 dark:border-white/20"}
                  `}>
                    {ev.active && <div className="w-1.5 h-1.5 bg-[#F77F00] rounded-full animate-pulse" />}
                  </div>
                  
                  <div className="mb-2">
                    <span className={`text-xs font-black uppercase tracking-widest block mb-1 ${ev.active ? "text-[#F77F00]" : "text-[#212529] dark:text-white"}`}>
                      {ev.time}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">
                      {ev.location}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#495057] dark:text-neutral-300 leading-relaxed">
                    {ev.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
