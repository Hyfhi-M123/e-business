export default function KatalogPage() {
  return (
    <main className="min-h-screen p-8 pt-24 bg-mesh">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-earth-slate mb-6 text-foreground">Katalog Gear</h1>
        <p className="text-foreground/80 mb-8">Eksplorasi gear terbaik untuk petualanganmu selanjutnya.</p>
        
        {/* Placeholder untuk Grid Produk */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((item) => (
             <div key={item} className="glass p-6 rounded-2xl h-64 flex items-end justify-start hover:scale-[1.02] transition-transform duration-300">
               <div>
                  <div className="w-full h-32 bg-earth-dark/40 rounded-xl mb-4"></div>
                  <h3 className="font-semibold text-lg text-primary-foreground text-foreground">Gear Item {item}</h3>
                  <p className="text-accent">Rp 00.000</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
