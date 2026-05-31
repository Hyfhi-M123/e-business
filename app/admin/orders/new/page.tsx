"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, Trash2, User, MapPin, Mail, Send, CreditCard, Save, Package } from "lucide-react";

export default function CreateOrderPage() {
  const [items, setItems] = useState<any[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Customer Search State
  const [custSearchQuery, setCustSearchQuery] = useState("");
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [custSearchResults, setCustSearchResults] = useState<any[]>([]);
  const [showCustDropdown, setShowCustDropdown] = useState(false);

  // Form State
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          let results: any[] = [];
          data.forEach(p => {
             if (p.variants && p.variants.length > 0) {
               p.variants.forEach((v: any, idx: number) => {
                 results.push({
                   id: `${p.id}-var-${idx}`,
                   productId: p.id,
                   name: p.name,
                   variant: `${v.colorName} - ${v.size}`,
                   price: v.price || p.price,
                   image: p.image_url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80"
                 });
               });
             } else {
               results.push({
                 id: p.id,
                 productId: p.id,
                 name: p.name,
                 variant: "All Size",
                 price: p.price,
                 image: p.image_url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80"
               });
             }
          });
          setAllProducts(results);
          setSearchResults(results);
        }
        
        // Fetch Customers from past orders
        const orderRes = await fetch(`/api/orders`);
        const orderData = await orderRes.json();
        if (orderData.orders && Array.isArray(orderData.orders)) {
           const uniqueCustomers = new Map();
           orderData.orders.forEach((o: any) => {
             const email = o.user_email || "guest@trailforge.com";
             if (!uniqueCustomers.has(email)) {
                let name = "Guest";
                let address = "";
                let city = "";
                let postal = "";
                let phone = o.shipping?.phone || "";
                if (o.shipping?.address) {
                   const lines = o.shipping.address.split('\n');
                   name = lines[0] || "Guest";
                   address = lines[1] || "";
                   city = lines[2] || "";
                   postal = lines[3] || "";
                }
                uniqueCustomers.set(email, { name, email, phone, address, city, postal });
             }
           });
           setAllCustomers(Array.from(uniqueCustomers.values()));
           setCustSearchResults(Array.from(uniqueCustomers.values()));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      setSearchResults(allProducts.filter(p => p.name.toLowerCase().includes(lowerQ)));
    } else {
      setSearchResults(allProducts);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (custSearchQuery.trim()) {
      const lowerQ = custSearchQuery.toLowerCase();
      setCustSearchResults(allCustomers.filter(c => 
        c.name.toLowerCase().includes(lowerQ) || 
        c.email.toLowerCase().includes(lowerQ)
      ));
    } else {
      setCustSearchResults(allCustomers);
    }
  }, [custSearchQuery, allCustomers]);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shipping - discount;

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleAddItem = (result: any) => {
    const existing = items.find(i => i.id === result.id);
    if (existing) {
       setItems(items.map(i => i.id === result.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
       setItems([...items, { ...result, quantity: 1 }]);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleSelectCustomer = (cust: any) => {
    setCustomerForm(cust);
    setCustSearchQuery("");
    setShowCustDropdown(false);
  };

  const handleProcessOrder = async (type: 'email' | 'paid') => {
    if (items.length === 0) {
      alert("Pesanan masih kosong! Silakan tambahkan minimal 1 produk.");
      return;
    }
    if (!customerForm.name || !customerForm.email) {
      alert("Data pelanggan (Nama & Email) wajib diisi!");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create real order in Supabase
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerForm,
          items,
          subtotal,
          shipping,
          discount,
          total,
          status: type === 'paid' ? 'Selesai' : 'Belum Bayar'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pesanan");

      if (type === 'email') {
        // Send automatic backend email
        const emailRes = await fetch("/api/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerForm.email,
            name: customerForm.name,
            order_id: data.order_id,
            items: items,
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: total
          })
        });
        
        const emailData = await emailRes.json();
        
        if (!emailRes.ok) throw new Error(emailData.error || "Gagal mengirim email invoice.");
        
        if (emailData.simulated) {
          alert(`Pesanan ${data.order_id} berhasil dibuat!\n\n[WARNING] Konfigurasi SMTP (Gmail) di .env belum diatur, sehingga email asli tidak terkirim. Namun API berfungsi normal.`);
        } else {
          alert(`Berhasil! Invoice HTML telah dikirim ke email: ${customerForm.email} secara otomatis!`);
        }
        
        // Redirect back to orders 
        window.location.href = "/admin/orders";
      } else {
        alert(`Pesanan atas nama ${customerForm.name} berhasil disimpan dan ditandai sebagai LUNAS!`);
        window.location.href = "/admin/orders";
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
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
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search products to add..." 
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all relative z-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#212529] dark:bg-white text-white dark:text-black rounded-lg px-4 py-2 text-xs font-bold hover:bg-black dark:hover:bg-neutral-200 transition-colors z-10">
                Browse
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((res, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleAddItem(res)}
                          className="p-3 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-neutral-50 dark:hover:bg-[#222] cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-[#333] overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                            <img src={res.image} alt={res.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1581553680321-4fffae59fdda?w=100&q=80" }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#212529] dark:text-white line-clamp-1">{res.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{res.variant}</p>
                          </div>
                          <div className="text-xs font-black text-[#F77F00] whitespace-nowrap bg-orange-500/10 px-2 py-1 rounded-md">
                            Rp {res.price?.toLocaleString('id-ID')}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm font-bold text-neutral-500">Tidak ada produk ditemukan.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
              <input 
                type="text" 
                value={custSearchQuery}
                onChange={(e) => setCustSearchQuery(e.target.value)}
                onFocus={() => setShowCustDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustDropdown(false), 200)}
                placeholder="Search existing customer..." 
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:border-[#F77F00] outline-none relative z-10"
              />
              
              {/* Customer Dropdown */}
              <AnimatePresence>
                {showCustDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[250px] overflow-y-auto"
                  >
                    {custSearchResults.length > 0 ? (
                      custSearchResults.map((cust, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleSelectCustomer(cust)}
                          className="p-3 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-neutral-50 dark:hover:bg-[#222] cursor-pointer transition-colors"
                        >
                          <h4 className="text-sm font-bold text-[#212529] dark:text-white">{cust.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500">{cust.email}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm font-bold text-neutral-500">Tidak ada customer ditemukan.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">OR NEW CUSTOMER</span>
              <div className="h-px bg-black/5 dark:bg-white/5 flex-1"></div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} placeholder="Full Name" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} placeholder="Email Address" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <input type="tel" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Shipping Address</h2>
            <div className="flex flex-col gap-4">
              <input type="text" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} placeholder="Street Address" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={customerForm.city} onChange={e => setCustomerForm({...customerForm, city: e.target.value})} placeholder="City" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
                <input type="text" value={customerForm.postal} onChange={e => setCustomerForm({...customerForm, postal: e.target.value})} placeholder="Postal Code" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:border-[#F77F00] outline-none" />
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-[#212529] dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg font-black text-white mb-6 relative z-10">Process Order</h2>
            
            <div className="flex flex-col gap-3 relative z-10">
              {/* <button 
                onClick={() => handleProcessOrder('email')}
                disabled={isProcessing}
                className="w-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <><Send className="w-5 h-5" /> Email Invoice</>
                )}
              </button> */}
              
              <button 
                onClick={() => handleProcessOrder('paid')}
                disabled={isProcessing}
                className="w-full bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <><CreditCard className="w-5 h-5" /> Mark as Paid</>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
