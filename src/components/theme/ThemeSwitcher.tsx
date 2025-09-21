'use client';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [density, setDensity] = useState<'comfy'|'compact'>(() => (typeof document !== 'undefined' && document.documentElement.dataset.density as any) || 'comfy');
  useEffect(()=>{ document.documentElement.dataset.density = density; },[density]);

  return (
    <div className="flex items-center gap-2">
      <select className="rounded border border-border bg-card px-2 py-1 text-sm" value={theme} onChange={e=>setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="hc">High Contrast</option>
      </select>
      <select className="rounded border border-border bg-card px-2 py-1 text-sm" value={density} onChange={e=>setDensity(e.target.value as any)}>
        <option value="comfy">Comfy</option>
        <option value="compact">Compact</option>
      </select>
    </div>
  );
}
