"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Mountain } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 5000); 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("Berhasil masuk! Mendarat di katalog...", 'success');
      setTimeout(() => window.location.href = "/", 1200);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      showToast("Isi Email dan Password dulu ya untuk daftar!", 'error');
      return;
    }
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("Akun berhasil didaftarkan! Silakan klik Masuk Ekspedisi.", 'success');
    }
    
    setIsLoading(false);
  };

  // --- VARIANTS UNTUK EFEK ANIMASI WOW ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen flex text-[#212529] dark:text-white font-sans overflow-hidden bg-[#F8F9FA] dark:bg-neutral-950">
      
      {/* Kolom Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 relative z-10">
        
        {/* Ambient Glowing Orbs Background (Continuous Animation) */}
        <motion.div 
          initial={{ scale: 1, opacity: 0.3, rotate: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"
        />
        <motion.div 
          initial={{ scale: 1, opacity: 0.2 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"
        />
        
        {/* Tombol Kembali (Reveal paling awal) */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Link href="/" className="absolute top-8 left-8 md:left-20 flex items-center gap-2 text-sm font-semibold text-[#6C757D] dark:text-neutral-400 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </motion.div>

        {/* CONTAINER FORM STAGGERED */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-md w-full mx-auto"
        >
          {/* Logo & Judul */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10 group cursor-pointer z-10 relative">
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-3, 3, -3] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              whileHover={{ rotate: 180, scale: 1.1 }} 
            >
              <Mountain className="w-8 h-8 text-[#F77F00] dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            </motion.div>
            <span className="text-2xl font-black uppercase tracking-tighter">TrailForge</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 leading-none">
            Masuk <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Basecamp</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-[#6C757D] dark:text-neutral-400 font-medium mb-10 leading-relaxed">
            Akses logistik ekspedisimu, pantau keranjang pesanan, dan bersiaplah untuk petualangan selanjutnya.
          </motion.p>

          {/* Toast Notification Box */}
          {toast && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 mb-6 rounded-xl border text-sm font-semibold flex items-center gap-3 shadow-2xl ${
                toast.type === 'error' 
                  ? 'bg-red-950/50 border-red-900/50 text-red-200' 
                  : 'bg-emerald-950/50 border-emerald-900/50 text-emerald-200'
              }`}
            >
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} 
              />
              {toast.message}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Input Email */}
            <motion.div variants={itemVariants} className="space-y-2 group">
              <label className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 group-focus-within:text-[#F77F00] dark:text-orange-500 transition-colors ml-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#6C757D] dark:text-neutral-500 group-focus-within:text-[#F77F00] dark:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#E9ECEF] dark:bg-white/5 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white rounded-2xl py-4 flex items-center pl-14 pr-5 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-[#F77F00] dark:ring-orange-500/10 transition-all duration-300 placeholder:text-[#ADB5BD] dark:text-neutral-600 font-medium text-base shadow-inner [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                  placeholder="nomaden@hutan.com"
                  required
                />
              </div>
            </motion.div>

            {/* Input Password */}
            <motion.div variants={itemVariants} className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-400 group-focus-within:text-[#F77F00] dark:text-orange-500 transition-colors">Kata Sandi</label>
                <a href="#" className="text-xs font-bold text-[#6C757D] dark:text-neutral-500 hover:text-orange-400 transition-colors">Lupa Sandi?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#6C757D] dark:text-neutral-500 group-focus-within:text-[#F77F00] dark:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#E9ECEF] dark:bg-white/5 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white rounded-2xl py-4 flex items-center pl-14 pr-5 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-[#F77F00] dark:ring-orange-500/10 transition-all duration-300 placeholder:text-[#ADB5BD] dark:text-neutral-600 font-medium text-base shadow-inner [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {/* Tombol Aksi */}
            <motion.div variants={itemVariants} className="pt-4 flex flex-col gap-3">
              <motion.button 
                whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 10px 30px -10px rgba(249,115,22,0.5)" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                type="submit"
                className={`w-full ${isLoading ? 'bg-[#E9ECEF] dark:bg-neutral-800 text-[#6C757D] dark:text-neutral-500' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-[#212529] dark:text-white'} font-black uppercase tracking-widest py-4 rounded-xl transition-all duration-300 flex justify-center shadow-lg`}
              >
                {isLoading ? "Menjalin Koneksi..." : "Masuk Ekspedisi"}
              </motion.button>
              
              <motion.button 
                whileHover={!isLoading ? { scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="button"
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full bg-transparent border-2 border-[#DEE2E6] dark:border-white/10 text-[#495057] dark:text-neutral-300 hover:text-[#1B4332] dark:hover:text-[#212529] dark:text-white hover:border-white/20 font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300"
              >
                Daftar Akun Baru
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500">Atau</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </motion.div>

          {/* Tombol Google */}
          <motion.button 
            variants={itemVariants}
            whileHover={!isLoading ? { scale: 1.01, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            type="button"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              if (error) {
                showToast(error.message, 'error');
                setIsLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#E9ECEF] dark:bg-white/5 border border-[#DEE2E6] dark:border-white/10 text-[#212529] dark:text-white font-bold py-4 rounded-xl transition-colors shadow-inner"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? "Menghubungkan..." : "MASUK DENGAN GOOGLE"}
          </motion.button>

        </motion.div>
      </div>

      {/* Kolom Kanan: Visual Branding dengan Parallax + Ken Burns */}
      <div className="hidden md:block w-1/2 relative bg-white dark:bg-neutral-900 overflow-hidden">
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA] dark:from-neutral-950 to-transparent z-10 w-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] dark:from-neutral-950 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[#F8F9FA] dark:bg-neutral-950/20 z-10 mix-blend-multiply" />
        
        {/* Efek image zoom & pan abadi (Infinite Ken Burns Style) */}
        <motion.img 
          initial={{ scale: 1.2, x: 0, filter: "blur(10px) grayscale(100%)" }}
          animate={{ scale: [1, 1.05, 1], x: [0, -20, 0], filter: ["blur(0px) grayscale(20%)", "blur(0px) grayscale(10%)", "blur(0px) grayscale(20%)"] }}
          transition={{ 
            filter: { duration: 2, ease: "easeOut" },
            scale: { repeat: Infinity, duration: 30, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 40, ease: "easeInOut" }
          }}
          src="https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Climbing Journey" 
          className="w-full h-full object-cover"
        />
        
        {/* Text Mengambang di Foto */}
        <div className="absolute bottom-16 left-16 z-20 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            <div className="w-12 h-1 bg-[#F77F00] dark:bg-orange-500 mb-6 rounded-full"></div>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-[#212529] dark:text-white mb-4 leading-none">
              Selalu Siap <br/> Hadapi Badai.
            </h3>
            <p className="text-[#6C757D] dark:text-neutral-400 text-sm font-medium leading-relaxed">
              Bergabunglah dengan ribuan penjelajah lain untuk memastikan perjalananmu didukung gear teraman di kelasnya.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
