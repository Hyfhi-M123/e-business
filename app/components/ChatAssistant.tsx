"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Compass, MountainSnow } from "lucide-react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya Trail Guide AI. Sedang mencari gear spesifik atau butuh saran ekspedisi?",
      timestamp: "00:00"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setIsMounted(true);
    setMessages(prev => [{...prev[0], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Render placeholder with same dimensions to prevent layout shift on mount
  if (!isMounted) {
    return (
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#F77F00] to-orange-600 rounded-full z-50 shadow-2xl" />
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Pesanan diterima. Karena ini adalah purwarupa, integrasi AI asli sedang dikembangkan. Silakan lanjut telusuri perlengkapan di katalog kami!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#F77F00] to-orange-600 text-white flex items-center justify-center hover:shadow-orange-500/50 transition-all hover:scale-110 z-50 shadow-2xl rounded-full group"
          >
            <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-8 w-[350px] sm:w-[400px] h-[550px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden rounded-3xl"
          >
            {/* Header */}
            <div className="bg-white/50 dark:bg-black/20 p-5 flex items-center justify-between border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F77F00] to-orange-600 flex items-center justify-center text-white rounded-full shadow-md">
                  <MountainSnow className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[#212529] dark:text-white text-sm font-black uppercase tracking-widest leading-tight drop-shadow-sm">Trail Guide AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-[#6C757D] dark:text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-[#212529] dark:text-white hover:bg-[#F77F00] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 bg-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'ai' ? (
                      <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-[#F77F00] to-orange-600 flex items-center justify-center rounded-full shadow-sm">
                        <Compass className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0 bg-white dark:bg-neutral-800 flex items-center justify-center rounded-full shadow-sm border border-black/5 dark:border-white/5">
                        <User className="w-5 h-5 text-[#212529] dark:text-white" />
                      </div>
                    )}
                    
                    <div 
                      className={`p-4 text-sm font-medium shadow-sm ${
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
                  <span className={`text-[9px] font-bold uppercase tracking-widest text-[#6C757D] dark:text-neutral-500 mt-2 ${msg.sender === 'user' ? 'mr-12' : 'ml-12'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/50 dark:bg-black/20 border-t border-black/5 dark:border-white/5 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 px-5 py-3 text-sm font-medium text-[#212529] dark:text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#F77F00] transition-colors rounded-full shadow-inner"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-[#F77F00] text-white rounded-full flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-[#F77F00] transition-colors flex-shrink-0 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
