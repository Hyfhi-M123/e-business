"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGuide } from "../context/GuideContext";

export default function GuideOverlay() {
  const { isGuiding, currentStep, stopGuide } = useGuide();
  const [highlightRects, setHighlightRects] = useState<{ selector: string; rect: DOMRect; tooltip: string }[]>([]);

  const computeRects = useCallback(() => {
    if (!currentStep || !isGuiding) {
      setHighlightRects([]);
      return;
    }

    // Wait for page to render
    setTimeout(() => {
      const rects: typeof highlightRects = [];
      for (const selector of currentStep.highlights) {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          const tooltip = currentStep.tooltips[selector] || "";
          rects.push({ selector, rect, tooltip });

          // Scroll first element into view
          if (rects.length === 1) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
      setHighlightRects(rects);
    }, 800);
  }, [currentStep, isGuiding]);

  useEffect(() => {
    computeRects();
    window.addEventListener("resize", computeRects);
    window.addEventListener("scroll", computeRects);
    return () => {
      window.removeEventListener("resize", computeRects);
      window.removeEventListener("scroll", computeRects);
    };
  }, [computeRects]);

  if (!isGuiding || highlightRects.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] pointer-events-none"
      >
        {/* Dim overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={stopGuide} />

        {/* Highlight boxes */}
        {highlightRects.map((item, i) => (
          <div key={item.selector}>
            {/* Cutout / highlight border */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none"
              style={{
                top: item.rect.top + window.scrollY - 6,
                left: item.rect.left - 6,
                width: item.rect.width + 12,
                height: item.rect.height + 12,
                boxShadow: "0 0 0 4000px rgba(0,0,0,0.5)",
                border: "3px solid #F77F00",
                borderRadius: "16px",
                zIndex: 9999,
                animation: "pulse-border 2s infinite",
              }}
            />

            {/* Tooltip bubble */}
            {item.tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="absolute pointer-events-auto z-[10000]"
                style={{
                  top: item.rect.top + window.scrollY - 56,
                  left: item.rect.left,
                  maxWidth: 280,
                }}
              >
                <div className="bg-[#F77F00] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/30 relative">
                  {item.tooltip}
                  {/* Arrow */}
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[#F77F00] rotate-45 rounded-sm" />
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={stopGuide}
          className="fixed top-6 right-6 z-[10001] pointer-events-auto w-12 h-12 bg-[#F77F00] text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 hover:bg-orange-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Info badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10001] pointer-events-auto"
        >
          <div className="bg-[#212529] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-[#F77F00] rounded-full animate-pulse" />
            Trail Guide sedang memandu Anda
            <button onClick={stopGuide} className="ml-2 text-[#F77F00] hover:underline text-xs font-black uppercase tracking-widest">Selesai</button>
          </div>
        </motion.div>
      </motion.div>

      {/* Inject pulse animation */}
      <style jsx global>{`
        @keyframes pulse-border {
          0%, 100% { border-color: #F77F00; box-shadow: 0 0 0 4000px rgba(0,0,0,0.5), 0 0 20px rgba(247,127,0,0.3); }
          50% { border-color: #ffaa44; box-shadow: 0 0 0 4000px rgba(0,0,0,0.5), 0 0 40px rgba(247,127,0,0.6); }
        }
      `}</style>
    </AnimatePresence>
  );
}
