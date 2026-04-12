"use client";

import { motion } from "framer-motion";
import { Mountain, ArrowRight, Tent, Compass, Flame, Flashlight, MapPin, Wind } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Elemen Organik Bergerak di Latar Belakang — Kesan Alam & Gunung */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-[120px]">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 60, 0],
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[450px] h-[450px] bg-primary/30"
        />
      </div>

      {/* Blob kedua — Aksen Amber */}
      <div className="absolute top-1/3 right-1/4 -z-10 blur-[100px]">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -45, 0],
            borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 60% 70% 40% / 50% 60% 30% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[300px] h-[300px] bg-accent/20"
        />
      </div>

      {/* Konten Hero — Bertema Petualangan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-earth-300">
          <Mountain size={16} />
          <span>Adventure Starts Here</span>
        </div>
        
        {/* Headline Utama */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-earth-100 to-earth-400">
          Gear Up. <br /> Go Wild.
        </h1>
        
        {/* Deskripsi Singkat */}
        <p className="text-lg text-earth-300/80 mb-10 max-w-xl mx-auto">
          Temukan peralatan adventure terbaik — tenda ultralight, sleeping bag, pisau survival, dan gear outdoor pilihan untuk setiap petualanganmu.
        </p>

        {/* Tombol CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-accent text-earth-900 rounded-2xl font-semibold flex items-center gap-2 transition-all hover:bg-accent-light shadow-lg shadow-accent/20"
          >
            Jelajahi Gear <ArrowRight size={20} />
          </motion.button>
          
          <button className="px-8 py-4 glass rounded-2xl font-semibold hover:bg-primary/10 transition-all text-earth-200">
            Lihat Katalog
          </button>
        </div>
      </motion.div>

      {/* Section Produk — Grid Bertema Outdoor */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          { name: "Tenda Ultralight 2P", price: "Rp 450k", tag: "Best Seller", icon: Tent },
          { name: "Pisau Multifungsi", price: "Rp 150k", tag: "Essential", icon: Compass },
          { name: "Kompor Portable", price: "Rp 250k", tag: "New", icon: Flame },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-6 glass rounded-3xl text-left group cursor-pointer"
          >
            {/* Ikon Produk */}
            <div className="w-12 h-12 rounded-2xl bg-primary/20 mb-4 flex items-center justify-center text-earth-400 group-hover:bg-accent group-hover:text-earth-900 transition-all">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1 text-earth-100">{item.name}</h3>
            <p className="text-earth-400/70 text-sm mb-4">Gear terkurasi, siap tempur di segala medan.</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-accent">{item.price}</span>
              <span className="text-[10px] px-2 py-1 glass rounded-md uppercase tracking-widest text-earth-300">{item.tag}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Section Kenapa TrailForge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-32 w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-earth-100 mb-12 text-center">
          Kenapa <span className="text-accent">TrailForge</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: "Kurasi Ketat",
              desc: "Setiap produk diseleksi berdasarkan durabilitas, bobot, dan value-for-money.",
            },
            {
              icon: Flashlight,
              title: "Panduan Outdoor",
              desc: "Tips survival dan panduan penggunaan di setiap produk — bukan sekadar jualan.",
            },
            {
              icon: Wind,
              title: "Komunitas Nyata",
              desc: "Review dan rating dari petualang sungguhan yang sudah pakai di lapangan.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 mx-auto mb-4 flex items-center justify-center text-earth-400">
                <feature.icon size={28} />
              </div>
              <h3 className="font-bold text-lg text-earth-100 mb-2">{feature.title}</h3>
              <p className="text-earth-400/70 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </main>
  );
}
