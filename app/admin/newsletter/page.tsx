"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, Edit, Trash2, Users, MousePointerClick, Eye, Plus, Search, Filter, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

// Dummy Campaign Data
const CAMPAIGN_DATA = [
  { id: "CMP-01", name: "Black Friday Early Access", subject: "Your VIP access is here! 🖤", audience: "VIP Customers", sentDate: "Nov 20, 2023", opens: 68, clicks: 24, status: "scheduled" },
  { id: "CMP-02", name: "October Gear Digest", subject: "Top 5 Hiking Boots for Winter ❄️", audience: "All Subscribers", sentDate: "Oct 15, 2023", opens: 42, clicks: 12, status: "sent" },
  { id: "CMP-03", name: "Welcome Series - Email 1", subject: "Welcome to TrailForge!", audience: "New Signups", sentDate: "Automated", opens: 85, clicks: 40, status: "sent" },
  { id: "CMP-04", name: "Flash Sale 12.12", subject: "24 Hours Only! 50% OFF", audience: "All Subscribers", sentDate: "-", opens: 0, clicks: 0, status: "draft" },
];

export default function NewsletterPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredData = CAMPAIGN_DATA.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return c.status === filter;
  });

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Email Campaigns</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage newsletters, automated flows, and broadcast emails.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/admin/newsletter/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-6 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Subscribers */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Subscribers</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">12,450</h3>
          </div>
        </motion.div>

        {/* Open Rate */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center justify-between">
              Avg Open Rate
              <span className="text-emerald-500 font-black">48%</span>
            </p>
            <div className="w-full h-2 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden mt-2">
              <div className="h-full w-[48%] bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Click Rate */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#F77F00]/10 flex items-center justify-center shrink-0">
            <MousePointerClick className="w-6 h-6 text-[#F77F00]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center justify-between">
              Avg Click Rate
              <span className="text-[#F77F00] font-black">12%</span>
            </p>
            <div className="w-full h-2 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden mt-2">
              <div className="h-full w-[12%] bg-[#F77F00] rounded-full"></div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
          
          <div className="flex bg-neutral-100 dark:bg-[#222] p-1 rounded-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
            {["all", "sent", "scheduled", "draft"].map((f) => (
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
                placeholder="Search campaigns..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Campaign Name</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Audience</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Open Rate</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Click Rate</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((cmp, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={cmp.id} 
                    className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    
                    {/* Name & Subject */}
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          cmp.status === 'sent' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
                          cmp.status === 'scheduled' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' :
                          'bg-neutral-100 dark:bg-[#222] text-neutral-400'
                        }`}>
                          {cmp.status === 'sent' ? <Send className="w-4 h-4" /> : cmp.status === 'scheduled' ? <Clock className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#212529] dark:text-white mb-0.5 group-hover:text-[#F77F00] transition-colors">{cmp.name}</span>
                          <span className="text-xs font-medium text-neutral-500 max-w-[250px] truncate">Subject: {cmp.subject}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {cmp.status === 'sent' && <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Sent</span>}
                      {cmp.status === 'scheduled' && <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3 mr-1" /> Scheduled</span>}
                      {cmp.status === 'draft' && <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-[#222] text-neutral-500"><Edit className="w-3 h-3 mr-1" /> Draft</span>}
                    </td>

                    {/* Audience */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                        <Users className="w-3 h-3 text-neutral-400" />
                        {cmp.audience}
                      </span>
                    </td>

                    {/* Open Rate */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 w-24">
                        <span className="text-sm font-black text-[#212529] dark:text-white">{cmp.opens}%</span>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${cmp.opens}%` }} className="h-full bg-emerald-500 rounded-full"></motion.div>
                        </div>
                      </div>
                    </td>

                    {/* Click Rate */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 w-24">
                        <span className="text-sm font-black text-[#212529] dark:text-white">{cmp.clicks}%</span>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#222] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${cmp.clicks}%` }} className="h-full bg-[#F77F00] rounded-full"></motion.div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-8 text-right">
                      <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{cmp.sentDate}</span>
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
