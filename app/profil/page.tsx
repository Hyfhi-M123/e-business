"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mountain, User, Package, MapPin, LogOut, Mail, Phone, Calendar, Edit3, ChevronRight, Loader2, Camera, Trash2, Star, X, Home, Building2, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabase/client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false, loading: () => <div className="w-full h-56 rounded-2xl bg-neutral-100 dark:bg-white/5 animate-pulse" /> });

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  full: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

type TabKey = "profil" | "pesanan" | "alamat" | "pembayaran";

const tabs = [
  { key: "profil" as TabKey, label: "Informasi Pribadi", icon: User },
  { key: "pesanan" as TabKey, label: "Riwayat Pesanan", icon: Package },
  { key: "alamat" as TabKey, label: "Alamat Tersimpan", icon: MapPin },
  { key: "pembayaran" as TabKey, label: "Pembayaran", icon: CreditCard },
];

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profil");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", phone: "", birthday: "" });
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "Rumah", name: "", phone: "", full: "", lat: 0, lng: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);
      setFormData({
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        phone: user.user_metadata?.phone || "",
        birthday: user.user_metadata?.birthday || "",
      });
      setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || null);
      setAddresses(user.user_metadata?.addresses || []);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { full_name: formData.full_name, phone: formData.phone, birthday: formData.birthday }
    });
    const { data: { user: updated } } = await supabase.auth.getUser();
    setUser(updated);
    setEditMode(false);
    setSaving(false);
    showToast("Profil berhasil disimpan!");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await supabase.auth.updateUser({ data: { avatar_url: dataUrl, picture: dataUrl } });
      setAvatarUrl(dataUrl);
      setUploadingAvatar(false);
      showToast("Foto profil berhasil diperbarui!");
    };
    reader.readAsDataURL(file);
  };

  const saveAddresses = async (list: Address[]) => {
    await supabase.auth.updateUser({ data: { addresses: list } });
    setAddresses(list);
  };

  const handleAddAddress = async () => {
    if (!addrForm.name || !addrForm.phone || !addrForm.full) return showToast("Lengkapi semua field!");
    if (editingAddress) {
      const updated = addresses.map(a => a.id === editingAddress.id ? { ...editingAddress, ...addrForm } : a);
      await saveAddresses(updated);
      showToast("Alamat berhasil diperbarui!");
    } else {
      const newAddr: Address = { id: Date.now().toString(), ...addrForm, isDefault: addresses.length === 0 };
      await saveAddresses([...addresses, newAddr]);
      showToast("Alamat berhasil ditambahkan!");
    }
    setAddrForm({ label: "Rumah", name: "", phone: "", full: "", lat: 0, lng: 0 });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const deleteAddress = async (id: string) => {
    const filtered = addresses.filter(a => a.id !== id);
    if (filtered.length > 0 && !filtered.some(a => a.isDefault)) filtered[0].isDefault = true;
    await saveAddresses(filtered);
    showToast("Alamat dihapus.");
  };

  const setDefaultAddress = async (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    await saveAddresses(updated);
    showToast("Alamat utama diperbarui!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
  const itemV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-neutral-950">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <Loader2 className="w-10 h-10 text-[#F77F00] dark:text-orange-500" />
        </motion.div>
      </main>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Penjelajah";

  return (
    <main className="min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white font-sans">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold rounded-xl shadow-2xl">
          {toast}
        </motion.div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

      {/* Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-[400px] pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-[#DEE2E6] dark:border-white/10 bg-[#F8F9FA]/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#6C757D] dark:text-neutral-400 hover:text-[#212529] dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#F77F00] dark:text-orange-500" />
            <span className="text-sm font-black uppercase tracking-tight">TrailForge</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <motion.div variants={containerV} initial="hidden" animate="show">

          {/* Profile Card Header */}
          <motion.div variants={itemV} className="glass rounded-3xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar - Click to Upload */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#F77F00]/30 dark:border-orange-500/30 shadow-lg shadow-orange-500/10 relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-3xl font-black text-white">{displayName.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingAvatar ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#F8F9FA] dark:border-neutral-950 rounded-full" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-black uppercase tracking-tight mb-1">{displayName}</h1>
                <p className="text-[#6C757D] dark:text-neutral-400 text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                    Penjelajah Aktif
                  </span>
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-[#F77F00] dark:text-orange-400 border border-orange-500/20 rounded-full">
                    {user?.app_metadata?.provider === "google" ? "Google Account" : "Email Account"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div variants={itemV} className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                    : "bg-white/50 dark:bg-white/5 border border-[#DEE2E6] dark:border-white/10 text-[#6C757D] dark:text-neutral-400 hover:text-[#212529] dark:hover:text-white hover:border-orange-500/30"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* === TAB: Informasi Pribadi === */}
            {activeTab === "profil" && (
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black uppercase tracking-tight">Data Pribadi</h2>
                  {!editMode ? (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#F77F00] dark:text-orange-400 border border-orange-500/20 rounded-xl hover:bg-orange-500/10 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditMode(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 border border-[#DEE2E6] dark:border-white/10 rounded-xl hover:bg-white/10 transition-colors">Batal</button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg">
                        {saving ? "Menyimpan..." : "Simpan"}
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Nama */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <User className="w-4 h-4 text-[#F77F00] dark:text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Nama Lengkap</span>
                    </div>
                    {editMode ? (
                      <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="flex-1 bg-transparent border-b border-orange-500/30 focus:border-orange-500 outline-none py-1 font-semibold transition-colors" />
                    ) : (
                      <span className="font-semibold">{displayName}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <Mail className="w-4 h-4 text-[#F77F00] dark:text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Email</span>
                    </div>
                    <span className="font-semibold">{user?.email}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Terverifikasi</span>
                  </div>

                  {/* Telepon */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <Phone className="w-4 h-4 text-[#F77F00] dark:text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Telepon</span>
                    </div>
                    {editMode ? (
                      <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="08xxxxxxxxxx"
                        className="flex-1 bg-transparent border-b border-orange-500/30 focus:border-orange-500 outline-none py-1 font-semibold transition-colors placeholder:text-neutral-600" />
                    ) : (
                      <span className="font-semibold">{formData.phone || <span className="text-[#ADB5BD] dark:text-neutral-600 italic">Belum diisi</span>}</span>
                    )}
                  </div>

                  {/* Tanggal Lahir */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <Calendar className="w-4 h-4 text-[#F77F00] dark:text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Tanggal Lahir</span>
                    </div>
                    {editMode ? (
                      <input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                        className="flex-1 bg-transparent border-b border-orange-500/30 focus:border-orange-500 outline-none py-1 font-semibold transition-colors" />
                    ) : (
                      <span className="font-semibold">{formData.birthday || <span className="text-[#ADB5BD] dark:text-neutral-600 italic">Belum diisi</span>}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* === TAB: Riwayat Pesanan === */}
            {activeTab === "pesanan" && (
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xl font-black uppercase tracking-tight mb-8">Riwayat Pesanan</h2>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-[#F77F00] dark:text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Belum Ada Pesanan</h3>
                  <p className="text-[#6C757D] dark:text-neutral-500 text-sm max-w-sm mb-6">Mulai petualanganmu dengan menjelajahi katalog gear terbaik kami.</p>
                  <Link href="/katalog">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2">
                      Jelajahi Katalog <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}

            {/* === TAB: Alamat Tersimpan === */}
            {activeTab === "alamat" && (
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black uppercase tracking-tight">Alamat Tersimpan</h2>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditingAddress(null); setAddrForm({ label: "Rumah", name: "", phone: "", full: "", lat: 0, lng: 0 }); setShowAddressForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#F77F00] dark:text-orange-400 border border-orange-500/20 rounded-xl hover:bg-orange-500/10 transition-colors">
                    + Tambah
                  </motion.button>
                </div>

                {/* Address Form Modal */}
                {showAddressForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.03] border border-[#DEE2E6] dark:border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest">{editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}</h3>
                      <button onClick={() => setShowAddressForm(false)}><X className="w-4 h-4 text-neutral-500" /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {["Rumah", "Kantor", "Lainnya"].map(l => (
                          <button key={l} onClick={() => setAddrForm({...addrForm, label: l})}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${addrForm.label === l ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-neutral-400"}`}>
                            {l === "Rumah" ? <span className="flex items-center gap-1"><Home className="w-3 h-3" />{l}</span> : l === "Kantor" ? <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{l}</span> : l}
                          </button>
                        ))}
                      </div>
                      <input value={addrForm.name} onChange={e => setAddrForm({...addrForm, name: e.target.value})} placeholder="Nama penerima"
                        className="w-full bg-transparent border border-[#DEE2E6] dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-colors" />
                      <input value={addrForm.phone} onChange={e => setAddrForm({...addrForm, phone: e.target.value})} placeholder="Nomor telepon"
                        className="w-full bg-transparent border border-[#DEE2E6] dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-colors" />
                      <textarea value={addrForm.full} onChange={e => setAddrForm({...addrForm, full: e.target.value})} placeholder="Alamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota, kode pos)" rows={3}
                        className="w-full bg-transparent border border-[#DEE2E6] dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 outline-none transition-colors resize-none" />
                      {/* Map Picker */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mb-2">📍 Pin Lokasi di Peta</p>
                        <MapPicker
                          initialLat={addrForm.lat || undefined}
                          initialLng={addrForm.lng || undefined}
                          onSelect={(lat, lng, address) => {
                            setAddrForm(prev => ({ ...prev, lat, lng, full: prev.full || address }));
                          }}
                        />
                      </div>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleAddAddress}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg">
                        {editingAddress ? "Simpan Perubahan" : "Tambah Alamat"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <motion.div key={addr.id} layout className="p-5 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5 relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-orange-500/10 text-[#F77F00] dark:text-orange-400">{addr.label}</span>
                              {addr.isDefault && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center gap-1"><Star className="w-2.5 h-2.5" />Utama</span>}
                            </div>
                            <p className="font-bold text-sm mb-1">{addr.name}</p>
                            <p className="text-xs text-[#6C757D] dark:text-neutral-500 mb-1">{addr.phone}</p>
                            <p className="text-sm text-[#495057] dark:text-neutral-400 leading-relaxed">{addr.full}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            {!addr.isDefault && (
                              <button onClick={() => setDefaultAddress(addr.id)} title="Jadikan Utama"
                                className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors"><Star className="w-4 h-4 text-neutral-500 hover:text-emerald-500" /></button>
                            )}
                            <button onClick={() => { setEditingAddress(addr); setAddrForm({ label: addr.label, name: addr.name, phone: addr.phone, full: addr.full }); setShowAddressForm(true); }} title="Edit"
                              className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4 text-neutral-500 hover:text-orange-500" /></button>
                            <button onClick={() => deleteAddress(addr.id)} title="Hapus"
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-500" /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                      <MapPin className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Belum Ada Alamat</h3>
                    <p className="text-[#6C757D] dark:text-neutral-500 text-sm max-w-sm">Tambahkan alamat pengiriman agar proses checkout lebih cepat.</p>
                  </div>
                )}
              </div>
            )}


            {/* === TAB: Pembayaran === */}
            {activeTab === "pembayaran" && (
              <div className="glass rounded-3xl p-8">
                <h2 className="text-xl font-black uppercase tracking-tight mb-8">Metode Pembayaran</h2>
                <div className="space-y-4 mb-8">
                  {[
                    { name: "QRIS", desc: "Scan QR untuk bayar dari e-wallet manapun", icon: "📱", },
                    { name: "Transfer Bank (VA)", desc: "BCA, BNI, BRI, Mandiri, Permata", icon: "🏦", },
                    { name: "GoPay / ShopeePay", desc: "Langsung dari aplikasi e-wallet", icon: "💚", },
                    { name: "Kartu Kredit / Debit", desc: "Visa, Mastercard, JCB", icon: "💳", },
                  ].map((method, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-[#F8F9FA] dark:bg-white/[0.02] border border-[#DEE2E6] dark:border-white/5 hover:border-orange-500/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-2xl shadow-sm">{method.icon}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{method.name}</p>
                        <p className="text-xs text-[#6C757D] dark:text-neutral-500">{method.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[#F77F00] dark:text-orange-500" />
                    <div>
                      <p className="text-xs font-bold text-[#F77F00] dark:text-orange-400">Didukung oleh Midtrans</p>
                      <p className="text-[10px] text-[#6C757D] dark:text-neutral-500">Pembayaran diproses saat checkout. Semua transaksi dienkripsi dan aman.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
