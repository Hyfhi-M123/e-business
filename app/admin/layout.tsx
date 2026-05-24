"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import { ToastProvider } from "@/app/components/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in -> Kick to login
        router.push("/login?redirect=/admin");
      } else if (user.user_metadata?.role !== "admin") {
        // Logged in but not admin -> Kick to home
        router.push("/?error=unauthorized_admin");
      } else {
        // Is admin -> Let them in
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F77F00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F4F7FE] dark:bg-[#050505] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 min-h-screen relative">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
