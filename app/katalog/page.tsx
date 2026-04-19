'use client';
import { motion } from 'framer-motion';

export default function KatalogPage() {
  return (
    <main className="min-h-screen p-8 pt-24 bg-mesh">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-earth-slate mb-6 text-foreground">Katalog Gear</h1>
        <p className="text-foreground/80 mb-8">Eksplorasi gear terbaik untuk petualanganmu selanjutnya.</p>
        
        {/* Placeholder untuk Grid Produk dengan Framer Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((item, index) => (
             <motion.div 
               key={item} 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               whileHover={{ scale: 1.02 }}
               className="glass p-6 rounded-2xl h-64 flex items-end justify-start cursor-pointer transition-colors duration-300 hover:border-accent/50"
             >
               <div className="w-full">
                  <div className="w-full h-32 bg-earth-dark/60 rounded-xl mb-4"></div>
                  <h3 className="font-semibold text-lg text-foreground">Gear Item {item}</h3>
                  <p className="text-accent font-medium">Rp 00.000</p>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
