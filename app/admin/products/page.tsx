"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Tag, Image as ImageIcon } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Dummy data for premium presentation
  const mockProducts = [
    { id: "PRD-001", name: "Vertex Summit Tent", category: "Tenda", price: 3450000, stock: 45, status: "Active", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&q=80" },
    { id: "PRD-002", name: "AeroStep Boot", category: "Sepatu", price: 1850000, stock: 12, status: "Active", img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80" },
    { id: "PRD-003", name: "Timberline X-Coat", category: "Pakaian", price: 1200000, stock: 0, status: "Out of Stock", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80" },
    { id: "PRD-004", name: "Polaris Compass", category: "Aksesoris", price: 450000, stock: 120, status: "Active", img: "https://images.unsplash.com/photo-1512413914565-ebff0d9c4c23?w=200&q=80" },
    { id: "PRD-005", name: "Titanium Flask", category: "Perlengkapan", price: 350000, stock: 8, status: "Draft", img: "https://images.unsplash.com/photo-1614088659123-5777df43e98b?w=200&q=80" },
  ];

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Manage your store's inventory and product details.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-72 group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#F77F00] transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
            />
          </div>
          
          <Link 
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-5 py-3.5 text-sm font-bold hover:bg-orange-600 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            <span className="hidden sm:block">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 dark:border-white/5 flex flex-col"
      >
        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 bg-neutral-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
              All Products ({mockProducts.length})
            </span>
          </div>
          <button className="flex items-center gap-2 bg-neutral-50 dark:bg-[#1a1a1a] px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#222] transition-colors border border-black/5 dark:border-white/5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Product</th>
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Category</th>
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Price</th>
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Stock</th>
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {mockProducts.map((product) => (
                <motion.tr 
                  variants={itemVariant}
                  key={product.id} 
                  className="group border-b border-black/5 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center">
                        {product.img ? (
                          <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-300" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#212529] dark:text-white group-hover:text-[#F77F00] transition-colors">{product.name}</h4>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      <Tag className="w-3 h-3 text-neutral-400" />
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-[#212529] dark:text-white">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${product.stock === 0 ? 'text-rose-500' : 'text-[#212529] dark:text-white'}`}>
                        {product.stock}
                      </span>
                      {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Low</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest
                      ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}
                      ${product.status === 'Draft' ? 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-400' : ''}
                      ${product.status === 'Out of Stock' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : ''}
                    `}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/products/new?edit=${product.id}`} className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#1a1a1a] flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-[#222] text-neutral-600 dark:text-neutral-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Fallback for touch devices or before hover */}
                    <button className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-black/5 dark:border-white/5">
          <p className="text-xs font-semibold text-neutral-500">Showing 1 to 5 of 24 products</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 text-xs font-bold text-neutral-400 hover:text-[#212529] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors" disabled>Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-[#F77F00] text-white text-xs font-bold shadow-md shadow-orange-500/20">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#212529] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#212529] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">Next</button>
          </div>
        </div>

      </motion.div>
    </main>
  );
}
