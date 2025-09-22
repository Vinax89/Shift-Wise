'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { normalizeMerchant, suggestCategory, fetchRules, upsertRule } from '@/lib/tx/rules';

export type Txn = { id: string; date: string; merchant: string; amount: number; category?: string };

async function getMlSuggestions(items: { merchant: string; amount: number }[]) {
  const res = await fetch('/api/ai/categorize', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ uid: 'current', items }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.items as { merchant: string; amount: number; suggestedCategory: string; confidence: number; reason: string }[];
}

export default function BulkCategorizeDrawer({ open, onOpenChange, items, onApply }: { open: boolean; onOpenChange: (v:boolean)=>void; items: Txn[]; onApply: (updates: { id: string; category: string }[]) => Promise<void> }) {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [suggesting, setSuggesting] = React.useState(false);

  React.useEffect(() => { void build(); }, [open, items]);

  async function build() {
    if (!open) return;
    const rules = await fetchRules();
    const uncategorized = items.filter(t => !t.category || t.category === 'Uncategorized');
    const map = new Map<string, Group>();
    for (const t of uncategorized) {
      const key = normalizeMerchant(t.merchant);
      const g = map.get(key) ?? { key, merchant: t.merchant, ids: [], suggestion: suggestCategory(t.merchant, t.amount, rules) };
      g.ids.push(t.id);
      map.set(key, g);
    }
    setGroups(Array.from(map.values()).sort((a,b)=>b.ids.length - a.ids.length));
  }

  async function applyAll() {
    setBusy(true);
    try {
      const updates = groups.flatMap(g => g.choice ? g.ids.map(id => ({ id, category: g.choice! })) : []);
      await onApply(updates);
      // persist rules for choices the user made
      await Promise.all(groups.filter(g=>g.choice).map(g => upsertRule(normalizeMerchant(g.merchant), g.choice!)));
      onOpenChange(false);
    } finally { setBusy(false); }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 glass rounded-t-2xl p-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[720px] md:rounded-2xl">
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Bulk Categorize</Dialog.Title>
            <Dialog.Close className="rounded px-2 py-1 text-sm hover:bg-muted">Close</Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-auto rounded border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="text-left text-xs text-muted-fg">
                  <th className="px-3 py-2">Merchant</th>
                  <th className="px-3 py-2">Count</th>
                  <th className="px-3 py-2">Suggestion</th>
                  <th className="px-3 py-2">Choose</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(g => (
                  <tr key={g.key} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium text-card-fg">{g.merchant}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-fg">{g.ids.length}</td>
                    <td className="px-3 py-2 text-muted-fg">{g.suggestion ?? '—'}</td>
                    <td className="px-3 py-2">
                      <CategorySelect value={g.choice ?? g.suggestion ?? ''} onChange={(v)=>setGroups(s=>s.map(x=>x.key===g.key?{...x,choice:v || undefined}:x))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-fg">
              <span>{groups.length} merchant groups</span>
              <button
                className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
                disabled={suggesting || groups.length === 0}
                onClick={async ()=>{
                  try {
                    setSuggesting(true);
                    const sample = groups.map(g => ({ merchant: g.merchant, amount: 0 }));
                    const ml = await getMlSuggestions(sample);
                    setGroups(s => s.map(g => {
                      const hit = ml.find(m => normalizeMerchant(m.merchant) === normalizeMerchant(g.merchant));
                      return hit ? { ...g, suggestion: hit.suggestedCategory, choice: g.choice ?? hit.suggestedCategory } : g;
                    }));
                  } finally { setSuggesting(false); }
                }}
              >{suggesting ? 'Suggesting…' : 'Suggest (ML)'}</button>
            </div>
            <button onClick={applyAll} disabled={busy} className="rounded bg-primary px-3 py-2 text-primary-fg disabled:opacity-50">{busy? 'Applying…' : 'Apply & Save Rules'}</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type Group = { key: string; merchant: string; ids: string[]; suggestion?: string; choice?: string };

function CategorySelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const cats = ['Income','Groceries','Transport','Dining','Housing','Utilities','Health','Subscriptions','Shopping','Entertainment','Education','Fees','Transfers','Uncategorized'];
  return (
    <select className="rounded border border-border bg-card px-2 py-1" value={value} onChange={(e)=>onChange(e.target.value)}>
      <option value="">—</option>
      {cats.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
