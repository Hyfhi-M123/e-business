"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowDownToLine, ShoppingCart, Clock, Truck, Eye, CheckCircle2, ChevronRight, Download } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        
        if (data.orders && data.orders.length > 0) {
          const mappedOrders = data.orders.map((o: any) => {
            // Extract name from address or use fallback
            let customerName = "Guest";
            if (o.shipping?.address) {
              customerName = o.shipping.address.split("\n")[0];
            }

            // Map status to admin dashboard's UI
            let paymentStatus = "pending";
            let fulfillmentStatus = "unfulfilled";
            
            if (o.status !== "Belum Bayar") {
              paymentStatus = "paid";
            }
            if (o.status === "Dikirim" || o.status === "Selesai") {
              fulfillmentStatus = "fulfilled";
            } else if (o.status === "Dikemas") {
              fulfillmentStatus = "partially-fulfilled";
            }

            return {
              id: o.id,
              date: o.date,
              customer: customerName,
              email: o.user_email || "guest@trailforge.com",
              paymentStatus,
              fulfillmentStatus,
              total: o.total,
              items: o.items.length
            };
          });
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Stats
  const totalOrders = orders.length;
  const unfulfilledOrders = orders.filter(o => o.fulfillmentStatus === 'unfulfilled' && o.paymentStatus === 'paid').length;
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                          order.customer.toLowerCase().includes(search.toLowerCase()) ||
                          order.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "unfulfilled") return order.fulfillmentStatus === "unfulfilled";
    if (filter === "unpaid") return order.paymentStatus === "pending";
    if (filter === "completed") return order.fulfillmentStatus === "fulfilled" && order.paymentStatus === "paid";
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleExport = () => {
    const headers = ["Order ID", "Date", "Customer", "Email", "Payment Status", "Fulfillment Status", "Items", "Total (Rp)"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(o => 
        `"${o.id}","${o.date}","${o.customer}","${o.email}","${o.paymentStatus}","${o.fulfillmentStatus}",${o.items},${o.total}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Orders</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage and fulfill your customer orders seamlessly.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-[#212529] dark:text-white rounded-2xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link href="/admin/orders/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-6 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
            Create Order
          </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6 group hover:border-[#F77F00]/30 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{totalOrders}</h3>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-[#F77F00]/20 shadow-[0_4px_24px_rgba(247,127,0,0.05)] flex items-center gap-6 group hover:border-[#F77F00]/50 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-[#F77F00]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6 text-[#F77F00]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F77F00] uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-pulse"></span>
              To Fulfill
            </p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-[#212529] dark:text-white">{unfulfilledOrders}</h3>
              <span className="text-sm font-medium text-neutral-500 mb-1">Orders</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6 group hover:border-rose-500/30 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Unpaid Orders</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-[#212529] dark:text-white">{pendingPayments}</h3>
              <span className="text-sm font-medium text-neutral-500 mb-1">Pending</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col xl:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
          
          <div className="flex bg-neutral-100 dark:bg-[#222] p-1 rounded-xl w-full xl:w-auto overflow-x-auto scrollbar-hide">
            {["all", "unfulfilled", "unpaid", "completed"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 xl:flex-none px-6 py-2.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-[#111] shadow-sm text-[#212529] dark:text-white' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search order ID, customer, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Order ID</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Customer</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Payment</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Fulfillment</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Items</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Total</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Order ID & Date */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#212529] dark:text-white mb-0.5 group-hover:text-[#F77F00] transition-colors">#{order.id}</span>
                        <span className="text-xs font-medium text-neutral-500">{order.date}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-[#222] flex items-center justify-center text-[10px] font-black text-neutral-600 dark:text-neutral-400 shrink-0">
                          {getInitials(order.customer)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#212529] dark:text-white">{order.customer}</span>
                          <span className="text-xs font-medium text-neutral-500">{order.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      {order.paymentStatus === 'paid' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Paid</span>}
                      {order.paymentStatus === 'pending' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-[11px] font-black uppercase tracking-widest"><Clock className="w-3 h-3 mr-1.5" /> Pending</span>}
                      {order.paymentStatus === 'failed' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[11px] font-black uppercase tracking-widest">Failed</span>}
                      {order.paymentStatus === 'refunded' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#222] text-neutral-600 dark:text-neutral-400 text-[11px] font-black uppercase tracking-widest">Refunded</span>}
                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-4 px-4">
                      {order.fulfillmentStatus === 'fulfilled' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest">Fulfilled</span>}
                      {order.fulfillmentStatus === 'unfulfilled' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-[11px] font-black uppercase tracking-widest"><Truck className="w-3 h-3 mr-1.5" /> Unfulfilled</span>}
                      {order.fulfillmentStatus === 'partially-fulfilled' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-[11px] font-black uppercase tracking-widest">Partially Fulfilled</span>}
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-[#212529] dark:text-white">{order.items} items</span>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-[#212529] dark:text-white">Rp {order.total.toLocaleString('id-ID')}</span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-8 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#1a1a1a] flex items-center justify-center hover:bg-[#F77F00] hover:text-white text-neutral-600 dark:text-neutral-400 transition-colors ml-auto">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>

                  </motion.tr>
                ))}
              </AnimatePresence>
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-neutral-400" />
                    </div>
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">No orders found</h3>
                    <p className="text-xs text-neutral-500 font-medium">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
