'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/glass/GlassCard';

export default function AppearancePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [density, setDensity] = useState<'comfy'|'compact'>(() => (typeof document !== 'undefined' && (document.documentElement.dataset.density as any)) || 'comfy');
  const [glass, setGlass] = useState<boolean>(true);
  useEffect(()=>{ document.documentElement.dataset.density = density; },[density]);

  return (
    <main className="mx-auto max-w-3xl p-4">
      <GlassCard title="Appearance">
        <div className="grid gap-4">
          <label className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <select className="rounded border border-border bg-card px-2 py-1" value={theme} onChange={e=>setTheme(e.target.value)}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="hc">High Contrast</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Density</span>
            <select className="rounded border border-border bg-card px-2 py-1" value={density} onChange={e=>setDensity(e.target.value as any)}>
              <option value="comfy">Comfy</option>
              <option value="compact">Compact</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Glass Effects</span>
            <input type="checkbox" checked={glass} onChange={e=>setGlass(e.target.checked)} />
          </label>
          <p className="text-xs text-muted-fg">High‑contrast theme reduces transparency automatically.</p>
        </div>
      </GlassCard>
    </main>
  );
}
