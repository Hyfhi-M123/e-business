"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, MoreHorizontal, CheckCircle2, Clock, Truck, MapPin, User, Mail, Phone, Package, Copy, CreditCard, ExternalLink } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string || "TRF-1029";
  
  // Dummy Data for the specific order
  const order = {
    id: orderId,
    date: "Oct 24, 2023 at 14:30 WIB",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    customer: {
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
      phone: "+62 812-3456-7890",
      ordersCount: 3,
    },
    shippingAddress: {
      name: "Budi Santoso",
      street: "Jl. Sudirman No. 45, Tower B, Lt. 12",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postalCode: "10220",
      country: "Indonesia"
    },
    items: [
      {
        id: 1,
        name: "Timberline X-Coat Arctic Pro",
        variant: "Midnight Black - L",
        sku: "TRF-XCT-MB-L",
        price: 3450000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80"
      },
      {
        id: 2,
        name: "AeroTrek Hiking Boots",
        variant: "Desert Sand - 42",
        sku: "TRF-BT-DS-42",
        price: 1200000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=200&q=80"
      }
    ],
    financials: {
      subtotal: 4650000,
      shipping: 50000,
      tax: 0,
      discount: 0,
      total: 4700000
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <main className="p-8 lg:p-10 max-w-[1400px] mx-auto w-full min-h-screen">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-10 h-10 rounded-2xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#212529] dark:text-white tracking-tight">#{order.id}</h1>
            <span className="text-sm font-medium text-neutral-500 mt-1">{order.date}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm text-neutral-600 dark:text-neutral-300 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-neutral-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
            More Actions
          </button>
        </div>
      </div>

      {/* Badges Bar */}
      <div className="flex gap-3 mb-8">
        {order.paymentStatus === 'paid' && <span className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4 mr-2" /> Payment: Paid</span>}
        {order.fulfillmentStatus === 'unfulfilled' && <span className="inline-flex items-center px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#F77F00] text-xs font-black uppercase tracking-widest"><Clock className="w-4 h-4 mr-2" /> Fulfillment: Unfulfilled</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* LEFT COLUMN: Order Details (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Order Items */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white">Order Items</h2>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{order.items.length} Items</span>
            </div>

            <div className="flex flex-col gap-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] overflow-hidden shrink-0 border border-black/5 dark:border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#212529] dark:text-white leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-neutral-500">
                      <span>{item.variant}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                      <span className="font-mono uppercase">{item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#212529] dark:text-white">Rp {item.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs font-bold text-neutral-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Financials */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-neutral-400" /> Payment Summary
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (JNE Reguler)</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-[#212529] dark:text-white font-bold">Rp {order.financials.tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span className="font-bold">- Rp {order.financials.discount.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>
              
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-[#212529] dark:text-white">Total</span>
                <span className="text-2xl font-black text-[#212529] dark:text-white">Rp {order.financials.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="mt-8 bg-neutral-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-black/5 dark:border-white/5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#212529] dark:text-white">Paid by Midtrans (Credit Card)</p>
                <p className="text-xs text-neutral-500 mt-1">Transaction ID: MDT-992837465 • {order.date}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Customer & Fulfillment (1/3) */}
        <div className="flex flex-col gap-8">
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <h2 className="text-lg font-black text-[#212529] dark:text-white mb-6">Customer</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#F77F00]/10 text-[#F77F00] flex items-center justify-center text-sm font-black shrink-0">
                {getInitials(order.customer.name)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#212529] dark:text-white">{order.customer.name}</h3>
                <p className="text-xs text-neutral-500 font-medium">{order.customer.ordersCount} orders in total</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm font-medium">
              <div className="flex items-center gap-3 text-[#212529] dark:text-white">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`mailto:${order.customer.email}`} className="hover:text-[#F77F00] transition-colors truncate">{order.customer.email}</a>
              </div>
              <div className="flex items-center gap-3 text-[#212529] dark:text-white">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`tel:${order.customer.phone}`} className="hover:text-[#F77F00] transition-colors">{order.customer.phone}</a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[#212529] dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-neutral-400" /> Shipping Address
              </h2>
              <button className="text-xs font-bold text-[#F77F00] hover:underline">Edit</button>
            </div>
            
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <span className="block text-[#212529] dark:text-white font-bold mb-1">{order.shippingAddress.name}</span>
              {order.shippingAddress.street}<br/>
              {order.shippingAddress.city}, {order.shippingAddress.province}<br/>
              {order.shippingAddress.country} {order.shippingAddress.postalCode}
            </div>

            <button className="mt-4 flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#212529] dark:hover:text-white transition-colors">
              <Copy className="w-3 h-3" /> Copy Address
            </button>
          </div>

          {/* Fulfillment Action */}
          <div className="bg-[#212529] dark:bg-[#1a1a1a] rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00] blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg font-black text-white mb-2 relative z-10">Fulfillment</h2>
            <p className="text-xs text-neutral-400 font-medium mb-6 relative z-10">Process this order and input the tracking number.</p>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Courier</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none">
                  <option>JNE Reguler</option>
                  <option>J&T Express</option>
                  <option>Sicepat BEST</option>
                  <option>GoSend Instant</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Tracking Number</label>
                <input type="text" placeholder="e.g. JNE1234567890" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-[#F77F00] outline-none placeholder:text-neutral-600" />
              </div>
              
              <button className="w-full mt-4 bg-[#F77F00] text-white shadow-lg shadow-orange-500/20 font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                <Package className="w-5 h-5" />
                Fulfill Order
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
