'use client';
import { useEffect } from 'react';
export default function ChartHost({ height = 280, children }: { height?: number; children: React.ReactNode }) {
  useEffect(() => {
    // Recharts reads size once; fire a resize after mount in case parent width was 0
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="w-full min-w-0" style={{ height }}>
      {children}
    </div>
  );
}
