"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User, MapPin, Settings, ShieldCheck, Mail, Phone, Building2, Map, CreditCard } from "lucide-react";

export default function AddCustomerPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "Indonesia",
    notes: "",
    marketingConsent: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.email) {
      alert("Email wajib diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      // Create a customer profile by adding to newsletter/leads DB for now
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      
      alert(`Data Profil ${formData.firstName} ${formData.lastName} berhasil disimpan ke sistem!`);
      window.location.href = "/admin/users";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 mb-1">
              <Link href="/admin/users" className="hover:text-[#F77F00] transition-colors">Customers</Link>
              <span>/</span>
              <span className="text-[#212529] dark:text-white">Add New</span>
            </div>
            <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight">Create Customer Profile</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-2xl px-6 py-3.5 text-sm font-bold hover:bg-neutral-50 transition-colors">
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-8 py-3.5 text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save className="w-4 h-4" /> Save Profile</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-10">
        
        {/* Navigation Sidebar */}
        <div className="hidden xl:flex flex-col gap-2 sticky top-24 h-fit">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "overview" ? 'bg-white dark:bg-[#111] shadow-sm text-[#F77F00] border border-black/5 dark:border-white/5' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <User className="w-5 h-5" />
            Basic Overview
          </button>
          <button 
            onClick={() => setActiveTab("address")}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "address" ? 'bg-white dark:bg-[#111] shadow-sm text-[#F77F00] border border-black/5 dark:border-white/5' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <MapPin className="w-5 h-5" />
            Shipping Address
          </button>
          <button 
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "preferences" ? 'bg-white dark:bg-[#111] shadow-sm text-[#F77F00] border border-black/5 dark:border-white/5' : 'text-neutral-500 hover:text-[#212529] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            Preferences & Notes
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="xl:hidden flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
          {["overview", "address", "preferences"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-none px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-[#111] shadow-sm text-[#F77F00]' : 'text-neutral-500 bg-neutral-100 dark:bg-[#222]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3 flex flex-col gap-8">
          
          {/* Overview Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: activeTab === "overview" ? 1 : 0, y: 0 }}
            className={`${activeTab === "overview" ? 'block' : 'hidden'} bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5`}
          >
            <h2 className="text-xl font-black text-[#212529] dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-[#F77F00]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#F77F00]" />
              </div>
              Basic Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">First Name</label>
                <input 
                  type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder="e.g. John" 
                  className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Last Name</label>
                <input 
                  type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder="e.g. Doe" 
                  className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="john.doe@example.com" 
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+62 812 3456 7890" 
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: activeTab === "address" ? 1 : 0, y: 0 }}
            className={`${activeTab === "address" ? 'block' : 'hidden'} bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5`}
          >
            <h2 className="text-xl font-black text-[#212529] dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              Shipping Address
            </h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Street Address</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-4 top-5 text-neutral-400" />
                  <textarea 
                    name="address" value={formData.address} onChange={handleChange}
                    placeholder="123 Main St, Apt 4B..." 
                    className="w-full pl-11 pr-4 py-4 min-h-[120px] bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">City / Regency</label>
                  <input 
                    type="text" name="city" value={formData.city} onChange={handleChange}
                    placeholder="e.g. Jakarta" 
                    className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">State / Province</label>
                  <input 
                    type="text" name="state" value={formData.state} onChange={handleChange}
                    placeholder="e.g. DKI Jakarta" 
                    className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Postal Code</label>
                  <input 
                    type="text" name="postal" value={formData.postal} onChange={handleChange}
                    placeholder="e.g. 10110" 
                    className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Country</label>
                  <div className="relative">
                    <Map className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select 
                      name="country" value={formData.country} onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: activeTab === "preferences" ? 1 : 0, y: 0 }}
            className={`${activeTab === "preferences" ? 'block' : 'hidden'} bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5`}
          >
            <h2 className="text-xl font-black text-[#212529] dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-500" />
              </div>
              Preferences & Notes
            </h2>
            
            <div className="flex flex-col gap-8">
              
              {/* Marketing Consent */}
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 flex items-start gap-4">
                <div className="mt-1">
                  <label className="relative flex items-center cursor-pointer">
                    <input 
                      type="checkbox" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F77F00]"></div>
                  </label>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#212529] dark:text-white mb-1">Email Marketing Consent</h4>
                  <p className="text-sm font-medium text-neutral-500">Customer agrees to receive marketing emails, newsletters, and promotional offers from TrailForge.</p>
                </div>
              </div>

              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>

              {/* Internal Notes */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Internal Notes</label>
                <textarea 
                  name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="Notes about this customer (e.g. VIP, frequent returner, specific sizing requirements). These notes are private and won't be seen by the customer." 
                  className="w-full p-4 min-h-[160px] bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
