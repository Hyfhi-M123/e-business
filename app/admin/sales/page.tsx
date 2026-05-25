"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, DollarSign, ArrowDownRight, ArrowUpRight, Receipt, CreditCard, Wallet, Calendar, FileText, Search } from "lucide-react";

export default function SalesPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [search, setSearch] = useState("");
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        
        if (data.orders) {
          const mappedLedger = data.orders.map((o: any) => {
            // Calculate a synthetic breakdown since we only store `total`
            const total = o.total || 0;
            const discount = 0;
            const tax = Math.round(total * 0.11); // 11% assumed PPN
            const gross = total - tax + discount;
            
            return {
              id: o.id,
              date: new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              gross: gross,
              tax: tax,
              discount: discount,
              net: total,
              method: "Bank Transfer", // Default since payment method isn't stored in DB yet
              status: o.status === "Belum Bayar" ? "pending" : "settled"
            };
          });
          
          // Sort by newest first
          setLedger(mappedLedger.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSales();
  }, []);

  const totalGross = ledger.reduce((acc, curr) => curr.status !== 'refunded' ? acc + curr.gross : acc, 0);
  const totalTaxes = ledger.reduce((acc, curr) => curr.status !== 'refunded' ? acc + curr.tax : acc, 0);
  const totalDiscounts = ledger.reduce((acc, curr) => curr.status !== 'refunded' ? acc + curr.discount : acc, 0);
  const netSales = ledger.reduce((acc, curr) => curr.status !== 'refunded' ? acc + curr.net : acc, 0);
  const totalRefunds = ledger.reduce((acc, curr) => curr.status === 'refunded' ? acc + curr.gross : acc, 0);

  const filteredData = ledger.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) && t.status !== 'pending');

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Sales & Accounting</h1>
          <p className="text-sm text-neutral-500 font-medium">Detailed financial breakdown, taxes, discounts, and ledger.</p>
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
              <option>This Week</option>
              <option>This Month</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#212529] dark:bg-white text-white dark:text-black shadow-lg rounded-2xl px-6 py-3 text-sm font-bold hover:bg-black dark:hover:bg-neutral-200 transition-colors shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        
        {/* Net Sales */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="xl:col-span-2 bg-[#F77F00] rounded-[2rem] p-8 shadow-lg shadow-orange-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
          <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">Net Sales (Profit)</p>
          <h3 className="text-4xl xl:text-5xl font-black mb-4">Rp {netSales.toLocaleString('id-ID')}</h3>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md">
            <ArrowUpRight className="w-4 h-4" /> +12.5% from last month
          </div>
        </motion.div>

        {/* Gross Sales */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Gross Sales</p>
          <h3 className="text-2xl font-black text-[#212529] dark:text-white mb-2">Rp {totalGross.toLocaleString('id-ID')}</h3>
          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 8.2%</span>
        </motion.div>

        {/* Taxes */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">Taxes (PPN 11%)</p>
          <h3 className="text-2xl font-black text-[#212529] dark:text-white mb-2">Rp {totalTaxes.toLocaleString('id-ID')}</h3>
          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 8.2%</span>
        </motion.div>

        {/* Discounts & Refunds */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">Discounts & Refunds</p>
          <h3 className="text-2xl font-black text-[#212529] dark:text-white mb-2">- Rp {(totalDiscounts + totalRefunds).toLocaleString('id-ID')}</h3>
          <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> Higher than usual</span>
        </motion.div>

      </div>

      {/* Main Ledger Content */}
      <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-[#111]/80 flex items-center justify-center backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Controls */}
        <div className="p-6 md:p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-[#1a1a1a]/50">
          <h2 className="text-lg font-black text-[#212529] dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-400" />
            Accounting Ledger
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search Transaction ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Transaction ID & Date</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Gross Amount</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Discount</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Tax (PPN 11%)</th>
                <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-[#F77F00]">Net Received</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Method & Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((trx, i) => {
                  const isRefund = trx.status === 'refunded';
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={trx.id} 
                      className={`border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors ${isRefund ? 'opacity-60' : ''}`}
                    >
                      {/* ID & Date */}
                      <td className="py-4 px-8">
                        <div className="flex flex-col">
                          <span className={`text-sm font-black mb-0.5 ${isRefund ? 'text-neutral-500 line-through' : 'text-[#212529] dark:text-white'}`}>{trx.id}</span>
                          <span className="text-xs font-medium text-neutral-500">{trx.date}</span>
                        </div>
                      </td>

                      {/* Gross */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-[#212529] dark:text-white">Rp {trx.gross.toLocaleString('id-ID')}</span>
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-4">
                        {trx.discount > 0 ? (
                          <span className="text-sm font-bold text-rose-500">- Rp {trx.discount.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-sm font-medium text-neutral-400">-</span>
                        )}
                      </td>

                      {/* Tax */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-neutral-500">+ Rp {trx.tax.toLocaleString('id-ID')}</span>
                      </td>

                      {/* Net */}
                      <td className="py-4 px-4">
                        <span className={`text-sm font-black ${isRefund ? 'text-rose-500' : 'text-[#F77F00]'}`}>
                          {isRefund ? '-' : ''}Rp {trx.net.toLocaleString('id-ID')}
                        </span>
                      </td>

                      {/* Method & Status */}
                      <td className="py-4 px-8 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                            {trx.method === 'Credit Card' && <CreditCard className="w-3.5 h-3.5" />}
                            {trx.method === 'Bank Transfer' && <Receipt className="w-3.5 h-3.5" />}
                            {trx.method === 'E-Wallet' && <Wallet className="w-3.5 h-3.5" />}
                            {trx.method}
                          </span>
                          {isRefund ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-500">Refunded</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">Settled</span>
                          )}
                        </div>
                      </td>

                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
