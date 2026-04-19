"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame, Mountain, ArrowRight, X, Compass, Wind, Thermometer } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Stars() {
  const [mounted, setMounted] = useState(false);
  const stars = useRef<{ top: string; left: string; delay: string; opacity: number }[]>([]);

  useEffect(() => {
    stars.current = [...Array(60)].map(() => ({
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random()
    }));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {stars.current.map((star, i) => (
        <div key={i} className="absolute bg-white rounded-full animate-pulse opacity-20"
          style={{ 
            top: star.top, 
            left: star.left, 
            width: '1px', 
            height: '1px',
            animationDelay: star.delay
          }} 
        />
      ))}
    </>
  );
}

export default function ProCampScene() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".tent-structure", {
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power3.out"
      })
      .from(".tent-panel", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.05
      }, "-=1.2");

      gsap.to(".mtn-far", { scrollTrigger: { scrub: true }, y: 150 });
      gsap.to(".mtn-mid", { scrollTrigger: { scrub: true }, y: 80 });
      
      // THE MORPHING - Kita pakai opacity + scale aja kalau clip-path bandel
      gsap.to(".night-visuals", {
        scrollTrigger: {
          trigger: ".content-reveal",
          start: "top bottom",
          end: "top top",
          scrub: true
        },
        scale: 2,
        opacity: 0,
        pointerEvents: "none"
      });

    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[250vh] bg-white text-slate-900 font-sans selection:bg-emerald-500">
      
      {/* 🚀 CONTENT AREA - PUTIH DI BAWAH */}
      <section className="content-reveal min-h-screen relative z-10 px-6 bg-white overflow-hidden pt-[110vh]">
        <div className="max-w-7xl mx-auto py-20 text-center">
           <h2 className="text-[15vw] font-black uppercase tracking-tighter leading-none mb-20 text-slate-100 select-none absolute top-20 left-1/2 -translate-x-1/2 -z-10">Adventure</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-video bg-black rounded-[40px] p-10 flex flex-col justify-between text-white">
                 <h3 className="text-5xl font-black uppercase tracking-tighter">Premium Gear</h3>
                 <ArrowRight size={32} />
              </div>
              <div className="aspect-video bg-slate-100 rounded-[40px] p-10 flex flex-col justify-between">
                 <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900">Survival</h3>
                 <ArrowRight size={32} className="text-slate-400" />
              </div>
           </div>
        </div>
      </section>

      {/* 🌑 NIGHT VISUALS - DIPINDAH KE BAWAH DOM AGAR OVERRIDE */}
      <section 
        className="night-visuals fixed inset-0 z-[50] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#050b0c", opacity: 1 }}
      >
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0a1120]" />
           <Stars />
           <div className="mtn-far absolute bottom-0 left-[-10%] w-[120%] h-[60%] flex items-end opacity-20">
              <svg viewBox="0 0 1000 300" className="w-full fill-slate-900">
                 <path d="M0 300 L200 100 L400 250 L600 50 L1000 300 Z" />
              </svg>
           </div>
           <div className="mtn-mid absolute bottom-0 left-[-10%] w-[120%] h-[40%] flex items-end opacity-40">
              <svg viewBox="0 0 1000 300" className="w-full fill-[#051114]">
                 <path d="M0 300 L300 100 L700 280 L900 80 L1000 300 Z" />
              </svg>
           </div>
        </div>

        {/* Tenda */}
        <div 
          className="tent-structure relative z-20 w-full max-w-2xl px-10"
          style={{ transform: `translate(${(mousePos.x - 1000)/80}px, ${(mousePos.y - 500)/80}px)` }}
        >
          <svg viewBox="0 0 500 400" className="w-full drop-shadow-[0_0_80px_rgba(16,185,129,0.2)]">
             <ellipse cx="250" cy="360" rx="150" ry="20" fill="rgba(0,0,0,0.5)" />
             <g>
                <path d="M100 350 L250 80 L180 200 Z" fill="#064e40" />
                <path d="M180 200 L250 80 L320 200 Z" fill="#065f46" />
                <path d="M320 200 L250 80 L400 350 Z" fill="#064e40" />
                <path d="M220 350 L250 220 L280 350" fill="#f59e0b" />
             </g>
          </svg>
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full" />
        </div>

        <div className="absolute bottom-20 text-center">
            <h1 className="text-6xl font-black uppercase tracking-tighter italic text-white">FORGE NIGHT</h1>
        </div>
      </section>

      {/* Lab Close Button */}
      <div className="fixed top-8 left-8 z-[100]">
        <Link href="/">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-bold">
            CLOSE LAB
          </button>
        </Link>
      </div>

    </div>
  );
}
