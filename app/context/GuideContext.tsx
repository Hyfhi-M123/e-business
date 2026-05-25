"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface GuideStep {
  path: string;
  highlights: string[];
  tooltips: Record<string, string>;
}

interface GuideState {
  isGuiding: boolean;
  currentStep: GuideStep | null;
  startGuide: (step: GuideStep) => void;
  stopGuide: () => void;
  // Product filter for katalog
  aiProductIds: string[];
  setAiProductIds: (ids: string[]) => void;
  clearAiProducts: () => void;
}

const GuideContext = createContext<GuideState | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isGuiding, setIsGuiding] = useState(false);
  const [currentStep, setCurrentStep] = useState<GuideStep | null>(null);
  const [aiProductIds, setAiProductIds] = useState<string[]>([]);

  const startGuide = useCallback((step: GuideStep) => {
    setCurrentStep(step);
    setIsGuiding(true);
    if (step.path) {
      router.push(step.path);
    }
  }, [router]);

  const stopGuide = useCallback(() => {
    setIsGuiding(false);
    setCurrentStep(null);
  }, []);

  const clearAiProducts = useCallback(() => {
    setAiProductIds([]);
  }, []);

  return (
    <GuideContext.Provider value={{ isGuiding, currentStep, startGuide, stopGuide, aiProductIds, setAiProductIds, clearAiProducts }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error("useGuide must be used within GuideProvider");
  return ctx;
}
