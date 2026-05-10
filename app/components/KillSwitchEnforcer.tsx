"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertOctagon } from "lucide-react";

export default function KillSwitchEnforcer() {
  const [isShutdown, setIsShutdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkShutdown = async () => {
      try {
        const res = await fetch("/api/shutdown");
        const data = await res.json();
        setIsShutdown(data.shutdown);
      } catch (e) {
        console.error("Failed to check shutdown state", e);
      }
    };

    // Initial check
    checkShutdown();

    // Poll every 3 seconds to ensure real-time kill switch activation
    const interval = setInterval(checkShutdown, 3000);
    return () => clearInterval(interval);
  }, []);

  // Do not enforce shutdown on the admin panel so the admin can turn it back on
  if (!isShutdown) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-8 text-center selection:bg-rose-500/30">
      <AlertOctagon className="w-32 h-32 text-rose-500 mb-8 animate-pulse shadow-rose-500/50 drop-shadow-[0_0_50px_rgba(244,63,94,0.5)]" />
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">SYSTEM OFFLINE</h1>
      <p className="text-lg md:text-xl font-medium text-neutral-400 max-w-3xl leading-relaxed">
        The e-commerce platform is currently undergoing emergency maintenance or has been intentionally shut down by the administrator. All processes, storefronts, and endpoints are halted.
      </p>
      <div className="mt-12 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-neutral-500 tracking-widest uppercase">
        Error Code: ERR_SYS_HALTED
      </div>
    </div>
  );
}
