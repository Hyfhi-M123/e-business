"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Harap masukkan alamat email!");
      return;
    }
    if (!email.includes("@")) {
      showToast("Format email tidak valid!");
      return;
    }
    
    setIsLoading(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsLoading(false);
      showToast("Berhasil! Intel ekspedisi akan dikirim ke email Anda.");
      setEmail("");
    }, 1500);
  };

  return (
    <footer className="w-full bg-[#F8F9FA]/90 dark:bg-neutral-950/90 backdrop-blur-2xl pt-24 pb-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Newsletter */}
        <div className="lg:col-span-2">
          <span className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2 mb-4">TrailForge<span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full"></span></span>
          <p className="text-[#6C757D] dark:text-neutral-400 text-sm font-medium mb-6 max-w-md">
            Dapatkan intel eksklusif tentang rilisan gear terbaru dan diskon 10% untuk ekspedisi pertamamu bersama kami.
          </p>
          <form className="flex gap-2 max-w-md relative" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address..." 
              className="flex-1 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-[#DEE2E6] dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#F77F00] outline-none transition-colors" 
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 min-w-[100px] flex items-center justify-center bg-[#212529] dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#F77F00] dark:hover:bg-[#F77F00] hover:text-white transition-colors shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Join"
              )}
            </button>
          </form>

          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-12 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-2xl z-[9999] flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#F77F00] animate-pulse"></div>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Links 1 */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white mb-6">Navigasi</h4>
          <ul className="space-y-4 text-sm font-bold text-[#6C757D] dark:text-neutral-400">
            <li><Link href="/katalog" className="hover:text-[#F77F00] transition-colors">Katalog Gear</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-[#F77F00] transition-colors">Kisah Ekspedisi</Link></li>
            <li><button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-[#F77F00] transition-colors text-left">Riset Teknologi</button></li>
            <li><Link href="/login" className="hover:text-[#F77F00] transition-colors">Masuk Basecamp</Link></li>
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#212529] dark:text-white mb-6">Support</h4>
          <ul className="space-y-4 text-sm font-bold text-[#6C757D] dark:text-neutral-400">
            <li><button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-[#F77F00] transition-colors text-left">FAQ & Panduan</button></li>
            <li><Link href="/track" className="hover:text-[#F77F00] transition-colors text-left">Lacak Pesanan</Link></li>
            <li><button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-[#F77F00] transition-colors text-left">Garansi & Retur</button></li>
            <li><button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-[#F77F00] transition-colors text-left">Hubungi Kami</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#DEE2E6] dark:border-white/10 text-xs font-bold text-[#6C757D] dark:text-neutral-500">
        <p>© 2026 TrailForge Expedition Gear. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => showToast("Halaman ini sedang dalam tahap pengembangan (Coming Soon).")} className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
}
