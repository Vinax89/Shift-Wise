import * as React from 'react';
export function GlassCard({ title, action, children }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl card-pad">
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
