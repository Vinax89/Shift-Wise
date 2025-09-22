'use client';
import * as React from 'react';
import { fmtCurrency } from '@/lib/format/number';

export type Goal = { id: string; name: string; target: number; saved: number };
export default function SavingsGoalsProgress({ goals = [] as Goal[], currency='USD' }) {
  return (
    <div className="glass rounded-xl p-3">
      <h3 className="mb-2 text-base font-semibold text-base">Goals</h3>
      <ul className="space-y-3">
        {goals.slice(0,4).map(g => {
          const pct = Math.min(100, Math.round((g.saved / Math.max(1,g.target)) * 100));
          return (
            <li key={g.id} className="rounded-lg bg-black/5 p-2 dark:bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-base">{g.name}</span>
                <span className="text-muted">{fmtCurrency(g.saved, currency)} / {fmtCurrency(g.target, currency)}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded bg-white/10">
                <div className="h-full rounded bg-[var(--ch-1)]" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
