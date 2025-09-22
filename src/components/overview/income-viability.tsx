'use client';
import * as React from 'react';
import { fmtCurrency } from '@/lib/format/number';

type Props = { grossMonthly: number; taxesMonthly: number; costOfLivingMonthly: number; currency?: string };
export default function IncomeViability({ grossMonthly, taxesMonthly, costOfLivingMonthly, currency='USD' }: Props) {
  const net = Math.max(0, grossMonthly - taxesMonthly - costOfLivingMonthly);
  const parts = [
    { label: 'Taxes', v: taxesMonthly, color: 'var(--ch-2)' },
    { label: 'Cost of Living', v: costOfLivingMonthly, color: 'var(--ch-3)' },
    { label: 'Net', v: net, color: 'var(--ch-1)' },
  ];
  const total = parts.reduce((a,p)=>a+p.v,0);
  return (
    <div className="glass rounded-xl p-3">
      <h3 className="mb-2 text-base font-semibold text-base">Income Viability</h3>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <Kpi label="Gross" value={fmtCurrency(grossMonthly, currency)} />
        <Kpi label="Taxes" value={fmtCurrency(taxesMonthly, currency)} />
        <Kpi label="Net" value={fmtCurrency(net, currency)} />
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded bg-white/10">
        {parts.map((p, i) => (
          <div key={i} className="h-full" style={{ width: `${(p.v/Math.max(1,total))*100}%`, background: p.color, display:'inline-block' }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        {parts.map((p)=> <span key={p.label}>{p.label}</span>)}
      </div>
    </div>
  );
}
function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/5 p-2 dark:bg-white/5">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
