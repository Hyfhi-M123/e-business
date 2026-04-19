export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-mesh">
      <div className="w-full max-w-md glass p-10 rounded-3xl text-center">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Masuk / Daftar</h2>
        <p className="text-foreground/70 mb-8">Siapkan dirimu untuk perjalanan baru</p>
        
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" className="w-full border border-earth-dark/20 bg-black/20 text-foreground rounded-xl p-3 focus:outline-none focus:border-accent transition-colors" placeholder="nama@email.com"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" className="w-full border border-earth-dark/20 bg-black/20 text-foreground rounded-xl p-3 focus:outline-none focus:border-accent transition-colors" placeholder="••••••••"/>
          </div>
          
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 mt-4">
            Mulai Petualangan
          </button>
        </form>
      </div>
    </main>
  );
}
