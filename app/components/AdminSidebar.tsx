"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, BarChart2, Package, Tag, 
  Archive, ShoppingCart, TrendingUp, Users, 
  Mail, Settings, ChevronRight, Compass, LogOut
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Offers", href: "/admin/offers", icon: Tag },
    { name: "Inventory", href: "/admin/inventory", icon: Archive },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Sales", href: "/admin/sales", icon: TrendingUp },
    { name: "Customer", href: "/admin/users", icon: Users },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      
      {/* Logo Area */}
      <div className="h-24 flex items-center px-8">
        <Link href="/admin" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 relative group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F77F00] to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[#212529] dark:text-white">TrailForge</span>
            <span className="text-[10px] block text-[#F77F00] leading-none tracking-widest mt-0.5">ADMIN</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 scrollbar-hide relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group z-10 ${
                isActive 
                  ? "text-white" 
                  : "text-[#6C757D] dark:text-neutral-400 hover:text-[#212529] dark:hover:text-white"
              }`}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 bg-gradient-to-r from-[#F77F00] to-orange-500 rounded-xl shadow-lg shadow-orange-500/20 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover Indicator Background (only visible when not active) */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              )}

              <div className="flex items-center gap-3">
                <item.icon 
                  className={`w-[18px] h-[18px] transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-sm tracking-wide ${isActive ? "font-bold" : "font-semibold"}`}>
                  {item.name}
                </span>
              </div>
              
              {/* Optional dot for notification on specific tabs (e.g. Orders) */}
              {item.name === "Orders" && !isActive && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-neutral-50 dark:bg-[#111] rounded-2xl p-4 flex items-center justify-between border border-black/5 dark:border-white/5 shadow-inner">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'Admin')}&background=F77F00&color=fff`} 
                alt="Admin Profile" 
                className="w-10 h-10 rounded-full object-cover shadow-sm" 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#111] rounded-full"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-[#212529] dark:text-white truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Administrator
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
