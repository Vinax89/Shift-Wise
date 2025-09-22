'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { fmtCurrency } from '@/lib/format/number';
import { store, type BudgetRow } from '@/lib/store';

export default function BudgetGrid() {
  const [rows, setRows] = React.useState<BudgetRow[]>([]);
  const [busy, setBusy] = React.useState(false);
  const parentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { store.listBudgets().then(setRows); }, []);

  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 52, overscan: 6 });

  const save = React.useCallback(async (id: string, patch: Partial<BudgetRow>) => {
    setBusy(true);
    setRows(s => s.map(r => r.id===id ? { ...r, ...patch } : r)); // optimistic
    try { await store.upsertBudget({ id, ...patch }); } finally { setBusy(false); }
  }, []);

  const totalBudget = rows.reduce((a,r)=>a+r.amount,0);
  const totalSpent  = rows.reduce((a,r)=>a+r.spent,0);

  return (
    <section className="glass rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budget Planner</h2>
        <span className="text-xs text-muted">{busy? 'Saving…' : 'Ready'}</span>
      </div>
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 rounded-lg bg-black/5 p-2 text-xs font-medium dark:bg-white/5">
        <div>Category</div><div>Period</div><div>Planned</div><div>Spent</div><div>Rollover</div>
      </div>
      <div ref={parentRef} className="h-[360px] overflow-auto">
        <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
          {virt.getVirtualItems().map(v => {
            const r = rows[v.index];
            const remain = r.amount - r.spent;
            return (
              <div key={r.id} style={{ position:'absolute', top:0, left:0, width:'100%', transform:`translateY(${v.start}px)` }}
                   className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2 border-b border-white/5 px-2 py-2 text-sm">
                <div className="truncate">{r.category}</div>
                <select className="rounded bg-transparent px-1 py-1 outline-none ring-1 ring-white/10"
                        value={r.period} onChange={e=>save(r.id,{period: e.target.value as any})}>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="semimonthly">Semi‑Monthly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input type="number" className="w-full rounded bg-transparent px-2 py-1 ring-1 ring-white/10"
                       value={r.amount} onChange={e=>save(r.id,{amount: Number(e.target.value)})} />
                <div className={remain<0? 'text-red-400':'text-green-400'}>{fmtCurrency(r.spent)} <span className="text-muted">({fmtCurrency(remain)} left)</span></div>
                <label className="inline-flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={r.rollover} onChange={e=>save(r.id,{rollover: e.target.checked})} />
                  <span className="text-muted">Enable</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <Kpi label="Total Planned" value={fmtCurrency(totalBudget)} />
        <Kpi label="Total Spent" value={fmtCurrency(totalSpent)} />
        <Kpi label="Remaining" value={fmtCurrency(totalBudget-totalSpent)} />
      </div>
    </section>
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
