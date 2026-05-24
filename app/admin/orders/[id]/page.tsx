"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, MoreHorizontal, CheckCircle2, Clock, Truck, MapPin, User, Mail, Phone, Package, Copy, CreditCard, ExternalLink } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string || "TRF-1029";
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fulfillCourier, setFulfillCourier] = useState("JNE Reguler");
  const [fulfillReceipt, setFulfillReceipt] = useState("");
  const [fulfillLoading, setFulfillLoading] = useState(false);
  const [biteshipLoading, setBiteshipLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [manualStatus, setManualStatus] = useState("");

  const handleBiteshipFulfill = async () => {
    setBiteshipLoading(true);
    try {
      const res = await fetch("/api/shipping/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id, destination_name: order.shippingAddress.name, destination_phone: order.customer.phone || "08123456789", destination_address: order.shippingAddress.street, destination_postal_code: order.shippingAddress.postalCode !== "-" ? order.shippingAddress.postalCode : 12190, courier_code: "jne", courier_service: "reg", items: order.items }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder({ 
          ...order, 
          dbStatus: "Dikirim", 
          receipt: data.courier?.waybill_id || data.biteship_order_id, 
          courier: data.courier?.company 
            ? `${data.courier.company.toUpperCase()} - REG`
            : "JNE - REG"
        });
        
        // Update database status
        await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            status: "Dikirim",
            shipping_receipt: data.courier?.waybill_id || data.biteship_order_id,
            shipping_courier: data.courier?.company ? `${data.courier.company.toUpperCase()} - REG` : "JNE - REG",
          })
        });
      } else {
        alert("Biteship Error: " + (data.error || "Gagal memanggil kurir"));
      }
    } catch (e) {
      console.error("Biteship fulfill error:", e);
      alert("Terjadi kesalahan sistem saat memanggil kurir Biteship.");
    }
    setBiteshipLoading(false);
  };

  const handleFulfill = async () => {
    if (!fulfillReceipt.trim()) return;
    setFulfillLoading(true);
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status: "Dikirim",
          shipping_receipt: fulfillReceipt,
          shipping_courier: fulfillCourier,
        })
      });
      setOrder({ ...order, dbStatus: "Dikirim", receipt: fulfillReceipt, courier: fulfillCourier });
    } catch (e) {
      console.error("Fulfill error:", e);
    }
    setFulfillLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusLoading(true);
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus })
      });
      setOrder({ ...order, dbStatus: newStatus });
    } catch (e) {
      console.error("Status update error:", e);
    }
    setStatusLoading(false);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const found = data.orders?.find((o: any) => o.id === orderId);
        
        if (found) {
          const customerName = found.recipient?.name || "Guest";
          const customerEmail = found.user_email || "guest@trailforge.com";
          const customerPhone = found.recipient?.phone || "-";
          const street = found.shipping?.address || "";

          let paymentStatus = found.status === "Belum Bayar" ? "pending" : "paid";
          let fulfillmentStatus = "unfulfilled";
          if (found.status === "Dikirim" || found.status === "Selesai") fulfillmentStatus = "fulfilled";
          else if (found.status === "Dikemas") fulfillmentStatus = "partially-fulfilled";

          setOrder({
            id: found.id,
            date: found.date,
            paymentStatus,
            fulfillmentStatus,
            customer: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              ordersCount: 1
            },
            shippingAddress: {
              name: customerName,
              street: street,
              city: "-",
              province: "-",
              postalCode: "-",
              country: "Indonesia"
            },
            items: found.items.map((i: any, idx: number) => ({
              id: idx,
              name: i.name,
              variant: i.variant || "-",
              sku: i.id || "-",
              price: i.price,
              quantity: i.quantity,
              image: i.image
            })),
            financials: {
              subtotal: found.payment?.subtotal || found.total,
              shipping: found.payment?.shipping_cost || 0,
              insurance: found.payment?.insurance_cost || 0,
              tax: 0,
              discount: found.payment?.discount || 0,
              total: found.total
            },
            paymentMethod: found.payment?.method || "-",
            dbStatus: found.status,
            receipt: found.shipping?.receipt || "-",
            courier: found.shipping?.courier || "-"
          });
          setManualStatus(found.status);
        }
      } catch (err) {
        console.error("Failed to fetch admin order details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div></main>;
  }

  if (!order) {
    return <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen flex items-center justify-center"><h1 className="text-xl font-bold">Order Not Found</h1></main>;
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">#{order.id}</h1>
            <span className="text-sm font-medium text-neutral-500 mt-1">{order.date}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
            More Actions
          </button>
        </div>
      </div>

      {/* Badges Bar */}
      <div className="flex gap-3 mb-8">
        {order.paymentStatus === 'paid' && <span className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 mr-2" /> Payment: Paid</span>}
        {order.fulfillmentStatus === 'unfulfilled' && <span className="inline-flex items-center px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-xs font-black uppercase tracking-widest"><Clock className="w-4 h-4 mr-2" /> Fulfillment: Unfulfilled</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN: Order Details (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Order Items */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white">Order Items</h2>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{order.items.length} Items</span>
            </div>

            <div className="flex flex-col gap-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-neutral-500">
                      <span>{item.variant}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                      <span className="font-mono uppercase">{item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#212529] dark:text-white">Rp {item.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs font-bold text-neutral-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Financials */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-neutral-400" /> Payment Summary
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({order.courier})</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.tax.toLocaleString('id-ID')}</span>
              </div>
              {order.financials.insurance > 0 && (
                <div className="flex justify-between">
                  <span>Asuransi</span>
                  <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.insurance.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span className="font-bold">- Rp {order.financials.discount.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>
              
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-[#212529] dark:text-white">Total</span>
                <span className="text-2xl font-black text-[#212529] dark:text-white">Rp {order.financials.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="mt-8 bg-neutral-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-black/5 dark:border-white/5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#212529] dark:text-white">Paid via {order.paymentMethod || 'Midtrans'}</p>
                <p className="text-xs text-neutral-500 mt-1">{order.date}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Customer & Fulfillment (1/3) */}
        <div className="flex flex-col gap-8">
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Customer</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#F77F00]/10 text-[#F77F00] flex items-center justify-center text-sm font-black shrink-0">
                {getInitials(order.customer.name)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#212529] dark:text-white">{order.customer.name}</h3>
                <p className="text-xs text-neutral-500 font-medium">{order.customer.ordersCount} orders in total</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium">
              <div className="flex items-center gap-3 text-[#212529] dark:text-white">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`mailto:${order.customer.email}`} className="hover:text-[#F77F00] transition-colors truncate">{order.customer.email}</a>
              </div>
              <div className="flex items-center gap-3 text-[#212529] dark:text-white">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`tel:${order.customer.phone}`} className="hover:text-[#F77F00] transition-colors">{order.customer.phone}</a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-neutral-400" /> Shipping Address
              </h2>
              <button className="text-xs font-bold text-[#F77F00] hover:underline">Edit</button>
            </div>
            
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <span className="block text-[#212529] dark:text-white font-bold mb-1">{order.shippingAddress.name}</span>
              {order.shippingAddress.street}<br/>
              {order.shippingAddress.city}, {order.shippingAddress.province}<br/>
              {order.shippingAddress.country} {order.shippingAddress.postalCode}
            </div>

            <button className="mt-4 flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#212529] dark:hover:text-white transition-colors">
              <Copy className="w-3 h-3" /> Copy Address
            </button>
          </div>

          {/* Fulfillment Action */}
          <div className="bg-[#212529] dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00] blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg font-black text-white mb-2 relative z-10">Fulfillment</h2>
            <p className="text-xs text-neutral-400 font-medium mb-6 relative z-10">
              {order.dbStatus === "Menunggu Konfirmasi" && "Pesanan baru masuk. Terima atau batalkan pesanan ini."}
              {order.dbStatus === "Dikemas" && "Pesanan sedang dikemas. Serahkan ke kurir saat siap."}
              {order.dbStatus === "Dikirim" && "Paket sedang dalam perjalanan ke customer."}
              {order.dbStatus === "Selesai" && "Pesanan telah selesai dan diterima customer."}
              {order.dbStatus === "Dibatalkan" && "Pesanan ini telah dibatalkan."}
              {order.dbStatus === "Belum Bayar" && "Menunggu pembayaran dari customer."}
            </p>

            {/* Step indicator */}
            <div className="relative z-10 flex items-center gap-1 mb-6">
              {["Konfirmasi", "Kemas", "Pickup", "Selesai"].map((step, idx) => {
                const stepMap: Record<string, number> = { "Belum Bayar": -1, "Menunggu Konfirmasi": 0, "Dikemas": 1, "Dikirim": 2, "Selesai": 3, "Dibatalkan": -1 };
                const current = stepMap[order.dbStatus] ?? -1;
                const isActive = idx === current;
                const isDone = idx < current;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full h-1.5 rounded-full transition-all ${isDone ? "bg-emerald-500" : isActive ? "bg-[#F77F00]" : "bg-white/10"}`} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "text-[#F77F00]" : isDone ? "text-emerald-400" : "text-neutral-600"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
            
            {/* === STEP 1: Menunggu Konfirmasi → Proses / Batalkan === */}
            {order.dbStatus === "Menunggu Konfirmasi" && (
              <div className="flex flex-col gap-3 relative z-10">
                <button onClick={() => handleStatusChange("Dikemas")} disabled={statusLoading} className="w-full bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                  {statusLoading ? "Memproses..." : "Proses Pesanan"}
                </button>
                <button onClick={() => { if(confirm("Yakin ingin membatalkan pesanan ini?")) handleStatusChange("Dibatalkan"); }} disabled={statusLoading} className="w-full bg-white/5 border border-red-500/30 text-red-400 font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                  Batalkan Pesanan
                </button>
              </div>
            )}

            {/* === STEP 2: Dikemas → Pickup / Manual Fulfill === */}
            {order.dbStatus === "Dikemas" && (
              <div className="flex flex-col gap-4 relative z-10">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Pesanan telah diterima & sedang dikemas</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Courier</label>
                  <select value={fulfillCourier} onChange={(e) => setFulfillCourier(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none">
                    <option>JNE Reguler</option>
                    <option>J&T Express</option>
                    <option>Sicepat BEST</option>
                    <option>GoSend Instant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Tracking Number (manual)</label>
                  <input type="text" value={fulfillReceipt} onChange={(e) => setFulfillReceipt(e.target.value)} placeholder="e.g. JNE1234567890" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600" />
                </div>
                
                <button onClick={handleFulfill} disabled={fulfillLoading || biteshipLoading || !fulfillReceipt.trim()} className="w-full mt-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50">
                  <Package className="w-5 h-5" />
                  {fulfillLoading ? "Processing..." : "Manual Fulfill & Kirim"}
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-white/40 text-[10px] font-black uppercase tracking-widest">ATAU</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button onClick={handleBiteshipFulfill} disabled={biteshipLoading || fulfillLoading} className="w-full bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2d5a47] transition-colors disabled:opacity-50">
                  <Truck className="w-5 h-5" />
                  {biteshipLoading ? "Memanggil Kurir..." : "Pickup via Biteship"}
                </button>
              </div>
            )}

            {/* === STEP 3: Dikirim / Selesai → Tracking Info === */}
            {(order.dbStatus === "Dikirim" || order.dbStatus === "Selesai") && (
              <div className="relative z-10 p-5 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-emerald-400 mb-4">{order.dbStatus}</p>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Courier</p>
                <p className="text-sm font-bold text-white mb-4">{order.courier}</p>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Tracking Number</p>
                <p className="text-sm font-mono font-bold text-[#F77F00]">{order.receipt}</p>
              </div>
            )}

            {/* === Dibatalkan State === */}
            {order.dbStatus === "Dibatalkan" && (
              <div className="relative z-10 p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <p className="text-sm font-bold text-red-400">Pesanan Dibatalkan</p>
              </div>
            )}

            {/* === Belum Bayar State === */}
            {order.dbStatus === "Belum Bayar" && (
              <div className="relative z-10 p-5 bg-white/5 border border-white/10 rounded-xl text-center">
                <Clock className="w-6 h-6 text-neutral-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-neutral-400">Menunggu Pembayaran</p>
                <p className="text-[10px] text-neutral-600 mt-1">Aksi akan tersedia setelah customer membayar.</p>
              </div>
            )}

            {statusLoading && <p className="text-[10px] text-[#F77F00] font-bold mt-4 animate-pulse relative z-10">Memperbarui status...</p>}
          </div>

        </div>

      </div>
    </main>
  );
}
