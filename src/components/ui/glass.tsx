'use client';

import * as React from 'react';

// Nav (sticky, translucent)
export function GlassNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-40 glass glass-sm rounded-none border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-2">{children}</div>
    </div>
  );
}

// Card
export function GlassCard({
  title,
  action,
  children,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass glass-lg rounded-2xl p-4">
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between">
          {title && <h2 className="text-base font-semibold text-fg">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

// Bottom tab bar (iOS-style)
export function GlassTabBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 glass glass-sm rounded-t-2xl px-3 py-2">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        {children}
      </div>
    </div>
  );
}
