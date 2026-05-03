"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/client";
import { motion } from "framer-motion";
import { Mountain, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Memverifikasi identitas penjelajah...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase client-js otomatis membaca token dari URL fragment (#)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage(`Selamat datang, ${data.session.user.user_metadata?.full_name || "Penjelajah"}!`);
          
          // Redirect ke katalog setelah 1.5 detik
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          setStatus("error");
          setMessage("Sesi tidak ditemukan. Silakan coba login kembali.");
        }
      } catch {
        setStatus("error");
        setMessage("Terjadi kesalahan tak terduga.");
      }
    };

    handleCallback();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-neutral-950 text-[#212529] dark:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        {/* Ikon */}
        <motion.div
          animate={status === "loading" ? { rotate: [0, 360] } : { scale: [1, 1.1, 1] }}
          transition={status === "loading" ? { repeat: Infinity, duration: 2, ease: "linear" } : { duration: 0.5 }}
          className="inline-block"
        >
          {status === "loading" ? (
            <Loader2 className="w-12 h-12 text-[#F77F00] dark:text-orange-500" />
          ) : (
            <Mountain className="w-12 h-12 text-[#F77F00] dark:text-orange-500" />
          )}
        </motion.div>

        {/* Pesan */}
        <h2 className="text-2xl font-black uppercase tracking-tight">{message}</h2>

        {status === "loading" && (
          <p className="text-[#6C757D] dark:text-neutral-400 text-sm font-medium">
            Sedang menghubungkan ke basecamp...
          </p>
        )}



        {status === "error" && (
          <div className="space-y-4">
            <p className="text-red-400 text-sm font-medium">Login gagal. Silakan coba lagi.</p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Kembali ke Login
            </a>
          </div>
        )}
      </motion.div>
    </main>
  );
}
