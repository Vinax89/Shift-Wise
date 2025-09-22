'use client';
import * as React from 'react';
import { usePerfBudget } from '@/hooks/usePerfBudget';

export default function ChartFrame({ children, className, height=240 }: React.PropsWithChildren<{className?: string; height?: number}>){
  usePerfBudget('auto'); // toggles .motion-quiet
  return (
    <div className={`glass card rounded-xl p-3 ${className||''}`} style={{ minHeight: height }}>
      {/* Ensure a stacking context & GPU promotion for tooltip layers */}
      <div className="relative gpu h-full">{children}</div>
    </div>
  );
}
