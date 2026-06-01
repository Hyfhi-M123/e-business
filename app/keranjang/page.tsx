"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2, ShieldCheck, MapPin, CreditCard, Truck, Tag, Lock, ArrowRight, ChevronLeft, Package, Plus, Minus, Map, Crosshair, AlertTriangle, Fingerprint, ShoppingBag, QrCode, Wallet, Building2, Loader2, RefreshCw, Search, X, Home } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import Barcode from "react-barcode";

const MapPicker = dynamic(() => import("../profil/MapPicker"), { ssr: false, loading: () => <div className="w-full h-56 rounded-2xl bg-neutral-100 dark:bg-white/5 animate-pulse" /> });

function KeranjangContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, selectedItemIds: contextSelectedIds, toggleSelect, toggleSelectAll } = useCart();
  const { user } = useAuth();
  
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const isBuyNowMode = searchParams.get("mode") === "buynow";

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
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
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [localAddresses, setLocalAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: "Rumah", name: "", phone: "", full: "", lat: 0, lng: 0 });
  const [displayOrderId, setDisplayOrderId] = useState("TRF-000000");

  useEffect(() => {
    if (user?.user_metadata?.addresses) {
      setLocalAddresses(user.user_metadata.addresses);
    }
    setDisplayOrderId("TRF-" + (Math.floor(Math.random() * 9000000) + 1000000));
  }, [user]);

  const extractPostalCode = (text: string) => {
    const match = text.match(/\b\d{5}\b/);
    return match ? match[0] : "12190";
  };

  useEffect(() => {
    if (localAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = localAddresses.find(a => a.isDefault) || localAddresses[0];
      setSelectedAddressId(defaultAddr.id);
      const code = extractPostalCode(defaultAddr.full);
      if (code && code !== postalCode) {
        setPostalCode(code);
      }
    }
  }, [localAddresses, selectedAddressId]);

  const handleAddAddress = async () => {
    if (!addrForm.name || !addrForm.phone || !addrForm.full) {
      alert("Lengkapi semua field!");
      return;
    }
    const cleanForm = { ...addrForm };
    const newAddr = { id: crypto.randomUUID(), ...cleanForm, isDefault: localAddresses.length === 0 };
    const updated = [...localAddresses, newAddr];
    await supabase.auth.updateUser({ data: { addresses: updated } });
    setLocalAddresses(updated);
    setAddrForm({ label: "Rumah", name: "", phone: "", full: "", lat: 0, lng: 0 });
    setIsAddingAddress(false);
    
    setSelectedAddressId(newAddr.id);
    const code = extractPostalCode(newAddr.full);
    setPostalCode(code);
    fetchShippingRates(code);
  };

  useEffect(() => {
    if (paymentToken && (window as any).snap) {
      (window as any).snap.embed(paymentToken, {
        embedId: 'snap-container',
        onSuccess: async function(result: any) {
          if (!isBuyNowMode) clearCart();
          
          // Extract actual payment data from Midtrans result
          const actualMethod = result.payment_type || paymentMethod;
          const methodLabel = actualMethod === 'bank_transfer' 
            ? (result.va_numbers?.[0]?.bank?.toUpperCase() || 'BANK TRANSFER') 
            : actualMethod === 'echannel' ? 'MANDIRI' 
            : actualMethod.toUpperCase();
          
          try {
            await fetch("/api/orders", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                id: currentOrderId, 
                status: "Menunggu Konfirmasi",
                payment_method: methodLabel,
                midtrans_transaction_id: result.transaction_id || null,
                midtrans_transaction_time: result.transaction_time || null,
                midtrans_gross_amount: result.gross_amount || null,
                midtrans_status: result.transaction_status || null,
              })
            });
          } catch (e) {
            console.error("Failed to update status", e);
          }

          router.push(`/pembayaran?method=${methodLabel}&total=${finalTotal}&status=success&order_id=${currentOrderId}`);
        },
        onPending: function(result: any) {
          router.push(`/pembayaran?method=${paymentMethod}&total=${finalTotal}&status=pending&order_id=${currentOrderId}`);
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

  const currentAddressText = localAddresses.length > 0 
    ? (localAddresses.find(a => a.id === selectedAddressId)?.full || "Jl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190") 
    : (user?.user_metadata?.address || "Jl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190");
  const mapQuery = encodeURIComponent(currentAddressText);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

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

  const promoDiscount = isPromoApplied && promoData
    ? promoData.type === 'percentage' ? checkoutTotal * (promoData.value / 100)
    : promoData.type === 'fixed' ? promoData.value
    : promoData.type === 'shipping' ? shippingCost
    : 0
    : 0;
  const insuranceCost = isInsured ? 15000 : 0;
  const finalTotal = checkoutTotal + shippingCost - promoDiscount + insuranceCost;

  function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch(`/api/promo?code=${encodeURIComponent(promoCode)}`);
      const data = await res.json();
      if (data.valid) {
        if (data.promo.min_order_amount && checkoutTotal < data.promo.min_order_amount) {
          setPromoError(`Minimum belanja Rp ${data.promo.min_order_amount.toLocaleString('id-ID')}`);
          setIsPromoApplied(false);
          setPromoData(null);
        } else {
          setPromoData(data.promo);
          setIsPromoApplied(true);
          setPromoError("");
        }
      } else {
        setPromoError(data.message || "Kode promo tidak valid.");
        setIsPromoApplied(false);
        setPromoData(null);
      }
    } catch {
      setPromoError("Gagal memvalidasi promo. Coba lagi.");
      setIsPromoApplied(false);
    }
    setPromoLoading(false);
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
      const generatedOrderId = "TRF-" + Math.floor(Math.random() * 100000000);
      setCurrentOrderId(generatedOrderId);

      const selectedAddr = localAddresses.find(a => a.id === selectedAddressId);
      const fullAddress = selectedAddr?.full || `Kode Pos: ${postalCode}`;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: generatedOrderId,
          gross_amount: finalTotal,
          items: items,
          payment_type: paymentMethod,
          customer_details: {
            first_name: selectedAddr?.name || user?.user_metadata?.full_name || "Guest",
            last_name: "",
            email: user?.email || "guest@trailforge.com",
            phone: selectedAddr?.phone || "081234567890"
          },
          shipping_info: {
            courier: selectedRate?.courier_name || "Belum dipilih",
            service: selectedRate?.courier_service_name || "-",
            address: fullAddress,
            recipient_name: selectedAddr?.name || "",
            recipient_phone: selectedAddr?.phone || "",
          },
          cost_breakdown: {
            subtotal: checkoutTotal,
            shipping_cost: shippingCost,
            insurance_cost: insuranceCost,
            promo_discount: promoDiscount,
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
              <div className="w-full md:w-64 h-[240px] md:h-auto bg-[#f8f9fa] dark:bg-[#121212] relative overflow-hidden flex-shrink-0 border-r border-black/10 dark:border-white/10">
                 <iframe 
                   src={mapUrl} 
                   frameBorder="0" 
                   scrolling="no" 
                   marginHeight={0} 
                   marginWidth={0} 
                   className="absolute inset-0 w-full h-full"
                 ></iframe>
                 {/* Overlay to enforce techwear styling and prevent interaction */}
                 <div className="absolute inset-0 bg-[#F77F00]/10 pointer-events-none border-[4px] border-[#F77F00]/20 z-[400]"></div>
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black uppercase text-xl">
                      {localAddresses.length > 0 
                        ? localAddresses.find(a => a.id === selectedAddressId)?.name || user?.user_metadata?.full_name 
                        : user?.user_metadata?.full_name || "GUEST ACCOUNT"}
                    </h3>
                    <span className="text-neutral-500 font-mono text-sm block mt-1">
                      No. HP: {localAddresses.length > 0 
                        ? localAddresses.find(a => a.id === selectedAddressId)?.phone || user?.user_metadata?.phone 
                        : user?.user_metadata?.phone || "(+62) 812-3456-7890"}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsAddingAddress(false);
                      setShowAddressModal(true);
                    }}
                    className="text-xs font-black uppercase tracking-widest text-[#F77F00] hover:text-[#e06f00] border-b-2 border-[#F77F00] transition-colors pb-1"
                  >
                    Ubah Alamat
                  </button>
                </div>
                
                <div className="bg-[#f8f9fa] dark:bg-[#1a1a1a] p-4 border border-black/5 dark:border-white/5">
                  <span className="inline-block px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest mb-3">
                    {localAddresses.length > 0 ? localAddresses.find(a => a.id === selectedAddressId)?.label?.toUpperCase() || "ALAMAT PENGIRIMAN" : "RUMAH"}
                  </span>
                  <p className="text-sm text-[#6C757D] dark:text-neutral-400 leading-relaxed font-mono whitespace-pre-line">
                    {currentAddressText}
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
                  {/* Real Barcode for Logistics / Internal Tracking */}
                  <div className="w-full h-16 flex mb-4 justify-center overflow-hidden mix-blend-multiply opacity-80">
                    <Barcode 
                      value={displayOrderId} 
                      format="CODE128" 
                      width={1.8} 
                      height={60} 
                      displayValue={false} 
                      background="transparent" 
                      lineColor="#1a1a1a" 
                      margin={0}
                    />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Ringkasan Belanja</h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-black/60">Sesi Trx: {displayOrderId}</p>
                </div>

                {/* Promo Code */}
                <form onSubmit={handleApplyPromo} className="mb-8">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); if (promoError) setPromoError(""); }}
                        placeholder="PUNYA KODE PROMO?" 
                        className={`w-full bg-white border-2 p-3 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#F77F00] ${isPromoApplied ? 'border-emerald-500' : promoError ? 'border-red-400' : 'border-black'}`}
                        disabled={isPromoApplied}
                      />
                    </div>
                    {isPromoApplied ? (
                      <button type="button" onClick={() => { setIsPromoApplied(false); setPromoData(null); setPromoCode(""); setPromoError(""); }} className="px-6 bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors">Hapus</button>
                    ) : (
                      <button type="submit" disabled={promoLoading} className="px-6 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-[#F77F00] transition-colors disabled:opacity-50">{promoLoading ? "..." : "Pakai"}</button>
                    )}
                  </div>
                  {promoError && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-widest">{promoError}</p>}
                  {isPromoApplied && promoData && <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-widest">✓ {promoData.description || `Diskon ${promoData.type === 'percentage' ? promoData.value + '%' : 'Rp ' + promoData.value.toLocaleString('id-ID')} aktif!`}</p>}
                </form>

                {/* Kalkulasi Biaya (Receipt style) */}
                <div className="flex flex-col gap-3 font-mono text-xs uppercase text-black/80">
                  <div className="flex justify-between border-b border-dotted border-black/20 pb-2">
                    <span>SUBTOTAL PRODUK</span>
                    <span className="font-bold text-[#212529] dark:text-white">{formatRupiah(totalOriginalPrice)}</span>
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
                <div 
                  onClick={() => setIsInsured(!isInsured)}
                  className={`flex items-start md:items-center justify-between gap-4 p-4 mb-8 cursor-pointer rounded-xl transition-all border-2 ${isInsured ? "border-[#F77F00] bg-orange-500/10" : "border-black/10 hover:border-black/30"}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className={`w-4 h-4 ${isInsured ? "text-[#F77F00]" : "text-black/40"}`} />
                      <span className={`text-xs font-black uppercase tracking-tighter ${isInsured ? "text-black" : "text-black/60"}`}>
                        Asuransi Pengiriman (+Rp 15.000)
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-black/60 leading-relaxed pl-6">
                      Garansi 100% oleh Biteship jika barang rusak/hilang di jalan.
                    </p>
                  </div>
                  
                  {/* Modern Toggle Switch */}
                  <div className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${isInsured ? "bg-[#F77F00]" : "bg-black/20"}`}>
                    <motion.div 
                      layout
                      initial={false}
                      animate={{ x: isInsured ? 24 : 2 }}
                      className="absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>

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

      {/* Address Update Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-[#F8F9FA] dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  if (isAddingAddress) setIsAddingAddress(false);
                  else setShowAddressModal(false);
                }}
                className="absolute top-4 right-4 text-neutral-500 hover:text-[#F77F00] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black uppercase tracking-tight text-[#212529] dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F77F00]" /> {isAddingAddress ? "Tambah Alamat Baru" : "Pilih Alamat"}
              </h2>

              {!isAddingAddress ? (
                <>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {localAddresses.length > 0 ? (
                      localAddresses.map(addr => (
                        <div 
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            const code = extractPostalCode(addr.full);
                            setPostalCode(code);
                            fetchShippingRates(code);
                            setShowAddressModal(false);
                          }}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedAddressId === addr.id 
                              ? "border-[#F77F00] bg-orange-500/5" 
                              : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-orange-500/10 text-[#F77F00]">{addr.label}</span>
                            {addr.isDefault && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">Utama</span>}
                          </div>
                          <p className="font-bold text-sm mb-1 text-[#212529] dark:text-white">{addr.name}</p>
                          <p className="text-xs text-[#6C757D] mb-1">{addr.phone}</p>
                          <p className="text-xs text-[#6C757D] line-clamp-2">{addr.full}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-[#6C757D] mb-4">Belum ada alamat tersimpan.</p>
                      </div>
                    )}
                  </div>
                    
                  <div className="pt-6 border-t border-black/10 dark:border-white/10 mt-6 flex gap-3">
                    <button 
                      onClick={() => setShowAddressModal(false)}
                      className="flex-1 px-4 py-3 border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-lg"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="flex-[2] px-4 py-3 bg-[#F77F00] text-white text-xs font-black uppercase tracking-widest hover:bg-[#e06f00] transition-colors shadow-lg shadow-orange-500/20 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Tambah Alamat
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex gap-2">
                    {["Rumah", "Kantor", "Lainnya"].map(l => (
                      <button key={l} onClick={() => setAddrForm({ ...addrForm, label: l })}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${addrForm.label === l ? "bg-[#F77F00] text-white" : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400"}`}>
                        {l === "Rumah" ? <span className="flex items-center gap-1"><Home className="w-3 h-3" />{l}</span> : l === "Kantor" ? <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{l}</span> : l}
                      </button>
                    ))}
                  </div>
                  <input value={addrForm.name} onChange={e => setAddrForm({ ...addrForm, name: e.target.value })} placeholder="Nama penerima"
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#F77F00] outline-none transition-colors" />
                  <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} placeholder="Nomor telepon"
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#F77F00] outline-none transition-colors" />
                  <textarea value={addrForm.full} onChange={e => setAddrForm({ ...addrForm, full: e.target.value })} placeholder="Alamat lengkap (Wajib sertakan 5 digit kode pos di akhir)" rows={3}
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#F77F00] outline-none transition-colors resize-none" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6C757D] mb-2">📍 Pin Lokasi di Peta</p>
                    <MapPicker
                      initialLat={addrForm.lat || undefined}
                      initialLng={addrForm.lng || undefined}
                      onSelect={(lat: number, lng: number, address: string) => {
                        setAddrForm(prev => ({ ...prev, lat, lng, full: prev.full || address }));
                      }}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 px-4 py-3 border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-xl"
                    >
                      Batal
                    </button>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleAddAddress}
                      className="flex-[2] py-3 bg-gradient-to-r from-orange-500 to-[#F77F00] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20">
                      Simpan Alamat
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default function KeranjangPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
        <div className="w-10 h-10 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
      </main>
    }>
      <KeranjangContent />
    </Suspense>
  );
}
