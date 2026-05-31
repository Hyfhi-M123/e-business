"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Star, Camera, Upload, CheckCircle2, ChevronRight, Package } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useAuth } from "../../../context/AuthContext";

export default function NilaiPage() {
  const pathname = usePathname();
  // pathname is /pesanan/[id]/nilai. So we split and get the third from last.
  const pathParts = pathname.split('/');
  const idPesanan = pathParts[pathParts.length - 2] || "";
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const found = data.orders?.find((o: any) => o.id === idPesanan);
        if (found) setOrder(found);
      } catch (e) {
        console.error("Failed to fetch order:", e);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [idPesanan]);

  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [reviews, setReviews] = useState<{ [key: string]: string }>({});
  const [hoveredStar, setHoveredStar] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (itemId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(ratings).length === 0) return;
    
    setIsSubmitting(true);
    try {
      const promises = Object.entries(ratings).map(([productId, rating]) => {
        return fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            user_email: user?.email || "guest@trailforge.id",
            user_name: user?.user_metadata?.full_name || "Guest User",
            rating: rating,
            comment: reviews[productId] || "",
          }),
        });
      });
      
      await Promise.all(promises);
      
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/pesanan/${order.id}`);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit reviews:", err);
      alert("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Penilaian Terkirim!</h1>
          <p className="text-[#6C757D] dark:text-neutral-400 max-w-sm mb-8">Terima kasih atas ulasan Anda. Masukan Anda membantu para penjelajah lain dalam memilih perlengkapan terbaik.</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
          <h1 className="text-3xl font-black uppercase mb-4 text-red-500">Pesanan Tidak Ditemukan</h1>
          <Link href="/profil?tab=pesanan" className="px-6 py-3 bg-[#212529] dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-[#F77F00] transition-colors rounded-lg">
            Kembali ke Riwayat Pesanan
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />

      <div className="max-w-[800px] mx-auto w-full px-6 pt-32 pb-24 flex-1">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-8">
          <Link href={`/pesanan/${order.id}`} className="hover:text-[#F77F00] transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Kembali ke Rincian</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212529] dark:text-white">Nilai Produk</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none text-[#212529] dark:text-white">
            Nilai Pesanan.
          </h1>
          <p className="text-[#6C757D] dark:text-neutral-500 text-xs font-mono tracking-widest uppercase">
            ID Pesanan: <span className="text-[#F77F00]">{order.id}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {order.items.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Product Header */}
              <div className="p-6 border-b border-black/5 dark:border-white/5 bg-[#f8f9fa] dark:bg-[#1a1a1a] flex gap-4 items-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#212529] dark:text-white line-clamp-1 mb-1">{item.name}</h4>
                  <p className="text-xs text-[#6C757D]">Variasi: {item.variant}</p>
                </div>
              </div>

              {/* Rating Body */}
              <div className="p-6 md:p-8">
                
                {/* Stars */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <span className="text-xs font-black uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mb-4">Kualitas Produk</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(prev => ({ ...prev, [item.id]: star }))}
                        onMouseLeave={() => setHoveredStar(prev => ({ ...prev, [item.id]: 0 }))}
                        onClick={() => handleRating(item.id, star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-10 h-10 transition-colors duration-200 ${
                            (hoveredStar[item.id] || ratings[item.id] || 0) >= star
                              ? "fill-[#F77F00] text-[#F77F00]"
                              : "fill-transparent text-neutral-300 dark:text-neutral-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#F77F00] uppercase tracking-widest mt-4 min-h-[16px]">
                    {ratings[item.id] === 5 ? "Sangat Baik" :
                     ratings[item.id] === 4 ? "Baik" :
                     ratings[item.id] === 3 ? "Cukup" :
                     ratings[item.id] === 2 ? "Buruk" :
                     ratings[item.id] === 1 ? "Sangat Buruk" : ""}
                  </span>
                </div>

                {/* Review Textarea */}
                <div className="mb-6 bg-[#f8f9fa] dark:bg-[#1a1a1a] rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
                  <textarea 
                    value={reviews[item.id] || ""}
                    onChange={(e) => setReviews(prev => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Bagaimana performa gear ini saat Anda gunakan berpetualang? Ceritakan pengalaman Anda (minimal 50 karakter)."
                    className="w-full h-32 p-4 bg-transparent resize-none outline-none text-sm text-[#212529] dark:text-white placeholder:text-neutral-400"
                  />
                  

                </div>

              </div>
            </div>
          ))}

          <div className="sticky bottom-6 z-10 pt-4">
            <button 
              type="submit"
              disabled={Object.keys(ratings).length === 0 || isSubmitting}
              className="w-full h-14 bg-[#212529] dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-[#F77F00] hover:text-black dark:hover:bg-[#F77F00] transition-colors rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Penilaian"}
            </button>
          </div>

        </form>

      </div>

      <Footer />
    </main>
  );
}
