"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Package, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GenericTrackPage() {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resi.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // Dummy redirect
      router.push(`/track/${resi}`);
    }, 1000);
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans">
      <Navbar />
      <div className="max-w-[800px] mx-auto w-full px-6 pt-36 pb-24 flex-1 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-8">
          <MapPin className="w-10 h-10 text-[#F77F00]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Lacak Pesanan</h1>
        <p className="text-[#6C757D] text-sm max-w-md mb-12">Masukkan ID Pesanan atau Nomor Resi Anda untuk melihat rute logistik dan status paket secara real-time.</p>
        
        <form onSubmit={handleTrack} className="w-full flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="text" 
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Contoh: TRF-991203"
              className="w-full h-16 bg-white dark:bg-[#121212] border-2 border-black/10 dark:border-white/10 pl-14 pr-4 text-sm font-black uppercase tracking-widest focus:border-[#F77F00] outline-none transition-colors text-[#212529] dark:text-white"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="h-16 px-10 bg-[#212529] dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#F77F00] hover:text-black transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lacak Gear"}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
