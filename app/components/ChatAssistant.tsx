"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Compass, MountainSnow } from "lucide-react";

export default function ChatAssistant() {
  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/6281234567890', '_blank');
  };

  return (
    <>
      <button
        onClick={handleWhatsAppRedirect}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white flex items-center justify-center hover:shadow-[#25D366]/50 transition-all hover:scale-110 z-50 shadow-2xl rounded-full group"
        title="Chat via WhatsApp"
      >
        <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
      </button>
    </>
  );
}
