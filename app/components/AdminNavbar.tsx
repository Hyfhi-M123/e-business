"use client";

import { useState, useEffect } from "react";
import { Menu, LogOut, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/utils/supabase/client";

export default function AdminNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Product", href: "/admin/product" },
    { name: "Offers", href: "/admin/offers" },
    { name: "Inventory", href: "/admin/inventory" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Sales", href: "/admin/sales" },
    { name: "Customer", href: "/admin/customer" },
    { name: "Newsletter", href: "/admin/newsletter" },
    { name: "Settings", href: "/admin/settings" },
  ];

  const navBackground = isScrolled
    ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-sm text-[#212529] dark:text-white" 
    : "bg-transparent border-b border-black/10 dark:border-white/10 text-[#212529] dark:text-white";

  return (
    <nav className={`fixed top-0 w-full z-[100] flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-500 ease-out ${navBackground}`}>
      
      {/* Kiri - Logo */}
      <div className="flex-1 flex items-center justify-start gap-4 lg:gap-6">
        <div className="w-10 h-10 border border-black/20 dark:border-white/30 flex items-center justify-center rounded-full cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors lg:hidden">
          <Menu className="w-4 h-4" />
        </div>
        <Link href="/admin" className="text-xl font-black tracking-tighter uppercase flex items-center gap-1 cursor-pointer">
          TrailForge<span className="text-[#F77F00] dark:text-orange-500">Admin</span>
          <span className="w-2 h-2 bg-[#F77F00] dark:bg-orange-500 rounded-full animate-pulse ml-2"></span>
        </Link>
      </div>
      
      {/* Tengah - Navigasi 1 Baris seperti website asli */}
      <div className={`hidden xl:flex items-center justify-center gap-6 lg:gap-8 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${isScrolled ? "text-[#495057] dark:text-neutral-300" : "text-[#212529]/80 dark:text-white/80"}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <div key={item.name} className="relative py-6 group">
              <Link 
                href={item.href} 
                className={`hover:text-[#F77F00] dark:hover:text-white transition-colors relative flex items-center ${isActive ? 'text-[#F77F00] dark:text-orange-500' : ''}`}
              >
                {item.name}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#F77F00] dark:bg-orange-500 transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Kanan - Icons & Profile */}
      <div className="flex-1 flex items-center justify-end gap-6">
        <button className="relative p-2 text-[#212529]/70 dark:text-white/70 hover:text-[#F77F00] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        
        <div className="flex items-center gap-4">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'Admin')}&background=F77F00&color=fff`} 
            alt="Admin Profile" 
            className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/20" 
          />
          <button onClick={handleLogout} className="text-[#212529]/70 dark:text-white/70 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
