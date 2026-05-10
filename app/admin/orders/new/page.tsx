"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, Trash2, User, MapPin, Mail, Send, CreditCard, Save, Package } from "lucide-react";

export default function CreateOrderPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Timberline X-Coat Arctic Pro",
      variant: "Midnight Black - L",
      price: 3450000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80"
    }
  ]);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(50000);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shipping - discount;

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">Create Draft Order</h1>
            <span className="text-sm font-medium text-neutral-500 mt-1">Manually create an order and send an invoice.</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-6 py-3 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN: Products & Payment (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Products Selector */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Order Items</h2>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search products to add..." 
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#212529] dark:bg-white text-white dark:text-black rounded-lg px-4 py-2 text-xs font-bold hover:bg-black dark:hover:bg-neutral-200 transition-colors">
                Browse
              </button>
            </div>

            {/* Selected Items */}
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                    key={item.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#212529] dark:text-white leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs font-medium text-neutral-500">{item.variant}</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Qty</span>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-2 px-2 text-sm font-black text-center focus:ring-2 focus:ring-[#F77F00]/20 outline-none"
                        />
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm font-black text-[#212529] dark:text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="py-8 text-center text-neutral-500 text-sm font-medium border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
                  No items added yet. Search products above.
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Payment Details</h2>

            <div className="flex flex-col gap-5 text-sm font-medium">
              <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-[#F77F00] font-bold cursor-pointer hover:underline">Add Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">- Rp</span>
                  <input 
                    type="number" 
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-1.5 px-3 text-sm font-bold text-right focus:border-[#F77F00] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center group">
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">Shipping</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Rp</span>
                  <input 
                    type="number" 
                    value={shipping || ''}
                    onChange={(e) => setShipping(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-1.5 px-3 text-sm font-bold text-right focus:border-[#F77F00] outline-none"
                  />
                </div>
              </div>
              
              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>
              
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-[#212529] dark:text-white">Total</span>
                <span className="text-3xl font-black text-[#212529] dark:text-white">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Customer & Final Actions (1/3) */}
        <div className="flex flex-col gap-8">
          
          {/* Find Customer */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Customer</h2>
            
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search existing customer..." 
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:border-[#F77F00] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">OR NEW CUSTOMER</span>
              <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <input type="text" placeholder="Full Name" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <input type="email" placeholder="Email Address" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Shipping Address</h2>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Street Address" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
                <input type="text" placeholder="Postal Code" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-[#212529] dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg font-black text-white mb-6 relative z-10">Process Order</h2>
            
            <div className="flex flex-col gap-3 relative z-10">
              <button className="w-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                <Send className="w-5 h-5" />
                Email Invoice
              </button>
              
              <button className="w-full bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors mt-2">
                <CreditCard className="w-5 h-5" />
                Mark as Paid
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
