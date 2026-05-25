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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{income: number, expenses: number, labels: string[], svgPath: string, polyPath: string}>({ income: 0, expenses: 0, labels: [], svgPath: "", polyPath: "" });
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
              productMap[item.id].sold += item.quantity;
            });
          });
          const sortedProducts = Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 4);
          setTopProducts(sortedProducts.length > 0 ? sortedProducts : [
            { name: "Vertex Summit Tent", sold: 752, img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" },
            { name: "AeroStep Boot", sold: 542, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80" }
          ]);

          // 3. Calculate 7-Day Chart Data
          const last7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
          });
          
          const labels = last7Days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          
          const values = last7Days.map(day => {
            const dayOrders = data.orders.filter((o: any) => {
               const od = new Date(o.date);
               return od.getDate() === day.getDate() && od.getMonth() === day.getMonth() && od.getFullYear() === day.getFullYear();
            });
            return dayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
          });
          
          const maxVal = Math.max(...values, 1000000); // prevent div by zero, baseline 1jt
          // Map to Y coordinates (0 is top, 100 is bottom). Give it a max height of 20 (so it doesn't touch the top)
          const normalizedValues = values.map(v => 100 - ((v / maxVal) * 80)); 
          
          let svgPath = `M0,${normalizedValues[0]} `;
          const step = 100 / 6; // 6 intervals for 7 points
          for(let i = 1; i < 7; i++) {
             svgPath += `L${i * step},${normalizedValues[i]} `;
          }

          setChartData({
            income: revenue,
            expenses: revenue * 0.45, // Simulation of expenses based on revenue
            labels: labels,
            svgPath: svgPath,
            polyPath: `${svgPath} L100,100 L0,100`
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-black text-[#212529] dark:text-white">Sales Analytic</h2>
              <p className="text-xs font-bold text-neutral-400 mt-1">Monitor your store's financial health</p>
            </div>
            <button className="flex items-center gap-2 bg-neutral-50 dark:bg-[#1a1a1a] px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 transition-colors border border-black/5 dark:border-white/5">
              <span>Monthly</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-10 mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-xs font-bold text-neutral-500">Income</p>
              </div>
              <span className="text-2xl font-black text-[#212529] dark:text-white">Rp {chartData.income.toLocaleString('id-ID')}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#F77F00]"></div>
                <p className="text-xs font-bold text-neutral-500">Expenses</p>
              </div>
              <span className="text-2xl font-black text-[#212529] dark:text-white">Rp {chartData.expenses.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Premium Animated Chart Placeholder */}
          <div className="w-full h-64 relative border-b border-black/5 dark:border-white/5 flex items-end -mx-2 px-2">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-t border-black/5 dark:border-white/5">
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
              <div className="w-full h-px bg-black/5 dark:bg-white/5" />
            </div>

            {/* Income Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-gradient-to-t from-blue-500/20 to-transparent opacity-60" style={{ clipPath: `polygon(${chartData.polyPath || '0 100%, 0 80%, 15% 40%, 30% 70%, 45% 20%, 60% 80%, 75% 50%, 90% 10%, 100% 40%, 100% 100%'})` }} />
            <svg className="w-full h-[80%] absolute bottom-0 left-0 right-0 preserve-3d overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d={chartData.svgPath || "M0,80 Q7.5,60 15,40 T30,70 T45,20 T60,80 T75,50 T90,10 T100,40"} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_4px_10px_rgba(59,130,246,0.5)]"/>
            </svg>

            {/* Labels */}
            <div className="w-full flex justify-between text-[10px] font-bold text-neutral-400 absolute -bottom-6">
              {chartData.labels.length > 0 ? chartData.labels.map((lbl, idx) => <span key={idx}>{lbl}</span>) : (
                <><span>Jul 22</span><span>Jul 23</span><span>Jul 24</span><span>Jul 25</span><span>Jul 26</span><span>Jul 27</span><span>Jul 28</span><span>Jul 29</span></>
              )}
            </div>
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
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
