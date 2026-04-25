"use client";

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Compass } from 'lucide-react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fungsi ini membypass siklus render React dan memperbarui posisi elemen secara langsung di DOM (Kecepatan Maximum)
    const mouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Offset disesuaikan agar ujung panah (tip) jatuh pas di posisi klik mouse
        const offsetX = isHovering ? 16 : 8; 
        const offsetY = isHovering ? 16 : 8;
        cursorRef.current.style.transform = `translate3d(${e.clientX - offsetX}px, ${e.clientY - offsetY}px, 0)`;
      }
      
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [role="button"]')) {
        if (!isHovering) setIsHovering(true);
      } else {
        if (isHovering) setIsHovering(false);
      }
    };

    const mouseEnter = () => setIsVisible(true);
    const mouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', mouseMove, { passive: true });
    document.body.addEventListener('mouseenter', mouseEnter);
    document.body.addEventListener('mouseleave', mouseLeave);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.body.removeEventListener('mouseenter', mouseEnter);
      document.body.removeEventListener('mouseleave', mouseLeave);
    };
  }, [isHovering]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}} />
      <div 
        ref={cursorRef}
        className="hidden md:flex pointer-events-none fixed top-0 left-0 z-[100000] items-center justify-center"
        style={{ opacity: isVisible ? 1 : 0, willChange: 'transform' }}
      >
        {isHovering ? (
          // Saat Hover: Kompas menyala dan berputar lambat
          <motion.div 
            initial={{ scale: 0.5, rotate: 0 }}
            animate={{ rotate: 360, scale: 1.2 }} 
            transition={{ rotate: { repeat: Infinity, duration: 4, ease: "linear" }, scale: { duration: 0.2 } }}
          >
            <Compass className="w-8 h-8 text-orange-400" />
          </motion.div>
        ) : (
          // Mouse Biasa: Anak Panah Kompas (Navigation) miring ke KIRI ATAS (-45 derajat) menyerupai pointer biasa
          <motion.div 
            initial={{ rotate: -45 }} 
            animate={{ rotate: -45, scale: 1 }}
          >
            <Navigation className="w-6 h-6 text-white fill-orange-500" />
          </motion.div>
        )}
      </div>
    </>
  );
}
