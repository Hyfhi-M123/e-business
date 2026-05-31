"use client";

import React, { useState, useRef, useEffect, Fragment } from "react";
import { Compass, MountainSnow, ArrowRight, User, ShoppingBag, Sparkles, Loader2, Trophy, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useGuide } from "../context/GuideContext";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  action?: string | null;
  guide?: any;
  products?: string[];
  productDetails?: any[];
  offer_guide?: boolean;
  isLoading?: boolean;
  dismissed?: boolean;
  comparison?: any;
  revealedText?: string;
  isRevealing?: boolean;
}

export default function ChatRoomPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Halo, Petualang! Saya Trail Guide AI. Sedang mencari tenda ultralight, sepatu GORE-TEX, atau butuh saran perlengkapan untuk ekspedisi berikutnya?",
      timestamp: ""
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { startGuide, setAiProductIds } = useGuide();
  const { user } = useAuth();
  const router = useRouter();

  // Set greeting based on user login status
  useEffect(() => {
    const greeting = user?.user_metadata?.full_name
      ? `Halo, ${user.user_metadata.full_name}! 👋 Saya Trail Guide AI. Ada yang bisa saya bantu hari ini?`
      : "Halo, Petualang! Saya Trail Guide AI. Sedang mencari tenda ultralight, sepatu GORE-TEX, atau butuh saran perlengkapan untuk ekspedisi berikutnya?";
    setMessages([{
      id: 1,
      sender: "ai",
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [user]);

  // Auto scroll ke bawah dengan scrollTop, BUKAN scrollIntoView
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const newUserMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: now()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsProcessing(true);

    // Add loading bubble
    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, sender: "ai", text: "", timestamp: now(), isLoading: true }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newUserMsg.text,
          history: messages.filter(m => !m.isLoading).slice(-8),
          userEmail: user?.email || null,
          userName: user?.user_metadata?.full_name || null,
          currentPage: "/chat",
        }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: loadingId,
        sender: "ai",
        text: data.reply || "Hmm, saya tidak bisa menjawab itu sekarang.",
        timestamp: now(),
        action: data.action,
        guide: data.guide,
        products: data.products,
        productDetails: data.productDetails,
        offer_guide: data.offer_guide,
        comparison: data.comparison,
        revealedText: "",
        isRevealing: true,
      };
      setMessages(prev => prev.map(m => (m.id === loadingId ? aiMsg : m)));

      // Streaming reveal effect — word by word
      const words = (data.reply || "").split(" ");
      let revealed = "";
      for (let i = 0; i < words.length; i++) {
        revealed += (i > 0 ? " " : "") + words[i];
        const snap = revealed;
        await new Promise(r => setTimeout(r, 30));
        setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, revealedText: snap } : m));
      }
      setMessages(prev => prev.map(m => m.id === loadingId ? { ...m, isRevealing: false, revealedText: undefined } : m));
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId ? { ...m, text: "Koneksi ke server terputus. Coba lagi ya!", isLoading: false } : m
        )
      );
    }
    setIsProcessing(false);
  };

  const handleGuide = (msg: Message) => {
    if (msg.action === "compare" && msg.products?.length) {
      setAiProductIds(msg.products);
      router.push("/katalog?ai=recommended");
    } else if (msg.action === "guide" && msg.guide) {
      startGuide(msg.guide);
    } else if (msg.action === "products" && msg.products?.length) {
      setAiProductIds(msg.products);
      router.push("/katalog?ai=recommended");
    }
  };

  return (
    <>
      <Navbar />

      <main className="fixed inset-0 overflow-hidden font-sans">
        
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80')",
              transform: 'scale(1.05)'
            }}
          />
          <div className="absolute inset-0 bg-white/60 dark:bg-[#050505]/80 backdrop-blur-[2px] transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0a0a0a] dark:via-transparent dark:to-transparent" />
        </div>

        {/* CONTENT AREA */}
        <div className="absolute left-0 right-0 bottom-0 z-10 flex flex-col top-[72px] lg:top-[106px]">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col h-full">
            
            {/* HEADER */}
            <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-black/10 dark:border-white/10 py-4">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#212529] dark:text-white shadow-lg border border-white/20">
                  <Compass className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none text-[#212529] dark:text-white drop-shadow-sm">Trail Guide AI</h1>
                  <p className="text-xs md:text-sm font-bold text-[#212529]/70 dark:text-white/70 uppercase tracking-widest mt-1">Personal Gear Assistant</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#212529] dark:text-white">Groq LLM • Online</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                  <MountainSnow className="w-4 h-4 text-[#F77F00]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#212529] dark:text-white">Expert Advice</span>
                </div>
              </div>
            </div>

            {/* CHAT CONTAINER */}
            <div className="flex-1 min-h-0 flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 border-b-0 rounded-t-2xl shadow-2xl overflow-hidden mt-4">
              
              {/* Tempat area pesan */}
              <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scroll-smooth">
                
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-end gap-3 max-w-[90%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.sender === 'ai' ? (
                        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-[#F77F00] to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                          <Compass className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 flex-shrink-0 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg border border-black/5 dark:border-white/5">
                          <User className="w-5 h-5 text-[#212529] dark:text-white" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <div 
                          className={`p-4 text-sm md:text-base font-medium leading-relaxed shadow-sm ${
                            msg.sender === 'user' 
                              ? 'bg-[#212529] text-white' 
                              : 'bg-white dark:bg-[#1a1a1a] text-[#212529] dark:text-white border border-black/5 dark:border-white/5'
                          }`}
                          style={{
                            borderRadius: msg.sender === 'user' ? "20px 20px 4px 20px" : "20px 20px 20px 4px"
                          }}
                        >
                          {msg.isLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-[#F77F00]" />
                              <span className="text-sm text-neutral-500">Menganalisis...</span>
                            </div>
                          ) : (
                            msg.isRevealing ? (msg.revealedText || "") : msg.text
                          )}
                        </div>

                        {/* Product Cards */}
                        {msg.productDetails && msg.productDetails.length > 0 && (
                          <div className="space-y-2">
                            {msg.productDetails.map((p: any) => (
                              <div
                                key={p.id}
                                onClick={() => router.push(`/produk/${p.id}`)}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl cursor-pointer hover:border-[#F77F00]/30 transition-colors group shadow-sm"
                              >
                                <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-[#212529] dark:text-white truncate">{p.name}</p>
                                  <p className="text-xs font-bold text-[#F77F00]">Rp {p.price?.toLocaleString("id-ID")}</p>
                                </div>
                                <ShoppingBag className="w-4 h-4 text-neutral-400 group-hover:text-[#F77F00] transition-colors shrink-0" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comparison Cards — Premium Side by Side */}
                        {msg.comparison && msg.comparison.products?.length > 0 && (() => {
                          const prods = msg.comparison.products;
                          const isWinner = (name: string) => name === msg.comparison.winner;
                          const renderCard = (p: any, i: number, total: number) => {
                            const roundClass = total === 1 ? "rounded-xl" : (i === 0 ? "rounded-l-xl" : (i === total - 1 ? "rounded-r-xl" : ""));
                            return (
                            <div key={p.id || i} className={`flex-1 flex flex-col ${roundClass} border overflow-hidden ${isWinner(p.name) ? "border-[#F77F00]/40 shadow-[0_0_20px_rgba(247,127,0,0.12)]" : "border-black/10 dark:border-white/10"} bg-neutral-50 dark:bg-[#141414]`}>
                              {/* Product Image — full, no crop */}
                              <div className={`relative w-full h-28 ${isWinner(p.name) ? "bg-gradient-to-b from-[#F77F00]/10 to-transparent" : "bg-gradient-to-b from-black/[0.03] dark:from-white/5 to-transparent"}`}>
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 drop-shadow-lg" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No Image</div>
                                )}
                                {isWinner(p.name) && (
                                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 bg-[#F77F00] rounded-md shadow-md">
                                    <Trophy className="w-2.5 h-2.5 text-white" />
                                    <span className="text-[8px] font-black text-white uppercase">Best Pick</span>
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div className="p-3 flex-1 flex flex-col gap-1.5 border-t border-black/5 dark:border-white/5">
                                <span className="text-xs font-black text-[#212529] dark:text-white leading-tight line-clamp-2">{p.name}</span>
                                <span className="text-sm font-black text-[#F77F00]">Rp {p.price?.toLocaleString("id-ID")}</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-yellow-500">{'★'.repeat(Math.round(p.rating || 0))}</span>
                                  <span className="text-[10px] text-neutral-500">{p.rating}</span>
                                </div>
                                <div className="mt-1 space-y-1">
                                  {p.pros?.map((t: string, j: number) => (
                                    <div key={`p${j}`} className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" /><span className="text-[10px] text-[#212529] dark:text-neutral-300 leading-tight">{t}</span></div>
                                  ))}
                                  {p.cons?.map((t: string, j: number) => (
                                    <div key={`c${j}`} className="flex items-start gap-1.5"><XCircle className="w-3 h-3 text-red-400/70 shrink-0 mt-0.5" /><span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">{t}</span></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            );
                          };
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-[#F77F00] uppercase tracking-widest text-center">⚔️ Perbandingan Produk</p>
                              <div className="flex items-stretch gap-0 relative">
                                {prods.map((p: any, i: number) => (
                                  <Fragment key={p.id || i}>
                                    {renderCard(p, i, prods.length)}
                                    {i < prods.length - 1 && (
                                      <div className="absolute left-1/2 top-[5.5rem] -translate-x-1/2 z-20" style={{ left: `${((i + 1) / prods.length) * 100}%` }}>
                                        <div className="relative">
                                          <div className="absolute inset-0 rounded-full bg-[#F77F00]/30 animate-ping" />
                                          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#F77F00] to-orange-600 flex items-center justify-center shadow-xl border-2 border-white dark:border-[#0a0a0a]">
                                            <span className="text-[9px] font-black text-white">VS</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Fragment>
                                ))}
                              </div>
                              {msg.comparison.reason && (
                                <div className="px-3 py-2 bg-gradient-to-r from-[#F77F00]/10 to-orange-500/5 border border-[#F77F00]/20 rounded-lg">
                                  <p className="text-[10px] text-[#F77F00] font-bold text-center">🏆 {msg.comparison.reason}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Guide / Pandu Buttons */}
                        {msg.offer_guide && msg.action && !msg.dismissed && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleGuide(msg)}
                              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#F77F00] rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all group"
                            >
                              <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                              {msg.action === "compare" ? "Lihat Produknya!" : "Ya, Pandu!"}
                            </button>
                            <button
                              onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, dismissed: true } : m))}
                              className="flex-1 flex items-center justify-center py-3 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-neutral-500 text-xs font-bold uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                            >
                              Tidak, Terima Kasih
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-[#212529]/50 dark:text-white/50 mt-1.5 ${msg.sender === 'user' ? 'mr-12' : 'ml-12'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

              </div>

              {/* INPUT AREA */}
              <div className="shrink-0 px-4 py-3 md:px-6 md:py-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-lg border-t border-black/10 dark:border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tanyakan rekomendasi tenda, tas, dll..."
                    disabled={isProcessing}
                    className="flex-1 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-5 py-3 text-sm md:text-base font-medium text-[#212529] dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#F77F00] transition-colors disabled:opacity-50 rounded-full shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    className="h-[46px] md:h-[50px] w-14 md:w-36 shrink-0 bg-[#F77F00] text-white flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-[#F77F00] transition-all group font-black uppercase tracking-widest text-xs rounded-full shadow-lg"
                  >
                    <span className="hidden md:block">KIRIM</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
                <p className="text-[9px] text-neutral-500 text-center mt-2 font-mono">Powered by Groq LLM • llama-3.3-70b-versatile</p>
              </div>

            </div>
          </div>
        </div>
        
      </main>
    </>
  );
}
