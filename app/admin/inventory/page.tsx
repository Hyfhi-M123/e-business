"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, AlertTriangle, Package, PackageX, History, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsenprneavjusqmmxobd.supabase.co";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_v2YG0aXS_8AhAxZaHq7xGQ_jWnLA26J";
        
        const res = await fetch(`${url}/rest/v1/products?select=*`, {
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          let items: any[] = [];
          
          data.forEach((p: any) => {
            if (p.variants && p.variants.length > 0) {
              p.variants.forEach((v: any, idx: number) => {
                const stockVal = parseInt(v.stock) || 0;
                items.push({
                  id: `${p.id}-var-${idx}`,
                  productId: p.id,
                  name: p.name,
                  variant: `${v.colorName} - ${v.size}`,
                  sku: v.sku || `${p.id}-${v.colorName.substring(0,3)}-${v.size}`.toUpperCase().replace(/\s+/g, ''),
                  stock: stockVal,
                  incoming: 0,
                  status: stockVal === 0 ? "out-of-stock" : stockVal <= 5 ? "low-stock" : "in-stock"
                });
              });
            } else {
              items.push({
                id: p.id,
                productId: p.id,
                name: p.name,
                variant: "All Size",
                sku: p.id.toUpperCase(),
                stock: 99,
                incoming: 0,
                status: "in-stock"
              });
            }
          });
          
          setInventory(items);
        }
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, []);

  // Stats calculation
  const totalVariants = inventory.length;
  const lowStockCount = inventory.filter(i => i.status === 'low-stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out-of-stock').length;

  // Filtered list
  const filteredData = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleStockChange = (id: string, newStock: string) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const stockVal = parseInt(newStock) || 0;
        let newStatus = "in-stock";
        if (stockVal === 0) newStatus = "out-of-stock";
        else if (stockVal <= 5) newStatus = "low-stock";
        
        return { ...item, stock: stockVal, status: newStatus };
      }
      return item;
    }));
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Inventory Management</h1>
          <p className="text-sm text-neutral-500 font-medium">Monitor stock levels, track incoming shipments, and prevent stockouts.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-[#212529] dark:text-white rounded-2xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
            <ArrowDownToLine className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#212529] dark:bg-white text-white dark:text-black shadow-lg rounded-2xl px-6 py-3 text-sm font-bold hover:bg-black dark:hover:bg-neutral-200 transition-colors">
            <ArrowUpFromLine className="w-4 h-4" />
            Receive Stock
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Total Variants */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Variants</p>
            <h3 className="text-3xl font-black text-[#212529] dark:text-white">{totalVariants}</h3>
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#F77F00]" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-[#F77F00]">{lowStockCount}</h3>
              <span className="text-sm font-medium text-neutral-500 mb-1">Items</span>
            </div>
          </div>
        </motion.div>

        {/* Out of Stock */}
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
            <PackageX className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Out of Stock</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-rose-500">{outOfStockCount}</h3>
              <span className="text-sm font-medium text-neutral-500 mb-1">Items</span>
            </div>
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
          
          <div className="flex bg-neutral-100 dark:bg-[#222] p-1 rounded-xl w-full md:w-auto">
            {["all", "low-stock", "out-of-stock"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white dark:bg-[#111] shadow-sm text-[#212529] dark:text-white' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white'}`}
              >
                {f.replace("-", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search products or SKU..." 
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#111]">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Product & Variant</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">SKU</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Available Stock</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Incoming</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">History</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredData.map((item, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id} 
                    className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    
                    {/* Product Info */}
                    <td className="py-4 px-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#212529] dark:text-white mb-0.5">{item.name}</span>
                        <span className="text-xs font-medium text-neutral-500">{item.variant}</span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-8">
                      <span className="text-xs font-mono uppercase text-neutral-500 bg-neutral-100 dark:bg-[#1a1a1a] px-2.5 py-1 rounded-md border border-black/5 dark:border-white/5">{item.sku}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-8">
                      {item.status === 'in-stock' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>In Stock</span>}
                      {item.status === 'low-stock' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-[#F77F00]"></div>Low Stock</span>}
                      {item.status === 'out-of-stock' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>Out of Stock</span>}
                    </td>

                    {/* Available Stock (Inline Editable) */}
                    <td className="py-4 px-8">
                      <div className="relative w-[100px]">
                        <input 
                          type="number" 
                          value={item.stock}
                          onChange={(e) => handleStockChange(item.id, e.target.value)}
                          className={`w-full bg-transparent border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-[#F77F00] focus:bg-white dark:focus:bg-[#111] rounded-xl py-2 px-3 text-sm font-black outline-none transition-all ${
                            item.stock === 0 ? 'text-rose-500' : item.stock <= 5 ? 'text-[#F77F00]' : 'text-[#212529] dark:text-white'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Incoming */}
                    <td className="py-4 px-8">
                      {item.incoming > 0 ? (
                        <span className="text-sm font-bold text-neutral-500 flex items-center gap-2">
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          {item.incoming}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-neutral-300 dark:text-neutral-700">-</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-8 text-right">
                      <button className="p-2 rounded-lg text-neutral-400 hover:text-[#F77F00] hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors inline-flex" title="View Stock History">
                        <History className="w-4 h-4" />
                      </button>
                    </td>

                  </motion.tr>
                ))}
              </AnimatePresence>
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-neutral-400" />
                    </div>
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">No items found</h3>
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
