"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Activity, Tag, Users, MapPin, Globe, Package } from "lucide-react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  // Dummy Chart Data
  const revenueData = [
    { label: "1 Oct", value: 25 }, { label: "5 Oct", value: 45 }, { label: "10 Oct", value: 30 },
    { label: "15 Oct", value: 65 }, { label: "20 Oct", value: 80 }, { label: "25 Oct", value: 55 },
    { label: "30 Oct", value: 90 },
  ];
  
  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  const topProducts = [
    { name: "Timberline X-Coat Arctic Pro", sales: 124, revenue: 427800000, trend: "+12%" },
    { name: "Vertex Summit Tent", sales: 86, revenue: 296700000, trend: "+5%" },
    { name: "AeroTrek Hiking Boots", sales: 152, revenue: 182400000, trend: "-2%" },
    { name: "SolarFlare Headlamp", sales: 345, revenue: 120750000, trend: "+18%" },
  ];

  const devices = [
    { name: "Mobile", percentage: 65, color: "bg-[#F77F00]" },
    { name: "Desktop", percentage: 30, color: "bg-[#212529] dark:bg-white" },
    { name: "Tablet", percentage: 5, color: "bg-neutral-300 dark:bg-neutral-600" },
  ];

  const funnelData = [
    { step: "Store Visitors", value: 12500, percentage: 100 },
    { step: "Added to Cart", value: 4200, percentage: 33.6 },
    { step: "Reached Checkout", value: 1850, percentage: 14.8 },
    { step: "Purchased", value: 405, percentage: 3.24 },
  ];

  const activityStream = [
    { time: "Just now", text: "New order #TRF-1030 placed.", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
    { time: "15 mins ago", text: "Payment failed for order #TRF-1026.", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10" },
    { time: "2 hours ago", text: "Timberline X-Coat stock low (3 left).", icon: Tag, color: "text-[#F77F00]", bg: "bg-orange-500/10" },
    { time: "5 hours ago", text: "New customer registered: Budi S.", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { time: "Yesterday", text: "Order #TRF-1020 fulfilled.", icon: Package, color: "text-[#212529] dark:text-white", bg: "bg-neutral-100 dark:bg-[#222]" },
  ];

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Analytics</h1>
          <p className="text-sm text-neutral-500 font-medium">Track your store performance, revenue, and customer behavior.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl text-sm font-bold text-[#212529] dark:text-white shadow-sm focus:border-[#F77F00] outline-none appearance-none cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#212529] dark:bg-white text-white dark:text-black shadow-lg rounded-2xl px-6 py-3 text-sm font-bold hover:bg-black dark:hover:bg-neutral-200 transition-colors shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Revenue */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm group hover:border-[#F77F00]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-[#F77F00]" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +14.5%
            </span>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-2xl xl:text-3xl font-black text-[#212529] dark:text-white">Rp 1.45B</h3>
        </motion.div>

        {/* Orders */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm group hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +8.2%
            </span>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-2xl xl:text-3xl font-black text-[#212529] dark:text-white">1,284</h3>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm group hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingDown className="w-3 h-3" /> -1.4%
            </span>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Conversion Rate</p>
          <h3 className="text-2xl xl:text-3xl font-black text-[#212529] dark:text-white">3.24%</h3>
        </motion.div>

        {/* AOV */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm group hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-purple-500" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +5.7%
            </span>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Avg Order Value</p>
          <h3 className="text-2xl xl:text-3xl font-black text-[#212529] dark:text-white">Rp 1.12M</h3>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Main Chart: Revenue Over Time */}
        <div className="xl:col-span-2 bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5 flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-[#212529] dark:text-white">Revenue Overview</h2>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F77F00]"></span>
              <span className="text-xs font-bold text-neutral-500">Current Period</span>
            </div>
          </div>
          
          {/* Custom Animated Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full h-px bg-black/5 dark:bg-white/5"></div>
              ))}
            </div>

            {/* Bars */}
            {revenueData.map((data, idx) => {
              const heightPercentage = (data.value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1 z-10 group">
                  <div className="w-full relative h-full flex items-end justify-center rounded-t-lg">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#212529] dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                      Rp {(data.value * 1200000).toLocaleString('id-ID')}
                    </div>
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, type: "spring" }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-[#F77F00] to-orange-400 rounded-t-xl group-hover:opacity-80 transition-opacity"
                    ></motion.div>
                  </div>
                  <span className="text-xs font-bold text-neutral-400">{data.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5 flex flex-col">
          <h2 className="text-lg font-black text-[#212529] dark:text-white mb-8">Conversion Funnel</h2>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            {funnelData.map((step, i) => (
              <div key={i} className="relative w-full">
                <div className="flex justify-between items-end mb-2 relative z-10 px-2">
                  <span className="text-sm font-bold text-[#212529] dark:text-white">{step.step}</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#212529] dark:text-white block leading-none mb-1">{step.value.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{step.percentage}%</span>
                  </div>
                </div>
                
                <div className="w-full h-12 bg-neutral-100 dark:bg-[#222] rounded-xl overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.15, type: "spring" }}
                    className="absolute top-0 left-0 h-full bg-[#F77F00]/20 dark:bg-[#F77F00]/30"
                  ></motion.div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `4px` }}
                    transition={{ duration: 1, delay: i * 0.15, type: "spring" }}
                    className="absolute top-0 left-0 h-full bg-[#F77F00]"
                    style={{ left: `calc(${step.percentage}% - 4px)` }}
                  ></motion.div>
                </div>
                
                {i < funnelData.length - 1 && (
                  <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-auto my-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Top Products Table */}
        <div className="xl:col-span-2 bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden flex flex-col h-full">
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5">
          <h2 className="text-lg font-black text-[#212529] dark:text-white">Top Performing Products</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Product Name</th>
                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Sales</th>
                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Revenue (Rp)</th>
                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => {
                const isPositive = product.trend.startsWith("+");
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="border-b border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-5 px-8">
                      <span className="text-sm font-bold text-[#212529] dark:text-white">{product.name}</span>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-sm font-black text-neutral-600 dark:text-neutral-300">{product.sales}</span>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-sm font-black text-[#212529] dark:text-white">Rp {product.revenue.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {product.trend}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5 flex flex-col h-full">
          <h2 className="text-lg font-black text-[#212529] dark:text-white mb-8 flex items-center justify-between">
            Live Activity
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h2>
          
          <div className="flex-1 flex flex-col relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-black/5 dark:bg-white/5 z-0"></div>
            
            {activityStream.map((activity, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex gap-6 relative z-10 mb-8 last:mb-0"
              >
                <div className={`w-12 h-12 rounded-full ${activity.bg} ${activity.color} flex items-center justify-center shrink-0 border-[4px] border-white dark:border-[#111]`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col pt-1">
                  <p className="text-sm font-bold text-[#212529] dark:text-white leading-tight mb-1">{activity.text}</p>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="mt-6 w-full py-3 rounded-xl border border-black/5 dark:border-white/5 text-sm font-bold text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-all">
            View All Logs
          </button>
        </div>

      </div>

    </main>
  );
}
