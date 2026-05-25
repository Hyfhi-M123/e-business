"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Compass, Loader2, Navigation, ShoppingBag, Sparkles } from "lucide-react";
import { useGuide } from "../context/GuideContext";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  action?: string | null;
  guide?: any;
  products?: string[];
  productDetails?: any[];
  offer_guide?: boolean;
  isLoading?: boolean;
  dismissed?: boolean;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya **Trail Guide AI** 🧭\nSedang mencari gear, butuh bantuan navigasi, atau ada pertanyaan? Tanya aja!",
      timestamp: "00:00",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startGuide, setAiProductIds } = useGuide();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setIsMounted(true);
    setMessages((prev) => [
      { ...prev[0], timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isMounted) {
    return <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#F77F00] to-orange-600 rounded-full z-50 shadow-2xl" />;
  }

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: inputValue, timestamp: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Add loading bubble
    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, sender: "ai", text: "", timestamp: now(), isLoading: true }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.filter((m) => !m.isLoading).slice(-8),
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
      };

      setMessages((prev) => prev.map((m) => (m.id === loadingId ? aiMsg : m)));
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, text: "Koneksi ke server terputus. Coba lagi ya!", isLoading: false }
            : m
        )
      );
    }
    setIsTyping(false);
  };

  const handleGuide = (msg: Message) => {
    if (msg.action === "guide" && msg.guide) {
      startGuide(msg.guide);
      setIsOpen(false);
    } else if (msg.action === "products" && msg.products?.length) {
      setAiProductIds(msg.products);
      router.push("/katalog?ai=recommended");
      setIsOpen(false);
    }
  };

  const renderMessageText = (text: string) => {
    // Simple markdown-like: **bold**
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-black">{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#F77F00] to-orange-600 text-white flex items-center justify-center z-50 shadow-2xl shadow-orange-500/30 rounded-full group"
          >
            <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#111] border border-white/10 rounded-[2rem] z-50 flex flex-col overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/5 bg-gradient-to-r from-[#F77F00]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77F00] to-orange-600 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight">Trail Guide AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Groq LLM • Online</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${msg.sender === "user" ? "order-2" : ""}`}>
                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#F77F00] text-white rounded-br-md"
                          : "bg-white/5 text-neutral-200 border border-white/5 rounded-bl-md"
                      }`}
                    >
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="w-4 h-4 animate-spin text-[#F77F00]" />
                          <span className="text-xs text-neutral-500 font-mono">Menganalisis...</span>
                        </div>
                      ) : (
                        renderMessageText(msg.text)
                      )}
                    </div>

                    {/* Product Cards */}
                    {msg.productDetails && msg.productDetails.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.productDetails.map((p: any) => (
                          <div
                            key={p.id}
                            onClick={() => router.push(`/produk/${p.id}`)}
                            className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:border-[#F77F00]/30 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{p.name}</p>
                              <p className="text-[11px] font-bold text-[#F77F00]">Rp {p.price?.toLocaleString("id-ID")}</p>
                            </div>
                            <ShoppingBag className="w-4 h-4 text-neutral-600 group-hover:text-[#F77F00] transition-colors shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Guide Offer Buttons */}
                    {msg.offer_guide && msg.action && !msg.dismissed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 flex gap-2"
                      >
                        <button
                          onClick={() => handleGuide(msg)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F77F00] rounded-xl text-white text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all group"
                        >
                          <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin" />
                          {msg.action === "products" ? "Ya, Pandu!" : "Ya, Pandu!"}
                        </button>
                        <button
                          onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, dismissed: true } : m))}
                          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-neutral-400 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                        >
                          Tidak, Terima Kasih
                        </button>
                      </motion.div>
                    )}

                    {/* Timestamp */}
                    <p className={`text-[10px] font-mono mt-1.5 ${msg.sender === "user" ? "text-right text-neutral-500" : "text-neutral-600"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#F77F00]/50 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanya apa saja..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-[#F77F00] text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-30 disabled:hover:bg-[#F77F00] shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-neutral-600 text-center mt-2 font-mono">Powered by Groq LLM • llama-3.3-70b</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
