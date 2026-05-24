"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Percent, Banknote, Truck, Calendar, Clock } from "lucide-react";

function OfferForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = !!editId;

  const [discountType, setDiscountType] = useState("percentage");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [description, setDescription] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [limit, setLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasEndDate, setHasEndDate] = useState(false);
  const [hasLimit, setHasLimit] = useState(false);
  const [hasMinOrder, setHasMinOrder] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetch("/api/promo").then(res => res.json()).then(data => {
        if (data.promos) {
          const promo = data.promos.find((p: any) => p.id === editId);
          if (promo) {
            setCode(promo.code);
            setDiscountType(promo.type);
            setDiscountValue(promo.value.toString());
            setDescription(promo.description || "");
            if (promo.min_order_amount > 0) {
              setHasMinOrder(true);
              setMinOrder(promo.min_order_amount.toString());
            }
            if (promo.usage_limit) {
              setHasLimit(true);
              setLimit(promo.usage_limit.toString());
            }
            if (promo.start_date) setStartDate(promo.start_date.split("T")[0]);
            if (promo.end_date) {
              setHasEndDate(true);
              setEndDate(promo.end_date.split("T")[0]);
            }
          }
        }
      });
    }
  }, [isEdit, editId]);

  const handleSave = async () => {
    try {
      const payload = {
        code,
        type: discountType,
        value: Number(discountValue) || 0,
        description: description || `${discountType} discount`,
        min_order_amount: hasMinOrder ? Number(minOrder) : 0,
        usage_limit: hasLimit ? Number(limit) : null,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: hasEndDate && endDate ? new Date(endDate).toISOString() : null
      };

      const url = isEdit ? `/api/promo/${editId}` : "/api/promo";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push("/admin/offers");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  return (
    <main className="p-8 lg:p-10 max-w-[1200px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/offers" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">{isEdit ? 'Edit Discount' : 'Create Discount'}</h1>
            <span className="text-sm font-medium text-neutral-500 mt-1">{isEdit ? `Editing configuration for ${code}` : 'Configure promo codes and automated rules.'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={handleSave} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 rounded-xl px-8 py-3 text-sm font-bold hover:bg-orange-600 transition-colors">
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Save Discount'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Amount & Type */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Discount Code</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20" 
                className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-4 px-5 text-lg font-black uppercase focus:ring-2 focus:ring-[#F77F00]/20 focus:border-[#F77F00] outline-none transition-all"
              />
              <button onClick={generateRandomCode} className="px-6 py-4 rounded-xl border border-black/5 dark:border-white/5 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-all whitespace-nowrap flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate
              </button>
            </div>
            
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Internal description (e.g. Summer Sale 20% Off)" 
              className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-5 text-sm font-medium focus:border-[#F77F00] outline-none mb-2"
            />
            <p className="text-sm font-medium text-neutral-500">Customers must enter this code at checkout.</p>

            <div className="h-px bg-black/5 dark:bg-white/5 my-8"></div>

            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Type & Value</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button 
                onClick={() => setDiscountType("percentage")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${discountType === 'percentage' ? 'border-[#F77F00] bg-orange-50/50 dark:bg-orange-500/5 text-[#F77F00]' : 'border-black/5 dark:border-white/5 text-neutral-500 hover:border-black/10 dark:hover:border-white/10'}`}
              >
                <Percent className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Percentage</span>
              </button>
              <button 
                onClick={() => setDiscountType("fixed")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${discountType === 'fixed' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 text-blue-500' : 'border-black/5 dark:border-white/5 text-neutral-500 hover:border-black/10 dark:hover:border-white/10'}`}
              >
                <Banknote className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Fixed Amount</span>
              </button>
              <button 
                onClick={() => setDiscountType("shipping")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${discountType === 'shipping' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-500' : 'border-black/5 dark:border-white/5 text-neutral-500 hover:border-black/10 dark:hover:border-white/10'}`}
              >
                <Truck className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Free Shipping</span>
              </button>
            </div>

            {discountType !== 'shipping' && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-neutral-500 w-32">Discount Value</span>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                    {discountType === 'percentage' ? '%' : 'Rp'}
                  </span>
                  <input 
                    type="number" 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="0" 
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-black focus:border-[#F77F00] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Minimum Requirements */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Minimum Requirements</h2>
            
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-4 p-4 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <input type="radio" name="req" checked={!hasMinOrder} onChange={() => setHasMinOrder(false)} className="w-4 h-4 accent-[#F77F00]" />
                <span className="text-sm font-bold text-[#212529] dark:text-white">None</span>
              </label>
              
              <label className="flex items-center gap-4 p-4 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <input type="radio" name="req" checked={hasMinOrder} onChange={() => setHasMinOrder(true)} className="w-4 h-4 accent-[#F77F00]" />
                <div className="flex flex-col gap-3 flex-1">
                  <span className="text-sm font-bold text-[#212529] dark:text-white">Minimum purchase amount (Rp)</span>
                  <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="Rp 0" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-2 px-4 text-sm font-black focus:border-[#F77F00] outline-none" />
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
                <input type="radio" name="req" className="w-4 h-4 accent-[#F77F00]" />
                <div className="flex flex-col gap-3 flex-1">
                  <span className="text-sm font-bold text-[#212529] dark:text-white">Minimum quantity of items</span>
                  <input type="number" placeholder="0" className="w-full bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-2 px-4 text-sm font-black focus:border-[#F77F00] outline-none" />
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="flex flex-col gap-8">
          
          {/* Active Dates */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Active Dates</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Start Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold focus:border-[#F77F00] outline-none" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Start Time</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="time" className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold focus:border-[#F77F00] outline-none" />
                </div>
              </div>

              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasEndDate} onChange={e => setHasEndDate(e.target.checked)} className="w-4 h-4 rounded border-black/20 accent-[#F77F00]" />
                <span className="text-sm font-bold text-[#212529] dark:text-white">Set end date</span>
              </label>
              {hasEndDate && (
                <div>
                  <div className="relative mt-2">
                    <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold focus:border-[#F77F00] outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Limits */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Usage Limits</h2>
            
            <div className="flex flex-col gap-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={hasLimit} onChange={e => setHasLimit(e.target.checked)} className="w-4 h-4 rounded border-black/20 accent-[#F77F00] mt-0.5" />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-[#212529] dark:text-white">Limit number of times this discount can be used in total</span>
                  {hasLimit && (
                    <input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="0" className="w-24 bg-neutral-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-lg py-2 px-3 text-sm font-black focus:border-[#F77F00] outline-none" />
                  )}
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-black/20 accent-[#F77F00]" />
                <span className="text-sm font-bold text-[#212529] dark:text-white">Limit to one use per customer</span>
              </label>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function CreateOfferPage() {
  return (
    <Suspense fallback={<div className="p-10 text-neutral-500 font-medium">Loading form...</div>}>
      <OfferForm />
    </Suspense>
  );
}
