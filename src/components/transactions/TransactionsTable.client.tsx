'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { fmtCurrency } from '@/lib/format/number';
import { store, type Txn } from '@/lib/store';
import BulkCategorizeDrawer from '@/components/transactions/BulkCategorizeDrawer.client';
import ExportCsvButton from '@/components/transactions/ExportCsvButton.client';
import { suggestCategories } from '@/app/transactions/actions';

export default function TransactionsTable() {
  const [rows, setRows] = React.useState<Txn[]>([]);
  const [query, setQuery] = React.useState('');
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const [drawer, setDrawer] = React.useState(false);
  const parentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(()=>{ store.listTxns().then(setRows); },[]);

  const filtered = React.useMemo(()=>{
    const q = query.trim().toLowerCase(); if (!q) return rows;
    return rows.filter(r => r.merchant.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q) || r.date.includes(q));
  }, [rows, query]);

  const virt = useVirtualizer({ count: filtered.length, getScrollElement: () => parentRef.current, estimateSize: () => 52, overscan: 8 });

  const toggle = (id: string) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const applyCategories = async (updates: { id: string; category: string }[]) => {
    setRows(s => s.map(r => { const u = updates.find(x=>x.id===r.id); return u? { ...r, category: u.category } : r; }));
    await store.upsertTxns(updates);
    setSel(new Set()); setDrawer(false);
  };

  const selectedRows = Array.from(sel).map(id => rows.find(r=>r.id===id)!).filter(Boolean);

  return (
    <section className="glass rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…"
                 className="w-64 rounded bg-transparent px-2 py-1 text-sm ring-1 ring-white/10"/>
          <ExportCsvButton rows={filtered} />
          <button className="rounded px-3 py-2 ring-1 ring-white/10" onClick={async()=>{
            const sample = rows.slice(0,50).map(r=>({ id:r.id, merchant:r.merchant, amount:r.amount }));
            const sug = await suggestCategories({ tenantId: 'demo', txns: sample });
            // merge suggestions into UI (show chips or prefill category selects)
            setRows(s => s.map(r => {
              const m = sug.find(x=>x.id===r.id); return m? { ...r, category: m.category } : r;
            }));
          }}>Suggest (AI)</button>
        </div>
        {sel.size>0 && (
          <button onClick={()=>setDrawer(true)} className="rounded bg-primary px-3 py-2 text-primary-fg text-sm">Bulk Categorize ({sel.size})</button>
        )}
      </div>

      <div className="sticky top-0 z-10 grid grid-cols-[1.5rem_8rem_1fr_10rem_8rem] gap-2 rounded bg-black/10 p-2 text-xs font-medium backdrop-blur dark:bg-white/10">
        <div></div><div>Date</div><div>Merchant</div><div>Category</div><div>Amount</div>
      </div>
      <div ref={parentRef} className="h-[420px] overflow-auto">
        <div style={{ height: virt.getTotalSize(), position: 'relative' }}>
          {virt.getVirtualItems().map(v => {
            const r = filtered[v.index];
            return (
              <div key={r.id} style={{ position:'absolute', top:0, left:0, width:'100%', transform:`translateY(${v.start}px)` }}
                   className="grid grid-cols-[1.5rem_8rem_1fr_10rem_8rem] items-center gap-2 border-b border-white/5 px-2 py-2 text-sm">
                <input type="checkbox" checked={sel.has(r.id)} onChange={()=>toggle(r.id)} />
                <div className="tabular-nums text-muted">{new Date(r.date).toLocaleDateString()}</div>
                <div className="truncate">{r.merchant}</div>
                <div>
                  <select className="w-full rounded bg-transparent px-2 py-1 ring-1 ring-white/10"
                          value={r.category||'Uncategorized'}
                          onChange={e=>applyCategories([{ id: r.id, category: e.target.value }])}>
                    {['Income','Groceries','Transport','Dining','Housing','Utilities','Health','Subscriptions','Shopping','Entertainment','Education','Fees','Transfers','Savings','Investments','Gifts','Travel','Insurance','Taxes','Uncategorized']
                      .map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={`text-right ${r.amount<0? 'text-red-400':'text-green-400'}`}>{fmtCurrency(r.amount)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <BulkCategorizeDrawer open={drawer} onOpenChange={setDrawer} items={selectedRows} onApply={applyCategories} />
    </section>
  );
}
