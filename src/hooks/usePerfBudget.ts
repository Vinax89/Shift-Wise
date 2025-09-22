'use client';
import * as React from 'react';

export type PerfMode = 'auto' | 'quiet' | 'smooth';

function detectQuiet(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false; // Default to smooth on the server
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mem = (navigator as any).deviceMemory as number | undefined; // 1,2,4,8
  const cores = navigator.hardwareConcurrency ?? 4;
  // Quiet if user prefers reduced motion OR low memory OR very few cores
  return motion || (mem !== undefined && mem <= 2) || cores <= 4;
}

export function usePerfBudget(mode: PerfMode = 'auto') {
  const [quiet, setQuiet] = React.useState(mode === 'quiet');

  React.useEffect(() => {
    const isQuiet = mode === 'auto' ? detectQuiet() : mode === 'quiet';
    setQuiet(isQuiet);
  }, [mode]);
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('motion-quiet', quiet);
    document.documentElement.classList.toggle('motion-smooth', !quiet);
  }, [quiet]);

  return { quiet };
}
