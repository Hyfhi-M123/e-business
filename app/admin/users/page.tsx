"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, UserPlus, Users, Star, TrendingUp, Mail, MoreHorizontal, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        
        if (data.orders) {
          const customerMap = new Map();

          data.orders.forEach((o: any) => {
            const email = o.user_email || "guest@trailforge.com";
            
            let name = "Guest Customer";
            if (o.shipping?.address) {
              name = o.shipping.address.split("\n")[0];
            }

            if (!customerMap.has(email)) {
              customerMap.set(email, {
                id: email,
                name: name,
                email: email,
                orders: 0,
                spent: 0,
                lastActive: o.date,
                status: "new"
              });
            }

            const cust = customerMap.get(email);
            cust.orders += 1;
            cust.spent += o.total;
            
            // Track most recent date
            if (new Date(o.date) > new Date(cust.lastActive)) {
              cust.lastActive = o.date;
            }
          });

          const mappedCustomers = Array.from(customerMap.values()).map(c => {
            // Assign statuses based on simple logic
            if (c.spent > 10000000) c.status = "vip";
            else if (c.orders > 1) c.status = "active";
            
            // Format date
            const date = new Date(c.lastActive);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
            
            if (diffDays === 0) c.lastActive = "Today";
            else if (diffDays === 1) c.lastActive = "Yesterday";
            else c.lastActive = `${diffDays} days ago`;

            return c;
          });

          setCustomers(mappedCustomers);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const avgLtv = customers.reduce((acc, curr) => acc + curr.spent, 0) / (totalCustomers || 1);

  const filteredData = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return c.status === filter;
  });

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleExport = () => {
    const headers = ["Name", "Email", "Orders", "Spent (Rp)", "Last Active", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(c => 
        `"${c.name}","${c.email}",${c.orders},${c.spent},"${c.lastActive}","${c.status}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
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
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Customers</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage your customer relationships, behavior, and loyalty.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-[#212529] dark:text-white rounded-2xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-6 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Customers</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{totalCustomers}</h3>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-[#F77F00]/20 shadow-[0_4px_24px_rgba(247,127,0,0.05)] flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-[#F77F00]/10 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-[#F77F00]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F77F00] uppercase tracking-widest mb-1 flex items-center gap-2">
              VIP Customers
            </p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{vipCustomers}</h3>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Avg Lifetime Value</p>
            <h3 className="text-2xl font-black text-[#212529] dark:text-white">Rp {avgLtv.toLocaleString('id-ID')}</h3>
          </div>
        </motion.div>

      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-[#111]/80 flex items-center justify-center backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Controls */}
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
          
          <div className="flex bg-neutral-100 dark:bg-[#222] p-1 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
            {["all", "vip", "active", "new", "inactive"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-[#111] shadow-sm text-[#212529] dark:text-white' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
              />
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Customer</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Orders</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Lifetime Spent</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Last Active</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((cust, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={cust.id} 
                    className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    
                    {/* Customer */}
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          cust.status === 'vip' ? 'bg-[#F77F00] text-white shadow-md shadow-orange-500/20' : 'bg-neutral-200 dark:bg-[#222] text-neutral-600 dark:text-neutral-300'
                        }`}>
                          {getInitials(cust.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#212529] dark:text-white group-hover:text-[#F77F00] transition-colors">{cust.name}</span>
                          <span className="text-xs font-medium text-neutral-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {cust.status === 'vip' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-[11px] font-black uppercase tracking-widest"><Star className="w-3 h-3 mr-1.5" /> VIP</span>}
                      {cust.status === 'active' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest">Active</span>}
                      {cust.status === 'new' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-[11px] font-black uppercase tracking-widest">New</span>}
                      {cust.status === 'inactive' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#222] text-neutral-500 text-[11px] font-black uppercase tracking-widest">Inactive</span>}
                    </td>

                    {/* Orders */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-[#212529] dark:text-white">{cust.orders}</span>
                    </td>

                    {/* Lifetime Spent */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-[#212529] dark:text-white">Rp {cust.spent.toLocaleString('id-ID')}</span>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-neutral-500">{cust.lastActive}</span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-8 text-right">
                      <button className="p-2 text-neutral-400 hover:text-[#F77F00] hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors inline-flex">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>

                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
