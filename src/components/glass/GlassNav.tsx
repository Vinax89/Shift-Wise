'use client';
import * as React from 'react';
export function GlassNav({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-40 glass glass-sm rounded-none border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 min-h-10">{left}</div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </div>
  );
}
