"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Search, Calendar, Bell, DollarSign, ShoppingCart, Users, ChevronDown, MoreHorizontal } from "lucide-react";

export default function AdminDashboard() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{income: number, labels: string[], values: number[], maxVal: number}>({ income: 0, labels: [], values: [], maxVal: 1 });
  const [timeRange, setTimeRange] = useState("Weekly");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
          const revenue = data.orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
          setTotalRevenue(revenue);
          
          // 1. Calculate Active Customers (unique emails or guest names)
          const emails = new Set(data.orders.map((o: any) => o.user_email || o.shipping?.address?.split('\n')[0] || "Guest").filter(Boolean));
          setActiveCustomers(emails.size);

          // 2. Calculate Top Selling Products
          const productMap: Record<string, {name: string, sold: number, img: string}> = {};
          data.orders.forEach((o: any) => {
            o.items?.forEach((item: any) => {
              if (!productMap[item.id]) {
                productMap[item.id] = { name: item.name, sold: 0, img: item.image || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" };
              }
              productMap[item.id].sold += (item.qty || item.quantity || 1);
            });
          });
          const sortedProducts = Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 4);
          setTopProducts(sortedProducts.length > 0 ? sortedProducts : [
            { name: "Vertex Summit Tent", sold: 752, img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" },
            { name: "AeroStep Boot", sold: 542, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80" }
          ]);

        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;
    
    let labels: string[] = [];
    let values: number[] = [];

    if (timeRange === "Weekly") {
      const last7Days = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      labels = last7Days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values = last7Days.map((day) => {
        const dayOrders = orders.filter((o: any) => {
           const od = new Date(o.created_at || o.date || new Date());
           return od.getDate() === day.getDate() && od.getMonth() === day.getMonth() && od.getFullYear() === day.getFullYear();
        });
        return dayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      });
    } else if (timeRange === "Monthly") {
      const last7Months = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (6 - i));
        return d;
      });
      labels = last7Months.map(d => d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      values = last7Months.map((month) => {
        const monthOrders = orders.filter((o: any) => {
           const od = new Date(o.created_at || o.date || new Date());
           return od.getMonth() === month.getMonth() && od.getFullYear() === month.getFullYear();
        });
        return monthOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      });
    } else {
      const last7Years = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - (6 - i));
        return d;
      });
      labels = last7Years.map(d => d.getFullYear().toString());
      values = last7Years.map((year) => {
        const yearOrders = orders.filter((o: any) => {
           const od = new Date(o.created_at || o.date || new Date());
           return od.getFullYear() === year.getFullYear();
        });
        return yearOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      });
    }
    
    const maxVal = Math.max(...values, 1000000);
    const periodRevenue = values.reduce((sum, v) => sum + v, 0);
    
    setChartData({
      income: periodRevenue,
      labels: labels,
      values: values,
      maxVal: maxVal
    });
  }, [orders, timeRange]);

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#F77F00] transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl py-3 pl-12 pr-4 text-sm font-medium w-72 focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
            />
          </div>
          
          <button className="flex items-center gap-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-black/10 transition-colors">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>{chartData.labels.length > 0 ? `${chartData.labels[0]} - ${chartData.labels[chartData.labels.length - 1]}` : 'This Week'}</span>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          { title: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, trend: "+11.4%", isPositive: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "hover:border-emerald-500/30" },
          { title: "Total Orders", value: orders.length.toString(), trend: "+12.5%", isPositive: true, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "hover:border-blue-500/30" },
          { title: "Active Customers", value: activeCustomers.toLocaleString('id-ID'), trend: "+5.2%", isPositive: true, icon: Users, color: "text-[#F77F00]", bg: "bg-orange-50 dark:bg-[#F77F00]/10", border: "hover:border-orange-500/30" },
        ].map((stat, i) => (
          <motion.div 
            variants={itemVariant} 
            key={i} 
            className={`bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 transition-colors duration-300 ${stat.border} group cursor-default`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${stat.isPositive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" strokeWidth={3} /> : <ArrowDownRight className="w-3 h-3" strokeWidth={3} />}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-400 mb-1">{stat.title}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-black text-[#212529] dark:text-white tracking-tight leading-none">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
        
        {/* Premium Sales Analytic Chart */}
        <motion.div variants={itemVariant} initial="hidden" animate="show" className="xl:col-span-2 bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 dark:border-white/5 relative overflow-hidden group">
          
          <div className="flex justify-between items-center mb-8 relative z-50">
            <div>
              <h2 className="text-xl font-black text-[#212529] dark:text-white">Sales Analytic</h2>
              <p className="text-xs font-bold text-neutral-400 mt-1">Monitor your store's financial health</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 bg-neutral-50 dark:bg-[#1a1a1a] px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 transition-colors border border-black/5 dark:border-white/5">
                <span>{timeRange}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 dark:border-white/5 overflow-hidden z-50">
                  {["Weekly", "Monthly", "Yearly"].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setTimeRange(opt); setShowDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${timeRange === opt ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-10 mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-xs font-bold text-neutral-500">Pendapatan</p>
              </div>
              <span className="text-2xl font-black text-[#212529] dark:text-white">Rp {chartData.income.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Premium Animated Bar Chart */}
          <div className="w-full h-64 relative border-b border-black/5 dark:border-white/5 flex items-end justify-between px-2 pb-1 mt-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-t border-black/5 dark:border-white/5 pb-1">
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
            </div>

            {/* Bars */}
            {chartData.values.length > 0 ? chartData.values.map((val, idx) => (
              <div key={idx} className="relative flex flex-col items-center justify-end w-10 md:w-16 h-[90%] z-10 group">
                {/* Tooltip */}
                <div className="absolute -top-10 bg-[#212529] dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                  Rp {val.toLocaleString('id-ID')}
                </div>
                {/* Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((val / chartData.maxVal) * 100, 2)}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, type: "spring", stiffness: 60 }}
                  className="w-6 md:w-12 bg-blue-500 rounded-t-xl group-hover:bg-[#F77F00] transition-colors"
                />
                <span className="absolute -bottom-8 text-[10px] font-bold text-neutral-400 whitespace-nowrap">{chartData.labels[idx]}</span>
              </div>
            )) : (
              [1,2,3,4,5,6,7].map(i => (
                <div key={i} className="relative flex flex-col items-center justify-end w-10 md:w-16 h-[90%] z-10">
                  <div className="w-6 md:w-12 h-4 bg-neutral-100 dark:bg-[#1a1a1a] rounded-t-xl" />
                  <span className="absolute -bottom-8 text-[10px] font-bold text-neutral-300 dark:text-neutral-700">---</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Selling Products List */}
        <motion.div variants={itemVariant} initial="hidden" animate="show" className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 dark:border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-[#212529] dark:text-white">Top Selling</h2>
              <p className="text-xs font-bold text-neutral-400 mt-1">Based on recent data</p>
            </div>
            <button className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-[#1a1a1a] flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors border border-black/5 dark:border-white/5">
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            {topProducts.map((prod, i) => (
              <div key={i} className="flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-all cursor-pointer group">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={prod.img} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#212529] dark:text-white truncate group-hover:text-[#F77F00] transition-colors">{prod.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs font-semibold text-neutral-500">{prod.sold} Pcs</p>
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+↑</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 text-xs font-bold text-[#F77F00] hover:bg-[#F77F00]/5 transition-colors">
            View All Products
          </button>
        </motion.div>

      </div>
    </main>
  );
}
