"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UploadCloud, Save, X, Plus, Trash2, ImageIcon, PlusCircle, Check, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useToast } from "@/app/components/Toast";

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    status: "draft"
  });

  const [highlights, setHighlights] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([{key: "", value: ""}]);
  
  // Global Media Images (using mock URLs or local blobs)
  const [globalImages, setGlobalImages] = useState<string[]>([]);

  // Variant Management
  const [variants, setVariants] = useState<{
    id: string,
    image: string,
    size: string,
    colorName: string,
    colorHex: string,
    price: string,
    originalPrice: string,
    stock: string,
    sku: string
  }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    if (editId) {
      setIsEdit(true);
      // Fetch real product data
      fetch(`/api/products?id=${editId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setProduct({
              name: data.name || "",
              description: data.description || "",
              category: data.category || "General",
              status: "active"
            });
            setHighlights(data.highlights || [""]);
            setSpecs(data.specs || [{key: "", value: ""}]);
            setGlobalImages(data.images || [data.image].filter(Boolean));
            setVariants(data.variants || []);
          }
        })
        .catch(err => console.error("Failed to load product for edit", err));
    }
  }, []);

  const [currentVariant, setCurrentVariant] = useState({
    image: "",
    size: "M",
    colorName: "",
    colorHex: "#1a1a1a",
    price: "",
    originalPrice: "",
    stock: "",
    sku: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setGlobalImages([...globalImages, ...newImages]);
      // Auto select first image if none selected
      if (!currentVariant.image && newImages.length > 0) {
        setCurrentVariant({ ...currentVariant, image: newImages[0] });
      }
    }
  };

  const removeGlobalImage = (indexToRemove: number) => {
    const imgToRemove = globalImages[indexToRemove];
    setGlobalImages(globalImages.filter((_, idx) => idx !== indexToRemove));
    // If removed image was selected, clear it
    if (currentVariant.image === imgToRemove) {
      setCurrentVariant({ ...currentVariant, image: "" });
    }
  };

  const handleAddHighlight = () => setHighlights([...highlights, ""]);
  const handleRemoveHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index));
  const handleUpdateHighlight = (index: number, val: string) => {
    const newH = [...highlights];
    newH[index] = val;
    setHighlights(newH);
  };

  const handleAddSpec = () => setSpecs([...specs, {key: "", value: ""}]);
  const handleRemoveSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const handleUpdateSpec = (index: number, field: 'key'|'value', val: string) => {
    const newS = [...specs];
    newS[index][field] = val;
    setSpecs(newS);
  };

  const handleAddVariant = () => {
    if (!currentVariant.colorName || !currentVariant.price) return; 
    setVariants([...variants, { ...currentVariant, id: Date.now().toString() }]);
    // Reset fields for faster entry, keep image if they want same image for another size
    setCurrentVariant({ ...currentVariant, size: "M", colorName: "", price: "", originalPrice: "", stock: "", sku: "" });
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleUpdateVariant = (id: string, field: string, value: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSaveProduct = async () => {
    if (!product.name) {
      toast("warning", "Nama produk wajib diisi", "Silakan isi nama produk sebelum menyimpan.");
      return;
    }
    
    setIsSaving(true);
    try {
      const defaultPrice = variants.length > 0 ? parseFloat(variants[0].price) : 0;
      const defaultOriginalPrice = variants.length > 0 && variants[0].originalPrice ? parseFloat(variants[0].originalPrice) : defaultPrice;
      const defaultImage = globalImages.length > 0 ? globalImages[0] : "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80";

      const params = new URLSearchParams(window.location.search);
      const editId = params.get("edit");
      
      const payload: any = {
        name: product.name,
        category: product.category || "General",
        gender: "Unisex",
        price: defaultPrice,
        original_price: defaultOriginalPrice,
        image: defaultImage,
        description: product.description || "",
        highlights: highlights,
        specs: specs,
        variants: variants,
        images: globalImages
      };

      if (isEdit && editId) {
        payload.id = editId;
      } else {
        payload.id = `PRD-${Date.now()}`;
        payload.rating = 0;
        payload.reviews = 0;
        payload.sold = 0;
      }

      const res = await fetch("/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      
      toast("success", "Produk berhasil disimpan! ✨", `"${product.name}" sudah masuk ke database.`);
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err: any) {
      console.error("API ERROR:", err);
      toast("error", "Gagal menyimpan produk", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">{isEdit ? "Edit Product" : "Add New Product"}</h1>
            <p className="text-sm text-neutral-500 font-medium mt-1">{isEdit ? "Update your product details and variants." : "Configure advanced variants, pricing, and images."}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleSaveProduct}
            disabled={isSaving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-2xl px-8 py-3 text-sm font-bold hover:bg-orange-600 transition-colors disabled:bg-neutral-500 disabled:shadow-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
        
        {/* Left Column: Main Details */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-bold text-[#212529] dark:text-white mb-6">General Information</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Product Name</label>
                <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} placeholder="e.g., Timberline X-Coat" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Description</label>
                <textarea rows={4} value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} placeholder="Product description..." className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#F77F00]/20 outline-none resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#212529] dark:text-white">Global Media Gallery</h2>
              <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 dark:bg-[#1a1a1a] px-2 py-1 rounded-md">Total: {globalImages.length}</span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mb-6">Upload base product images here. You will select from these photos for each variant color.</p>
            
            <label className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] hover:border-[#F77F00]/50 transition-colors cursor-pointer group mb-6">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-[#F77F00]" />
              </div>
              <h3 className="text-sm font-bold text-[#212529] dark:text-white mb-1">Click to upload photos</h3>
              <p className="text-xs text-neutral-500 font-medium">Add all color variations here</p>
            </label>

            {globalImages.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mt-6">
                <AnimatePresence>
                  {globalImages.map((img, idx) => (
                    <motion.div key={img} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="aspect-square rounded-xl overflow-hidden relative group border border-black/10 dark:border-white/10">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeGlobalImage(idx)} 
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Highlights */}
            <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#212529] dark:text-white">Highlights</h2>
                <button onClick={handleAddHighlight} className="p-1.5 bg-[#F77F00]/10 text-[#F77F00] rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {highlights.map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                      <input type="text" value={h} onChange={(e) => handleUpdateHighlight(i, e.target.value)} placeholder="Point..." className="flex-1 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-[#F77F00]/20 outline-none" />
                      <button onClick={() => handleRemoveHighlight(i)} className="p-2 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#212529] dark:text-white">Tech Specs</h2>
                <button onClick={handleAddSpec} className="p-1.5 bg-[#F77F00]/10 text-[#F77F00] rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {specs.map((spec, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                      <input type="text" value={spec.key} onChange={(e) => handleUpdateSpec(i, 'key', e.target.value)} placeholder="Key" className="w-1/3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-2 px-3 text-sm font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#F77F00]/20 outline-none" />
                      <input type="text" value={spec.value} onChange={(e) => handleUpdateSpec(i, 'value', e.target.value)} placeholder="Value" className="flex-1 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-[#F77F00]/20 outline-none" />
                      <button onClick={() => handleRemoveSpec(i)} className="p-2 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Variant Builder */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-bold text-[#212529] dark:text-white mb-6">Organization</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Status</label>
                <select value={product.status} onChange={(e) => setProduct({...product, status: e.target.value})} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#F77F00]/20 outline-none">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Category</label>
                <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#F77F00]/20 outline-none">
                  <option value="">Select Category...</option>
                  <option value="Tenda & Shelter">Tenda & Shelter</option>
                  <option value="Jaket Ekspedisi">Jaket Ekspedisi</option>
                  <option value="Sepatu Gunung">Sepatu Gunung</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#212529] dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00] blur-[80px] opacity-20 rounded-full"></div>
            
            <h2 className="text-lg font-bold text-white mb-2">Variant Builder</h2>
            <p className="text-xs text-neutral-400 mb-6 font-medium">Create a new variant from your uploaded photos.</p>
            
            <div className="flex flex-col gap-6 relative z-10">
              
              {/* 1. SELECT PHOTO */}
              <div>
                <label className="block text-[10px] font-black text-[#F77F00] uppercase tracking-widest mb-3 border-b border-white/10 pb-2">1. Select Photo</label>
                {globalImages.length === 0 ? (
                  <div className="bg-black/20 border border-white/5 rounded-xl p-4 text-center">
                    <p className="text-xs text-neutral-500 font-medium">Please upload images to the Global Media Gallery first.</p>
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {globalImages.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentVariant({...currentVariant, image: img})}
                        className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-[3px] transition-all relative ${currentVariant.image === img ? 'border-[#F77F00] scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                        {currentVariant.image === img && (
                          <div className="absolute inset-0 bg-[#F77F00]/20 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="w-6 h-6 bg-[#F77F00] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-white" strokeWidth={4} />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. SELECT SIZE */}
              <div>
                <label className="block text-[10px] font-black text-[#F77F00] uppercase tracking-widest mb-3 border-b border-white/10 pb-2">2. Select Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {["S", "M", "L", "XL"].map(size => (
                    <button 
                      key={size}
                      onClick={() => setCurrentVariant({...currentVariant, size: size})}
                      className={`py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${currentVariant.size === size ? 'bg-white text-black' : 'bg-black/20 text-neutral-400 hover:text-white border border-white/5'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. COLOR DETAIL */}
              <div>
                <label className="block text-[10px] font-black text-[#F77F00] uppercase tracking-widest mb-3 border-b border-white/10 pb-2">3. Color Detail</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={currentVariant.colorHex}
                    onChange={(e) => setCurrentVariant({...currentVariant, colorHex: e.target.value})}
                    className="w-12 h-12 p-0 border-0 rounded-xl cursor-pointer bg-transparent shrink-0" 
                  />
                  <input 
                    type="text" 
                    value={currentVariant.colorName}
                    onChange={(e) => setCurrentVariant({...currentVariant, colorName: e.target.value})}
                    placeholder="Color Name (e.g. Alpine White)" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600" 
                  />
                </div>
              </div>

              {/* 4. PRICING & STOCK */}
              <div>
                <label className="block text-[10px] font-black text-[#F77F00] uppercase tracking-widest mb-3 border-b border-white/10 pb-2">4. Pricing & Stock</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="number" 
                      value={currentVariant.price}
                      onChange={(e) => setCurrentVariant({...currentVariant, price: e.target.value})}
                      placeholder="Selling Price (Rp)" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600" 
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      value={currentVariant.originalPrice}
                      onChange={(e) => setCurrentVariant({...currentVariant, originalPrice: e.target.value})}
                      placeholder="Orig. Price (Rp)" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-neutral-500 line-through focus:border-[#F77F00] outline-none placeholder:text-neutral-600" 
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      value={currentVariant.stock}
                      onChange={(e) => setCurrentVariant({...currentVariant, stock: e.target.value})}
                      placeholder="Stock" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={currentVariant.sku}
                      onChange={(e) => setCurrentVariant({...currentVariant, sku: e.target.value})}
                      placeholder="SKU" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600 uppercase" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAddVariant}
                disabled={!currentVariant.colorName || !currentVariant.price || !currentVariant.image}
                className="w-full mt-2 bg-[#F77F00] disabled:bg-neutral-600 disabled:text-neutral-400 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:shadow-none"
              >
                <PlusCircle className="w-5 h-5" />
                Add To Variant List
              </button>

            </div>
          </div>

        </div>

        {/* Full Width: Variants Table */}
        <div className="xl:col-span-3 bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-black text-[#212529] dark:text-white">Active Variants List</h2>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                {variants.length === 0 ? "No variants added yet. Build them using the Variant Builder." : `Showing ${variants.length} active variants.`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 w-16">Photo</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Color</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 w-24">Size</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Price (Rp)</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Orig. Price</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 w-24">Stock</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 w-24">SKU</th>
                  <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {variants.map((v, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      key={v.id} 
                      className="border-b border-black/5 dark:border-white/5 group hover:bg-neutral-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#1a1a1a]">
                          {v.image ? (
                            <img src={v.image} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2 text-xs font-bold text-[#212529] dark:text-white px-2.5 py-1.5 rounded-md bg-neutral-100 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 w-fit">
                          <span className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10" style={{backgroundColor: v.colorHex}}></span>
                          {v.colorName}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-xs font-black uppercase tracking-widest text-[#212529] dark:text-white px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 inline-block text-center min-w-[3rem]">
                          {v.size}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-xs font-bold text-neutral-400">Rp</span>
                          <input type="number" value={v.price} onChange={(e) => handleUpdateVariant(v.id, 'price', e.target.value)} className="w-full max-w-[120px] bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-[#F77F00] focus:bg-white dark:focus:bg-[#111] rounded-lg py-1.5 pl-7 pr-2 text-sm font-black text-[#212529] dark:text-white outline-none transition-all" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative flex items-center">
                          <span className="absolute left-2 text-xs font-bold text-neutral-400">Rp</span>
                          <input type="number" value={v.originalPrice} onChange={(e) => handleUpdateVariant(v.id, 'originalPrice', e.target.value)} placeholder="-" className="w-full max-w-[120px] bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-[#F77F00] focus:bg-white dark:focus:bg-[#111] rounded-lg py-1.5 pl-7 pr-2 text-xs font-bold text-neutral-400 outline-none transition-all" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" value={v.stock} onChange={(e) => handleUpdateVariant(v.id, 'stock', e.target.value)} placeholder="0" className="w-[80px] bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-[#F77F00] focus:bg-white dark:focus:bg-[#111] rounded-lg py-1.5 px-2 text-sm font-black text-[#212529] dark:text-white outline-none transition-all text-center" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={v.sku} onChange={(e) => handleUpdateVariant(v.id, 'sku', e.target.value)} placeholder="SKU" className="w-[100px] bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-[#F77F00] focus:bg-white dark:focus:bg-[#111] rounded-lg py-1.5 px-2 text-xs font-mono uppercase text-neutral-500 outline-none transition-all" />
                      </td>
                      <td className="py-3 px-4 text-right">
                         <button onClick={() => handleRemoveVariant(v.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors inline-block">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {variants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400 text-sm font-medium">
                      Table is empty. Use the Variant Builder to add combinations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
