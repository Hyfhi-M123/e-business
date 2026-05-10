"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Tag, Plus, Ticket, ArrowDownToLine, Clock, CalendarX2, CheckCircle2, MoreHorizontal, Percent, Truck, Banknote, Edit, Copy, PowerOff, Trash2 } from "lucide-react";
import Link from "next/link";

// Dummy Data
const OFFERS_DATA = [
  { id: "OFR-1", code: "PAYDAY20", type: "percentage", value: 20, desc: "20% off all expedition jackets", status: "active", used: 145, limit: 200, startDate: "Oct 25, 2023", endDate: "Oct 31, 2023" },
  { id: "OFR-2", code: "FREESHIP", type: "shipping", value: 0, desc: "Free shipping for orders > Rp 1M", status: "active", used: 890, limit: null, startDate: "Sep 01, 2023", endDate: "Dec 31, 2023" },
  { id: "OFR-3", code: "NEWYEAR50", type: "fixed", value: 50000, desc: "Rp 50.000 off for new users", status: "scheduled", used: 0, limit: 500, startDate: "Jan 01, 2024", endDate: "Jan 07, 2024" },
  { id: "OFR-4", code: "FLASH10", type: "percentage", value: 10, desc: "10% off flash sale event", status: "expired", used: 50, limit: 50, startDate: "Oct 10, 2023", endDate: "Oct 12, 2023" },
  { id: "OFR-5", code: "VIPMEMBER", type: "percentage", value: 15, desc: "15% off for VIP customers only", status: "active", used: 34, limit: 100, startDate: "Oct 01, 2023", endDate: "Nov 01, 2023" },
];

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside (simple approach for demo)
  if (typeof window !== 'undefined') {
    window.onclick = () => {
      if (activeDropdown) setActiveDropdown(null);
    };
  }

  const activeOffersCount = OFFERS_DATA.filter(o => o.status === 'active').length;
  const totalUsed = OFFERS_DATA.reduce((acc, curr) => acc + curr.used, 0);

  const filteredData = OFFERS_DATA.filter(o => {
    const matchesSearch = o.code.toLowerCase().includes(search.toLowerCase()) || o.desc.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Offers & Discounts</h1>
          <p className="text-sm text-neutral-500 font-medium">Create and manage promo codes, automatic discounts, and free shipping.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-[#212529] dark:text-white rounded-2xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <ArrowDownToLine className="w-4 h-4" />
            Export
          </button>
          <Link href="/admin/offers/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-6 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Offer
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Active Offers</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{activeOffersCount}</h3>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Codes Used</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{totalUsed.toLocaleString('id-ID')}</h3>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-[#F77F00]/20 shadow-[0_4px_24px_rgba(247,127,0,0.05)] flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-[#F77F00]/10 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6 text-[#F77F00]" />
          </div>
          <div className="flex-1 w-full overflow-hidden">
            <p className="text-xs font-bold text-[#F77F00] uppercase tracking-widest mb-1 flex items-center gap-2">Top Performer</p>
            <h3 className="text-xl font-black text-[#212529] dark:text-white truncate">PAYDAY20</h3>
          </div>
        </motion.div>

      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
          
          <div className="flex bg-neutral-100 dark:bg-[#222] p-1 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
            {["all", "active", "scheduled", "expired"].map((f) => (
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
                placeholder="Search promo codes..." 
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
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-8 w-12"><input type="checkbox" className="w-4 h-4 rounded border-black/20 accent-[#F77F00]" /></th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Offer Code</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Type & Value</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Performance (Usage)</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Active Period</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((offer, i) => {
                  const usagePercent = offer.limit ? (offer.used / offer.limit) * 100 : 0;
                  
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={offer.id} 
                      className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-8 w-12"><input type="checkbox" className="w-4 h-4 rounded border-black/20 accent-[#F77F00]" /></td>
                      
                      {/* Code & Desc */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#212529] dark:text-white mb-0.5 uppercase group-hover:text-[#F77F00] transition-colors">{offer.code}</span>
                          <span className="text-xs font-medium text-neutral-500 max-w-[200px] truncate">{offer.desc}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {offer.status === 'active' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 mr-1.5" /> Active</span>}
                        {offer.status === 'scheduled' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-[11px] font-black uppercase tracking-widest"><Clock className="w-3 h-3 mr-1.5" /> Scheduled</span>}
                        {offer.status === 'expired' && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[11px] font-black uppercase tracking-widest"><CalendarX2 className="w-3 h-3 mr-1.5" /> Expired</span>}
                      </td>

                      {/* Type & Value */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            offer.type === 'percentage' ? 'bg-orange-50 dark:bg-orange-500/10 text-[#F77F00]' :
                            offer.type === 'fixed' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' :
                            'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {offer.type === 'percentage' && <Percent className="w-4 h-4" />}
                            {offer.type === 'fixed' && <Banknote className="w-4 h-4" />}
                            {offer.type === 'shipping' && <Truck className="w-4 h-4" />}
                          </div>
                          <div>
                            {offer.type === 'percentage' && <span className="text-sm font-bold text-[#212529] dark:text-white">{offer.value}% OFF</span>}
                            {offer.type === 'fixed' && <span className="text-sm font-bold text-[#212529] dark:text-white">Rp {offer.value.toLocaleString('id-ID')} OFF</span>}
                            {offer.type === 'shipping' && <span className="text-sm font-bold text-[#212529] dark:text-white">FREE SHIPPING</span>}
                          </div>
                        </div>
                      </td>

                      {/* Usage Progress */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col w-[160px]">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-bold text-[#212529] dark:text-white">{offer.used} <span className="text-neutral-400 font-medium">used</span></span>
                            {offer.limit && <span className="text-[10px] font-bold text-neutral-400">Limit: {offer.limit}</span>}
                            {!offer.limit && <span className="text-[10px] font-bold text-emerald-500">Unlimited</span>}
                          </div>
                          {offer.limit ? (
                            <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full rounded-full ${usagePercent >= 100 ? 'bg-rose-500' : 'bg-[#F77F00]'}`}
                              ></motion.div>
                            </div>
                          ) : (
                            <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden">
                              <div className="h-full w-1/3 bg-emerald-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Active Period */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#212529] dark:text-white">{offer.startDate}</span>
                          <span className="text-xs font-medium text-neutral-400">to {offer.endDate}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-8 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === offer.id ? null : offer.id);
                          }}
                          className="p-2 text-neutral-400 hover:text-[#F77F00] hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors inline-flex"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === offer.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-8 top-12 w-48 bg-white dark:bg-[#111] rounded-xl shadow-2xl border border-black/5 dark:border-white/10 py-2 z-50 overflow-hidden"
                            >
                              <Link href={`/admin/offers/new?edit=${offer.id}`} className="w-full px-4 py-2.5 text-left text-sm font-bold text-[#212529] dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
                                <Edit className="w-4 h-4 text-neutral-400" />
                                Edit Offer
                              </Link>
                              <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-[#212529] dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
                                <Copy className="w-4 h-4 text-neutral-400" />
                                Duplicate
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
                                <PowerOff className="w-4 h-4 text-neutral-400" />
                                Deactivate
                              </button>
                              <div className="h-px bg-black/5 dark:bg-white/5 my-1"></div>
                              <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-3">
                                <Trash2 className="w-4 h-4" />
                                Delete Offer
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>

                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-6 h-6 text-neutral-400" />
                    </div>
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">No offers found</h3>
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
