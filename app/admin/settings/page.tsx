"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, CreditCard, Truck, Users, Bell, Shield, Globe, Save, HelpCircle, AlertOctagon } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isShutdown, setIsShutdown] = useState(false);
  const [loadingShutdown, setLoadingShutdown] = useState(false);

  const [storeName, setStoreName] = useState("TrailForge Outdoors");
  const [contactEmail, setContactEmail] = useState("hello@trailforge.com");
  const [storeIndustry, setStoreIndustry] = useState("Sports & Outdoors");
  const [legalName, setLegalName] = useState("PT TrailForge Indonesia");
  const [address, setAddress] = useState("Jl. Jendral Sudirman Kav. 52-53");
  const [city, setCity] = useState("Jakarta Selatan");
  const [province, setProvince] = useState("DKI Jakarta");
  const [postalCode, setPostalCode] = useState("12190");
  const [currency, setCurrency] = useState("IDR (Rp)");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/shutdown")
      .then(res => res.json())
      .then(data => setIsShutdown(data.shutdown))
      .catch(console.error);
      
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          if (data.settings.storeName) setStoreName(data.settings.storeName);
          if (data.settings.contactEmail) setContactEmail(data.settings.contactEmail);
          if (data.settings.storeIndustry) setStoreIndustry(data.settings.storeIndustry);
          if (data.settings.legalName) setLegalName(data.settings.legalName);
          if (data.settings.address) setAddress(data.settings.address);
          if (data.settings.city) setCity(data.settings.city);
          if (data.settings.province) setProvince(data.settings.province);
          if (data.settings.postalCode) setPostalCode(data.settings.postalCode);
          if (data.settings.currency) setCurrency(data.settings.currency);
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            storeName,
            contactEmail,
            storeIndustry,
            legalName,
            address,
            city,
            province,
            postalCode,
            currency
          }
        })
      });
      if (res.ok) alert("Settings saved successfully!");
      else alert("Failed to save settings");
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShutdown = async () => {
    if (!confirm(isShutdown ? "Are you sure you want to bring the system BACK ONLINE?" : "WARNING: Are you sure you want to completely SHUTDOWN the entire e-commerce platform? Customers will not be able to access the site!")) {
      return;
    }
    
    setLoadingShutdown(true);
    try {
      const res = await fetch("/api/shutdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shutdown: !isShutdown })
      });
      const data = await res.json();
      setIsShutdown(data.shutdown);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingShutdown(false);
    }
  };

  const SETTINGS_TABS = [
    { id: "general", label: "Store Details", icon: Store, desc: "Name, industry, and address" },
    { id: "payments", label: "Payments", icon: CreditCard, desc: "Providers and payment methods" },
    { id: "shipping", label: "Shipping", icon: Truck, desc: "Rates, zones, and fulfillment" },
    { id: "users", label: "Users & Permissions", icon: Users, desc: "Manage your admin team" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Email and system alerts" },
    { id: "security", label: "Security", icon: Shield, desc: "Passwords and 2FA" },
    { id: "domains", label: "Domains", icon: Globe, desc: "Custom domains and DNS" },
    { id: "danger", label: "Danger Zone", icon: AlertOctagon, desc: "System overrides and shutdown" },
  ];

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#212529] dark:text-white tracking-tight mb-2">Settings</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage your store configuration, payments, and team access.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <nav className="flex flex-col gap-2">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                    isActive 
                      ? "bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm" 
                      : "hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-[#F77F00]/10 text-[#F77F00]" : "bg-neutral-100 dark:bg-[#222] text-neutral-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${isActive ? "text-[#212529] dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
                      {tab.label}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              
              {/* Profile Box */}
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[#212529] dark:text-white">Store Profile</h2>
                  <button className="text-sm font-bold text-[#F77F00] hover:text-orange-600">Need Help?</button>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Store Name</label>
                      <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Contact Email</label>
                      <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Store Industry</label>
                    <select value={storeIndustry} onChange={e => setStoreIndustry(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none appearance-none">
                      <option>Sports & Outdoors</option>
                      <option>Fashion & Apparel</option>
                      <option>Electronics</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Box */}
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-black text-[#212529] dark:text-white mb-8">Store Address</h2>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Legal business name</label>
                    <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">City</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Province</label>
                      <input type="text" value={province} onChange={e => setProvince(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Postal Code</label>
                      <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Currency Box */}
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#212529] dark:text-white mb-2">Store Currency</h2>
                    <p className="text-sm font-medium text-neutral-500 max-w-md">This is the currency your products are sold in. After your first sale, currency is locked.</p>
                  </div>
                  <div className="w-32">
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none appearance-none">
                      <option>IDR (Rp)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-xl px-8 py-4 text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>

            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-black text-[#212529] dark:text-white mb-2">Payment Providers</h2>
                <p className="text-sm text-neutral-500 mb-8">Accept payments on your store using third-party providers.</p>
                
                <div className="flex flex-col gap-4">
                  {/* Midtrans */}
                  <div className="flex items-center justify-between p-6 border border-black/5 dark:border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 font-black text-sm">MID</div>
                      <div>
                        <h3 className="text-sm font-bold text-[#212529] dark:text-white">Midtrans (Active)</h3>
                        <p className="text-xs text-neutral-500">QRIS, GoPay, Bank Transfer</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-neutral-100 dark:bg-[#222] text-sm font-bold rounded-lg hover:bg-neutral-200 transition-colors">Manage</button>
                  </div>

                  {/* PayPal */}
                  <div className="flex items-center justify-between p-6 border border-black/5 dark:border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-[#00457C]/10 rounded-lg flex items-center justify-center text-[#00457C] font-black text-sm">PYPL</div>
                      <div>
                        <h3 className="text-sm font-bold text-[#212529] dark:text-white">PayPal</h3>
                        <p className="text-xs text-neutral-500">International Credit Cards</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#F77F00] text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors">Connect</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black text-[#212529] dark:text-white mb-2">Shipping Zones</h2>
                    <p className="text-sm text-neutral-500">Manage where you ship and how much you charge.</p>
                  </div>
                  <button className="px-4 py-2 bg-neutral-100 dark:bg-[#222] text-sm font-bold rounded-lg">Create Zone</button>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="p-6 border border-black/5 dark:border-white/5 rounded-2xl">
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">Domestic (Indonesia)</h3>
                    <p className="text-xs text-neutral-500 mb-4">JNE, SiCepat, GoSend</p>
                    <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-4"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-neutral-600">Standard Shipping</span>
                      <span className="font-bold">Rp 15.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black text-[#212529] dark:text-white mb-2">Team Members</h2>
                    <p className="text-sm text-neutral-500">Manage who has access to your admin dashboard.</p>
                  </div>
                  <button className="px-4 py-2 bg-[#F77F00] text-white text-sm font-bold rounded-lg hover:bg-orange-600">Invite Staff</button>
                </div>
                
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5">
                      <th className="py-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">Name</th>
                      <th className="py-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">Role</th>
                      <th className="py-3 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/5 dark:border-white/5">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F77F00] flex items-center justify-center font-bold text-xs">AD</div>
                          <div>
                            <p className="text-sm font-bold text-[#212529] dark:text-white">Admin User</p>
                            <p className="text-xs text-neutral-500">admin@trailforge.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-500 rounded text-xs font-bold">Owner</span></td>
                      <td className="py-4 text-right"><button className="text-sm font-bold text-neutral-400">Edit</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
                <h2 className="text-xl font-black text-[#212529] dark:text-white mb-8">Security & Passwords</h2>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:border-[#F77F00] outline-none" />
                  </div>
                  <div className="pt-2">
                    <button className="px-6 py-3 bg-neutral-100 dark:bg-[#222] text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors">Update Password</button>
                  </div>
                </div>

                <div className="h-px w-full bg-black/5 dark:bg-white/5 my-8"></div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-neutral-500">Protect your account with an extra layer of security.</p>
                  </div>
                  <button className="px-4 py-2 bg-[#F77F00] text-white text-sm font-bold rounded-lg hover:bg-orange-600">Enable</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "danger" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="bg-rose-500/5 dark:bg-rose-500/10 rounded-[2rem] p-8 shadow-sm border border-rose-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30">
                    <AlertOctagon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-rose-600 dark:text-rose-500 mb-2">Emergency Kill Switch</h2>
                    <p className="text-sm font-medium text-rose-600/80 dark:text-rose-400/80 max-w-2xl mb-8">
                      Activating this switch will completely halt all storefront interfaces and endpoints. Customers will see a system offline screen. The admin panel will remain accessible to turn the system back on.
                    </p>
                    
                    <button 
                      onClick={toggleShutdown}
                      disabled={loadingShutdown}
                      className={`px-8 py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all shadow-xl ${
                        isShutdown 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' 
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                      }`}
                    >
                      {loadingShutdown ? 'Processing...' : (isShutdown ? 'BRING SYSTEM ONLINE' : 'SHUTDOWN SYSTEM')}
                    </button>
                    
                    {isShutdown && (
                      <p className="mt-4 text-xs font-bold text-rose-500 animate-pulse">
                        ⚠️ SYSTEM IS CURRENTLY OFFLINE. STOREFRONT IS DEAD.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {["notifications", "domains"].includes(activeTab) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#111] rounded-[2rem] p-16 shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-neutral-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                <HelpCircle className="w-8 h-8 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-black text-[#212529] dark:text-white mb-2 capitalize">{activeTab} Settings</h2>
              <p className="text-sm font-medium text-neutral-500 max-w-md">This settings panel is currently under development. Please check back later or contact support.</p>
            </motion.div>
          )}
        </div>

      </div>
    </main>
  );
}
