"use client";

import { useState, useRef, useEffect } from "react";
import { Compass, MountainSnow, ArrowRight, User } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ChatRoomPage() {
  const [messages, setMessages] = useState([
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

  // Set timestamp setelah mount untuk menghindari hydration mismatch
  useEffect(() => {
    setMessages(prev => {
      const newMsgs = [...prev];
      if (!newMsgs[0].timestamp) {
        newMsgs[0].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return newMsgs;
    });
  }, []);

  // Auto scroll ke bawah dengan scrollTop, BUKAN scrollIntoView
  // Ini menghindari bug browser yang menggeser seluruh body/layout halaman
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Pesanan diterima (dummy response).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
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
              <div className="flex shrink-0">
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
                        {msg.text}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-[#212529]/50 dark:text-white/50 mt-1.5 ${msg.sender === 'user' ? 'mr-12' : 'ml-12'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-end gap-3 max-w-[75%]">
                    <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-[#F77F00] to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Compass className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 flex items-center gap-2 shadow-sm" style={{ borderRadius: "20px 20px 20px 4px" }}>
                      <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
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
              </div>

            </div>
          </div>
        </div>
        
      </main>
    </>
  );
}
