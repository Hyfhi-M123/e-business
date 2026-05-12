"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2, ShieldCheck, MapPin, CreditCard, Truck, Tag, Lock, ArrowRight, ChevronLeft, Package, Plus, Minus, Map, Crosshair, AlertTriangle, Fingerprint, ShoppingBag, QrCode, Wallet, Building2, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import "leaflet/dist/leaflet.css";

export default function KeranjangPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, selectedItemIds: contextSelectedIds, toggleSelect, toggleSelectAll } = useCart();
  
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const isBuyNowMode = searchParams.get("mode") === "buynow";

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInsured, setIsInsured] = useState(false);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);

  // Biteship Shipping Rates
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [postalCode, setPostalCode] = useState("12190");
  const [ratesError, setRatesError] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentToken, setPaymentToken] = useState("");

  useEffect(() => {
    if (paymentToken && (window as any).snap) {
      (window as any).snap.embed(paymentToken, {
        embedId: 'snap-container',
        onSuccess: function(result: any) {
          router.push(`/pembayaran?method=${paymentMethod}&total=${finalTotal}&status=success`);
        },
        onPending: function(result: any) {
          router.push(`/pembayaran?method=${paymentMethod}&total=${finalTotal}&status=pending`);
        },
        onError: function(result: any) {
          alert("Pembayaran gagal!");
          setIsProcessing(false);
          setPaymentToken("");
        },
        onClose: function() {
          setIsProcessing(false);
          setPaymentToken("");
        }
      });
    }
  }, [paymentToken]);

  useEffect(() => {
    if (isBuyNowMode) {
      const buyNowData = sessionStorage.getItem("trailforge_buynow");
      if (buyNowData) {
        const parsed = JSON.parse(buyNowData);
        setCheckoutItems(parsed);
      }
    } else {
      setCheckoutItems(cartItems);
    }
  }, [isBuyNowMode, cartItems]);

  const selectedItemIds = isBuyNowMode ? checkoutItems.map(i => i.id) : contextSelectedIds;

  const handleLocalRemove = (id: string) => {
    if (isBuyNowMode) {
      setCheckoutItems(prev => prev.filter(i => i.id !== id));
      // In buy now mode, removing the only item means empty cart
    } else {
      removeFromCart(id);
    }
  };

  const handleLocalUpdateQuantity = (id: string, delta: number) => {
    if (isBuyNowMode) {
      setCheckoutItems(prev => prev.map(i => {
        if (i.id === id) return { ...i, quantity: Math.max(1, i.quantity + delta) };
        return i;
      }));
    } else {
      updateQuantity(id, delta);
    }
  };

  const selectedCheckoutItems = checkoutItems.filter(i => selectedItemIds.includes(i.id));
  const checkoutTotal = selectedCheckoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Leaflet Map Init
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if ((mapRef.current as any)?._leaflet_id) return;
      
      const lat = -6.2278;
      const lng = 106.8080; // SCBD Coordinates

      const map = L.map(mapRef.current!, { zoomControl: false, dragging: false, scrollWheelZoom: false }).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
      mapInstance.current = map;
      
      // Mencegah map menjadi abu-abu atau hitam karena telat memuat dimensi
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 500);
    };
    initMap();
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const FREE_SHIPPING_THRESHOLD = 2500000;
  const isFreeShipping = checkoutTotal >= FREE_SHIPPING_THRESHOLD;
  
  const shippingCost = isFreeShipping ? 0 : (selectedRate ? selectedRate.price : 0);

  // Fetch shipping rates from Biteship API
  const fetchShippingRates = async (destPostalCode?: string) => {
    const code = destPostalCode || postalCode;
    if (!code || code.length < 5) return;
    
    setIsLoadingRates(true);
    setRatesError("");
    
    try {
      const items = selectedCheckoutItems.map(item => ({
        name: item.name,
        value: item.price,
        weight: 1200,
        quantity: item.quantity,
        length: 30,
        width: 20,
        height: 15,
      }));

      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_postal_code: parseInt(code),
          items,
        }),
      });

      const data = await res.json();
      
      if (data.rates && data.rates.length > 0) {
        setShippingRates(data.rates);
        // Auto-select cheapest option
        setSelectedRate(data.rates[0]);
      } else {
        setRatesError("Tidak ditemukan layanan pengiriman untuk kode pos ini.");
      }
    } catch (err) {
      setRatesError("Gagal memuat ongkos kirim. Silakan coba lagi.");
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Auto-fetch rates on mount
  useEffect(() => {
    if (selectedCheckoutItems.length > 0) {
      fetchShippingRates();
    }
  }, [selectedCheckoutItems.length]);

  const totalOriginalPrice = selectedCheckoutItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const totalProductDiscount = totalOriginalPrice - checkoutTotal;

  const promoDiscount = isPromoApplied ? checkoutTotal * 0.1 : 0;
  const insuranceCost = isInsured ? 15000 : 0;
  const finalTotal = checkoutTotal + shippingCost - promoDiscount + insuranceCost;

  function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "TRAILFORGE10") {
      setIsPromoApplied(true);
    } else {
      alert("Kode promo tidak valid. Coba 'TRAILFORGE10'");
      setIsPromoApplied(false);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    const items = selectedCheckoutItems.map(item => ({
      id: item.id,
      price: isPromoApplied ? item.price * 0.9 : item.price,
      quantity: item.quantity,
      name: item.name
    }));

    // Tambahkan biaya ongkir dan asuransi sebagai item terpisah
    if (shippingCost > 0) items.push({ id: "SHIPPING", price: shippingCost, quantity: 1, name: "Biaya Pengiriman" });
    if (insuranceCost > 0) items.push({ id: "INSURANCE", price: insuranceCost, quantity: 1, name: "Asuransi Pengiriman" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: "TRF-" + Math.floor(Math.random() * 100000000),
          gross_amount: finalTotal,
          items: items,
          payment_type: paymentMethod, // Filter opsi Midtrans Snap
          customer_details: {
            first_name: "Alex",
            last_name: "Mercer",
            email: "alex.mercer@example.com",
            phone: "081234567890"
          }
        })
      });

      const data = await response.json();

      if (data.token) {
        // Embed Midtrans Snap di dalam modal kita
        setPaymentToken(data.token);
      } else {
        console.warn("Midtrans Error:", data.error || data);
        alert("Gagal memproses pembayaran. Coba lagi.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan. Mengalihkan ke Simulasi Pembayaran...");
      router.push(`/pembayaran?method=${paymentMethod}&total=${finalTotal}`);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-32 h-32 border border-black/10 dark:border-white/10 flex items-center justify-center mb-10 rotate-45">
            <div className="-rotate-45 text-[#6C757D] dark:text-neutral-500 font-mono text-xs tracking-widest">KOSONG</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">Belum Ada Pesanan</h1>
          <p className="text-[#6C757D] dark:text-neutral-400 font-mono text-base tracking-widest uppercase mb-12 max-w-lg">Silakan kembali berbelanja untuk menambahkan produk.</p>
          <Link href="/katalog" className="px-10 py-5 bg-[#F77F00] dark:bg-orange-500 text-neutral-950 font-black uppercase tracking-widest text-xs hover:bg-[#e06f00] dark:hover:bg-orange-400 transition-colors flex items-center gap-4">
            <ChevronLeft className="w-5 h-5" /> KEMBALI BELANJA
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""} strategy="lazyOnload" />
      
      {/* Midtrans Embed Modal */}
      <AnimatePresence>
        {paymentToken && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1a1a1a] rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="bg-[#212529] px-6 py-4 flex justify-between items-center border-b border-white/10">
                <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Selesaikan Pembayaran
                </h3>
                <button 
                  onClick={() => { setPaymentToken(""); setIsProcessing(false); }} 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <Crosshair className="w-4 h-4 rotate-45" />
                </button>
              </div>
              <div id="snap-container" className="w-full min-h-[500px]"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-36 flex flex-col xl:flex-row gap-10 xl:gap-20">
        
        {/* ================================================== */}
        {/* KIRI: ALAMAT, PENGIRIMAN, PEMBAYARAN */}
        {/* ================================================== */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Header & Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#212529] text-white dark:bg-white dark:text-black flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Secure Checkout</h1>
                <p className="text-[#F77F00] font-mono text-xs tracking-widest uppercase flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-pulse"></span> Koneksi Pembayaran Aman Terenkripsi
                </p>
              </div>
            </div>

            {/* Stepper Standar */}
            <div className="flex items-center w-full mt-10">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><ShoppingBag className="w-4 h-4"/></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">1. Keranjang</span>
              </div>
              <div className="h-[2px] flex-1 bg-emerald-500/50"></div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#F77F00] flex items-center justify-center text-white animate-pulse"><ShieldCheck className="w-4 h-4"/></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F77F00]">2. Checkout</span>
              </div>
              <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[#6C757D]"><CreditCard className="w-4 h-4"/></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D]">3. Pembayaran</span>
              </div>
            </div>
          </div>

          {/* 1. Daftar Pesanan */}
          <section className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 shadow-sm">
            <div className="bg-[#212529] dark:bg-[#1a1a1a] px-6 py-4 flex justify-between items-center border-b border-white/10">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                <Package className="w-5 h-5 text-[#F77F00]" /> Daftar Pesanan
              </h2>
              <span className="text-[10px] font-mono text-white/50">{selectedCheckoutItems.length} BARANG</span>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Items List */}
              <div className="flex flex-col gap-6">
                {selectedCheckoutItems.map((item) => {
                  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                  return (
                  <div key={item.id} className="flex flex-col md:flex-row gap-6 items-start relative group border border-black/5 dark:border-white/5 p-4 hover:border-black/20 dark:hover:border-white/20 transition-colors">
                    
                    <div className="w-full md:w-32 h-40 bg-[#f8f9fa] dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1581553680321-4fffae59fdda?w=400&q=80" }} />
                      {hasDiscount && (
                        <div className="absolute top-2 -left-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">SALE</div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full w-full">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-black uppercase tracking-tight line-clamp-2">{item.name}</h3>
                          <button onClick={() => handleLocalRemove(item.id)} className="text-[#6C757D] hover:text-red-600 transition-colors bg-[#f8f9fa] dark:bg-[#1a1a1a] p-2 rounded-full" title="Hapus Barang">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Normal Meta Data */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-black/5 dark:bg-white/5 px-2 py-1 text-[9px] font-mono text-[#6C757D] uppercase">Varian: Default</span>
                          <span className="bg-black/5 dark:bg-white/5 px-2 py-1 text-[9px] font-mono text-[#6C757D] uppercase">Berat: 1.2 KG</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 border-t border-black/5 dark:border-white/5 pt-4">
                        <div className="mb-4 sm:mb-0">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D] block mb-1">Harga Satuan</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-[#212529] dark:text-white">{formatRupiah(item.price)}</span>
                            {hasDiscount && <span className="text-xs text-red-600 line-through">{formatRupiah(item.originalPrice!)}</span>}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#6C757D]">Jumlah Barang</span>
                          <div className="flex items-center border-2 border-[#212529] dark:border-white">
                            <button onClick={() => handleLocalUpdateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center text-[#212529] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-black text-lg">-</button>
                            <span className="w-12 h-10 flex items-center justify-center text-base font-black text-[#212529] dark:text-white bg-black/5 dark:bg-white/5">{item.quantity}</span>
                            <button onClick={() => handleLocalUpdateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center text-[#212529] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-black text-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </section>

          {/* 2. Alamat Pengiriman (dipindah ke bawah daftar pesanan) */}
          <section className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 overflow-hidden relative shadow-sm">
            <div className="bg-[#212529] dark:bg-[#1a1a1a] px-6 py-4 flex justify-between items-center border-b border-white/10">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#F77F00]" /> Alamat Pengiriman
              </h2>
              <span className="text-[10px] font-mono text-[#F77F00] border border-[#F77F00]/50 px-2 py-1">LOKASI TERDETEKSI</span>
            </div>
            
            <div className="flex flex-col md:flex-row">
              {/* Real Leaflet Map */}
              <div className="w-full md:w-64 min-h-[240px] bg-[#f8f9fa] dark:bg-[#121212] relative overflow-hidden flex-shrink-0 border-r border-black/10 dark:border-white/10 z-0">
                 <div ref={mapRef} className="w-full h-full absolute inset-0 z-0"></div>
                 {/* Overlay to enforce techwear styling and prevent interaction */}
                 <div className="absolute inset-0 bg-[#F77F00]/20 pointer-events-none z-10 border-[4px] border-[#F77F00]/20"></div>
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black uppercase text-xl">Alex Mercer</h3>
                    <span className="text-neutral-500 font-mono text-sm block mt-1">No. HP: (+62) 812-3456-7890</span>
                  </div>
                  <button className="text-xs font-black uppercase tracking-widest text-[#F77F00] hover:text-[#e06f00] border-b-2 border-[#F77F00] transition-colors pb-1">
                    Ubah Alamat
                  </button>
                </div>
                
                <div className="bg-[#f8f9fa] dark:bg-[#1a1a1a] p-4 border border-black/5 dark:border-white/5">
                  <span className="inline-block px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest mb-3">RUMAH</span>
                  <p className="text-sm text-[#6C757D] dark:text-neutral-400 leading-relaxed font-mono">
                    Jl. Jendral Sudirman No. 45, Tower A, Lantai 12<br/>
                    Sudirman Central Business District (SCBD)<br/>
                    Kebayoran Baru, Jakarta Selatan, 12190
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Pilih Ekspedisi */}
          <section className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 shadow-sm">
            {/* Opsi Pengiriman — Biteship Integration */}
            <div className="bg-[#212529] dark:bg-[#1a1a1a] px-6 py-4 flex justify-between items-center border-b border-white/10">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#F77F00]" /> Pilih Ekspedisi
              </h2>
              {postalCode && (
                <span className="text-[10px] font-mono text-emerald-400 border border-emerald-400/50 px-2 py-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  KODE POS: {postalCode}
                </span>
              )}
            </div>

            <div className="p-6 md:p-8">

              {/* Loading State */}
              {isLoadingRates && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#F77F00]" />
                  <p className="text-xs font-mono uppercase tracking-widest text-[#6C757D] animate-pulse">Mencari ongkos kirim ke kode pos {postalCode}...</p>
                </div>
              )}

              {/* Error State */}
              {ratesError && !isLoadingRates && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">{ratesError}</p>
                    <button onClick={() => fetchShippingRates()} className="text-xs font-black text-red-500 uppercase tracking-widest mt-2 flex items-center gap-1 hover:text-red-700"><RefreshCw className="w-3 h-3" /> Coba Lagi</button>
                  </div>
                </div>
              )}

              {/* Courier Options */}
              {!isLoadingRates && shippingRates.length > 0 && (
                <div className="flex flex-col gap-3">
                  {shippingRates.map((rate, i) => {
                    const isSelected = selectedRate?.courier_code === rate.courier_code && selectedRate?.service_code === rate.service_code;
                    const courierLogos: Record<string, string> = { jne: "JNE", sicepat: "SCP", anteraja: "ANT", jnt: "J&T", ninja: "NJV", tiki: "TKI" };
                    return (
                      <label 
                        key={`${rate.courier_code}-${rate.service_code}-${i}`}
                        className={`relative p-5 border-2 cursor-pointer transition-all overflow-hidden flex items-center gap-5 ${
                          isSelected ? "border-[#F77F00] bg-white dark:bg-[#121212] shadow-md" : "border-black/10 dark:border-white/10 bg-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <input type="radio" name="shipping_rate" checked={isSelected} onChange={() => setSelectedRate(rate)} className="absolute opacity-0" />
                        {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-[#F77F00] flex items-center justify-center rounded-bl-lg"><ShieldCheck className="w-4 h-4 text-white" /></div>}
                        
                        {/* Courier Logo */}
                        <div className="w-14 h-14 bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                          <span className="text-sm font-black text-[#212529] dark:text-white">{courierLogos[rate.courier_code] || rate.courier_code.toUpperCase().slice(0,3)}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-black uppercase tracking-tighter text-[#212529] dark:text-white truncate">{rate.courier_name}</h4>
                          <p className="text-[10px] font-mono text-[#6C757D] truncate">{rate.service_name}</p>
                          <p className="text-[10px] font-mono text-[#6C757D] mt-1">Estimasi: {rate.duration}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <span className={`text-lg font-black ${
                            isFreeShipping ? "text-emerald-600 line-through" : "text-[#F77F00]"
                          }`}>{formatRupiah(rate.price)}</span>
                          {isFreeShipping && <p className="text-[10px] font-black text-emerald-600 uppercase">GRATIS</p>}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* No Address State */}
              {!isLoadingRates && shippingRates.length === 0 && !ratesError && (
                <div className="text-center py-8 text-[#6C757D]">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-xs font-mono uppercase tracking-widest">Atur alamat pengiriman untuk melihat pilihan kurir</p>
                </div>
              )}
            </div>
          </section>



        </div>

        {/* ================================================== */}
        {/* KANAN: THERMAL RECEIPT SUMMARY */}
        {/* ================================================== */}
        <div className="w-full xl:w-[450px]">
          <div className="sticky top-36">
            
            {/* The Receipt Design */}
            <div className="bg-[#fcfaf8] dark:bg-[#e6e2db] text-[#1a1a1a] shadow-2xl relative">
              {/* Jagged top edge */}
              <div className="h-4 w-full bg-[radial-gradient(circle,transparent,transparent_4px,#fcfaf8_4px,#fcfaf8_6px,transparent_6px)] dark:bg-[radial-gradient(circle,transparent,transparent_4px,#e6e2db_4px,#e6e2db_6px,transparent_6px)] bg-[length:12px_12px] bg-repeat-x absolute -top-2 left-0 z-10" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)' }}></div>
              
              <div className="p-8 md:p-10 border-b-2 border-dashed border-black/30">
                <div className="text-center mb-8">
                  {/* Fake Barcode */}
                  <div className="w-full h-16 flex mb-4 justify-center gap-1 opacity-70">
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="bg-black h-full" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
                    ))}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Ringkasan Belanja</h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60">ID Pesanan: #{Math.floor(Math.random() * 9000000) + 1000000}</p>
                </div>

                {/* Promo Code */}
                <form onSubmit={handleApplyPromo} className="flex gap-2 mb-8">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="PUNYA KODE PROMO?" 
                      className="w-full bg-white border-2 border-black p-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F77F00]"
                    />
                  </div>
                  <button type="submit" className="px-6 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-[#F77F00] transition-colors">Pakai</button>
                </form>

                {/* Kalkulasi Biaya (Receipt style) */}
                <div className="flex flex-col gap-3 font-mono text-xs uppercase text-black/80">
                  <div className="flex justify-between border-b border-dotted border-black/20 pb-2">
                    <span>SUBTOTAL PRODUK</span>
                    <span className={totalProductDiscount > 0 ? "line-through opacity-50" : "font-bold"}>{formatRupiah(totalOriginalPrice)}</span>
                  </div>
                  
                  {totalProductDiscount > 0 && (
                    <div className="flex justify-between border-b border-dotted border-black/20 pb-2 text-emerald-700">
                      <span>DISKON PRODUK</span>
                      <span>-{formatRupiah(totalProductDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-dotted border-black/20 pb-2 mt-2">
                    <span>ONGKOS KIRIM {selectedRate ? `(${selectedRate.courier_code.toUpperCase()})` : ""}</span>
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold">GRATIS</span>
                    ) : selectedRate ? (
                      <span className="font-bold">{formatRupiah(shippingCost)}</span>
                    ) : (
                      <span className="text-black/40 italic">Pilih kurir</span>
                    )}
                  </div>
                  
                  {isPromoApplied && (
                    <div className="flex justify-between border-b border-dotted border-black/20 pb-2 mt-2 text-[#F77F00]">
                      <span>POTONGAN VOUCHER</span>
                      <span>-{formatRupiah(promoDiscount)}</span>
                    </div>
                  )}
                  
                  {isInsured && (
                    <div className="flex justify-between border-b border-dotted border-black/20 pb-2 mt-2 text-black/80">
                      <span>ASURANSI PENGIRIMAN</span>
                      <span>+Rp 15.000</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Checkout Button Section */}
              <div className="p-8 md:p-10 bg-[#f4f0ea] dark:bg-[#dfdad2]">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm font-black uppercase tracking-tighter text-black/60">Total Pembayaran</span>
                  <span className="text-4xl font-black text-black tracking-tighter leading-none">{formatRupiah(finalTotal)}</span>
                </div>

                {/* Total Hemat Box */}
                {(totalProductDiscount > 0 || isPromoApplied || isFreeShipping) && (
                  <div className="bg-black text-white p-4 mb-8 flex justify-between items-center transform -rotate-1 shadow-lg border-2 border-[#F77F00]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#F77F00]">TOTAL HEMATMU:</span>
                    <span className="text-base font-black">
                      {formatRupiah(totalProductDiscount + promoDiscount + (isFreeShipping && shippingMethod === "standard" ? 50000 : 0))}
                    </span>
                  </div>
                )}

                {/* Order Bump: Asuransi in Receipt style */}
                <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                  <div className={`w-5 h-5 flex items-center justify-center border-2 border-black mt-0.5 ${isInsured ? "bg-black text-white" : "bg-transparent"}`}>
                    {isInsured && <div className="w-2.5 h-2.5 bg-white"></div>}
                  </div>
                  <input type="checkbox" checked={isInsured} onChange={() => setIsInsured(!isInsured)} className="hidden" />
                  <div className="flex-1">
                    <span className="text-xs font-black uppercase tracking-tighter block text-black">Pakai Asuransi Pengiriman (+Rp 15.000)</span>
                    <p className="text-[9px] font-mono text-black/60 leading-relaxed mt-1">Dapatkan garansi ganti rugi 100% penuh jika barang rusak atau hilang selama di tangan kurir pengiriman.</p>
                  </div>
                </label>

                {/* Checkout CTA */}
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing || selectedItemIds.length === 0}
                  className="w-full py-6 bg-[#F77F00] text-black font-black uppercase tracking-widest text-base flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <><span className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span> MEMPROSES...</>
                  ) : (
                    "PILIH METODE PEMBAYARAN"
                  )}
                </button>
              </div>
              
              {/* Jagged bottom edge */}
              <div className="h-4 w-full bg-[radial-gradient(circle,transparent,transparent_4px,#f4f0ea_4px,#f4f0ea_6px,transparent_6px)] dark:bg-[radial-gradient(circle,transparent,transparent_4px,#dfdad2_4px,#dfdad2_6px,transparent_6px)] bg-[length:12px_12px] bg-repeat-x absolute -bottom-2 left-0 z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
