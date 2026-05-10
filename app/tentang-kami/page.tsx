"use client";

import { motion } from "framer-motion";
import { Mountain, MapPin, Mail, Wind, Droplets, Weight, Leaf, MessageCircle, ChevronRight, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stats = [
  { value: "2026", label: "Tahun Berdiri" },
  { value: "100%", label: "Produk Lokal Indonesia" },
  { value: "3", label: "Pendiri Berdedikasi" },
  { value: "24/7", label: "Siap Melayani" },
];

const team = [
  { name: "Nabilla Chairunisa", nim: "2315061022" },
  { name: "Makka Muhammad Mustova", nim: "2315061100" },
  { name: "Luthfi Muthathohirin", nim: "2315061112" },
];

const testimonials = [
  {
    name: "Arief S.",
    location: "Surabaya",
    mountain: "Gunung Prau",
    quote: "Kualitasnya melebihi ekspektasi untuk brand lokal. Jaketnya nyaman dipakai seharian di jalur pendakian.",
    rating: 5,
  },
  {
    name: "Fitri N.",
    location: "Bandung",
    mountain: "Gunung Papandayan",
    quote: "Ringan tapi terasa kokoh. Senang akhirnya ada pilihan gear lokal yang serius soal kualitas.",
    rating: 5,
  },
  {
    name: "Dimas P.",
    location: "Jakarta",
    mountain: "Gunung Gede",
    quote: "Material breathable-nya terasa bedanya, tidak gerah meski dipakai seharian mendaki.",
    rating: 5,
  },
];

const conservationStats = [
  { value: "2%", label: "Setiap Pembelian untuk Alam" },
  { value: "Lokal", label: "Material Ramah Lingkungan" },
  { value: "0", label: "Bahan Kimia Berbahaya" },
  { value: "100%", label: "Komitmen Jaga Alam" },
];

const gearFeatures = [
  {
    icon: Droplets,
    title: "Tahan Air",
    desc: "Material water-resistant berkualitas tinggi. Tetap kering saat hujan tiba-tiba di jalur pendakian manapun.",
  },
  {
    icon: Wind,
    title: "Sirkulasi Udara",
    desc: "Desain breathable yang membuang panas tubuh secara optimal. Cocok untuk iklim tropis Indonesia yang lembab.",
  },
  {
    icon: Weight,
    title: "Ringan & Kuat",
    desc: "Material ripstop ringan namun tahan lama. Tidak menambah beban berlebih di punggungmu selama pendakian.",
  },
];

export default function TentangKamiPage() {
  const handleSubmit = () => {
    alert("Pesan terkirim! Kami akan menghubungi Anda segera.");
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-[#212529] dark:text-white font-sans selection:bg-[#F77F00] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(247,127,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(247,127,0,0.3)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(247,127,0,0.15),transparent_60%)]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 bg-[#F77F00]/10 text-[#F77F00] border border-[#F77F00]/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6">
              <Mountain className="w-3 h-3" /> Brand Lokal Perlengkapan Pendakian
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Dibuat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F77F00] to-orange-400">Untuk</span> <br />
              Pendaki Kita.
            </h1>
            <p className="text-sm md:text-base font-mono text-[#6C757D] dark:text-neutral-400 max-w-xl leading-relaxed">
              TrailForge hadir sebagai solusi bagi pendaki Indonesia yang membutuhkan perlengkapan berkualitas dengan harga yang terjangkau. Kami percaya setiap pendaki berhak mendapatkan gear terbaik tanpa harus merogoh kocek terlalu dalam.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="w-full aspect-square relative bg-[#050505] border border-white/10 overflow-hidden flex items-end justify-center rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pb-8">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-20">
                <ellipse cx="200" cy="320" rx="180" ry="40" fill="none" stroke="#F77F00" strokeWidth="1" />
                <ellipse cx="200" cy="300" rx="150" ry="35" fill="none" stroke="#F77F00" strokeWidth="1" />
                <ellipse cx="200" cy="275" rx="120" ry="30" fill="none" stroke="#F77F00" strokeWidth="1" />
                <ellipse cx="200" cy="245" rx="90" ry="25" fill="none" stroke="#F77F00" strokeWidth="1" />
                <ellipse cx="200" cy="215" rx="65" ry="20" fill="none" stroke="#F77F00" strokeWidth="1" />
                <ellipse cx="200" cy="185" rx="45" ry="16" fill="none" stroke="#F77F00" strokeWidth="1.5" />
                <ellipse cx="200" cy="160" rx="28" ry="12" fill="none" stroke="#F77F00" strokeWidth="1.5" />
                <ellipse cx="200" cy="140" rx="14" ry="8" fill="none" stroke="#F77F00" strokeWidth="2" />
              </svg>

              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full">
                <polygon points="200,30 50,300 350,300" fill="#F77F00" opacity="0.15" />
                <polygon points="200,30 50,300 350,300" fill="none" stroke="#F77F00" strokeWidth="1.5" opacity="0.6" />
                <polygon points="150,120 80,300 230,300" fill="#F77F00" opacity="0.08" />
                <polygon points="280,100 210,300 370,300" fill="#F77F00" opacity="0.06" />
              </svg>

              <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
                <div className="w-3 h-3 bg-[#F77F00] rounded-full animate-ping opacity-70"></div>
                <div className="w-3 h-3 bg-[#F77F00] rounded-full absolute top-0"></div>
              </div>

              <div className="absolute bottom-[30%] left-[35%] w-1.5 h-1.5 bg-[#F77F00] rounded-full opacity-60"></div>
              <div className="absolute bottom-[42%] left-[40%] w-1.5 h-1.5 bg-[#F77F00] rounded-full opacity-60"></div>
              <div className="absolute bottom-[54%] left-[44%] w-1.5 h-1.5 bg-[#F77F00] rounded-full opacity-60"></div>
              <div className="absolute bottom-[66%] left-[47%] w-1.5 h-1.5 bg-[#F77F00] rounded-full opacity-60"></div>

              <div className="relative z-10 text-center">
                <span className="font-mono text-[10px] text-[#F77F00]/60 uppercase tracking-widest">Untuk Semua</span>
                <p className="font-black text-white text-sm uppercase tracking-wider">Gunung · Hutan · Alam Indonesia</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 md:px-12 lg:px-24 border-b border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-black text-[#F77F00]">{stat.value}</p>
              <p className="text-xs font-mono text-[#6C757D] dark:text-neutral-400 uppercase tracking-widest mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Misi & Visi */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Misi & Visi</h2>
            <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-[#121212] border-2 border-black/10 dark:border-white/10 p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F77F00]/5 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <Mountain className="w-10 h-10 text-[#F77F00] mb-6 relative z-10" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Misi</h3>
              <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 leading-relaxed relative z-10">
                Menyediakan perlengkapan pendakian berkualitas tinggi yang dirancang khusus untuk kondisi alam Indonesia — iklim tropis yang lembab, medan yang beragam, dan cuaca yang tak menentu. Kami ingin memastikan setiap pendaki, dari pemula hingga berpengalaman, bisa mendapatkan gear yang layak.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#212529] text-white dark:bg-white dark:text-black border-2 border-transparent p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 dark:bg-black/5 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <ChevronRight className="w-10 h-10 text-[#F77F00] mb-6 relative z-10" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4 relative z-10">Visi</h3>
              <p className="text-sm font-mono text-neutral-400 dark:text-[#6C757D] leading-relaxed relative z-10">
                Menjadi platform belanja perlengkapan pendakian terpercaya di Indonesia. Kami ingin membangun komunitas pendaki yang solid, di mana setiap orang bisa berbagi pengalaman dan mendapatkan gear yang tepat untuk petualangan mereka.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Keunggulan Produk */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-[#F77F00] font-mono text-xs tracking-widest uppercase">Dirancang untuk Iklim Tropis</span>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Kenapa Pilih Kami?</h2>
            <p className="text-sm font-mono text-neutral-400 mt-4 max-w-xl mx-auto">
              Produk kami dipilih dengan cermat dan disesuaikan untuk kebutuhan pendaki di iklim tropis Indonesia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gearFeatures.map((feature, i) => (
              <div key={i} className="border border-white/10 p-8 flex flex-col items-center text-center hover:border-[#F77F00] transition-colors">
                <feature.icon className="w-12 h-12 text-[#F77F00] mb-6" />
                <h4 className="text-xl font-black uppercase tracking-widest mb-3">{feature.title}</h4>
                <p className="text-xs font-mono text-neutral-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-20 px-6 md:px-12 lg:px-24 border-b border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Tim Kami</h2>
            <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
          </div>
          <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 mb-12">
            Kami adalah tim kecil yang bersemangat membangun platform perlengkapan pendakian terbaik untuk Indonesia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-8"
              >
                <div className="w-16 h-16 bg-[#F77F00]/10 border border-[#F77F00]/30 flex items-center justify-center mb-6">
                  <span className="font-black text-[#F77F00] text-xl">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <h4 className="font-black text-base uppercase tracking-widest leading-snug">{member.name}</h4>
                <p className="text-xs font-mono text-[#6C757D] dark:text-neutral-400 mt-2">{member.nim}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Komitmen Lingkungan */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#F77F00]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Leaf className="w-12 h-12 text-white mb-6" />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
              Jaga Gunungnya, <br />Bukan Cuma Daki.
            </h2>
            <p className="text-sm font-mono text-white/80 leading-relaxed max-w-lg">
              TrailForge berkomitmen mendukung kelestarian alam Indonesia. Sebagian dari setiap transaksi akan kami alokasikan untuk mendukung komunitas dan kegiatan pelestarian jalur pendakian di seluruh Indonesia.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {conservationStats.map((item, i) => (
              <div key={i} className="bg-white/10 border border-white/20 p-6">
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Kata Mereka</h2>
            <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-8"
              >
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#F77F00] text-[#F77F00]" />
                  ))}
                </div>
                <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 leading-relaxed mb-6">
                  &quot;{t.quote}&quot;
                </p>
                <div className="border-t border-black/10 dark:border-white/10 pt-4">
                  <p className="font-black text-sm">{t.name}</p>
                  <p className="text-[10px] font-mono text-[#6C757D] dark:text-neutral-400">{t.location}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Mountain className="w-3 h-3 text-[#F77F00]" />
                    <span className="text-[10px] font-mono text-[#F77F00]">{t.mountain}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#f8f9fa] dark:bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-10 md:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 justify-between">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Hubungi Kami</h2>
              <p className="text-sm font-mono text-[#6C757D] dark:text-neutral-400 mb-8">
                Ada pertanyaan soal produk, ukuran, atau mau jadi reseller? Tim kami siap membantu — biasanya kami balas dalam 1x24 jam.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F77F00] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#6C757D]">Kantor</span>
                    <span className="block font-mono text-sm"> Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1, Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#212529] text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#6C757D]">Email</span>
                    <span className="block font-mono text-sm">hello@trailforge.id</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#6C757D]">WhatsApp</span>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="block font-mono text-sm text-[#25D366] hover:underline">+62 812-3456-7890</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#f8f9fa] dark:bg-[#1a1a1a] p-8 border border-black/10 dark:border-white/10">
              <h3 className="font-black uppercase tracking-widest mb-6">Kirim Pesan</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Nama Lengkap" className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors" />
                <input type="email" placeholder="Alamat Email" className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors" />
                <select className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors text-[#6C757D]">
                  <option value="">Topik Pesan</option>
                  <option value="produk">Pertanyaan Produk</option>
                  <option value="ukuran">Panduan Ukuran</option>
                  <option value="reseller">Jadi Reseller</option>
                  <option value="kerjasama">Kerjasama Komunitas</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <textarea placeholder="Tulis pesanmu di sini..." rows={4} className="w-full bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-3 font-mono text-sm focus:border-[#F77F00] outline-none transition-colors resize-none" />
                <button onClick={handleSubmit} type="button" className="w-full bg-[#F77F00] text-white font-black uppercase tracking-widest text-xs py-4 hover:bg-[#e06f00] transition-colors">
                  Kirim Pesan
                </button>
                <p className="text-center text-[10px] font-mono text-[#6C757D]">
                  Atau langsung chat via{" "}
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">WhatsApp</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}