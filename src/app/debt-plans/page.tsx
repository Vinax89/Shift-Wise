// apps/web/app/debt-plans/page.tsx
'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// NOTE: Replace with real Firestore hooks/server actions.
type BnplPlan = { id: string; provider: string; purchaseAmount: number; remaining: number; effectiveApr: number; nextDue?: string };
type Debt = { id: string; name: string; type: 'credit'|'loan'; balance: number; apr: number; minPay: number };

async function fetchBnpl(): Promise<BnplPlan[]> { return []; }
async function fetchDebts(): Promise<Debt[]> { return []; }

export default function DebtPlansPage() {
  const [bnpl, setBnpl] = useState<BnplPlan[] | null>(null);
  const [debts, setDebts] = useState<Debt[] | null>(null);
  useEffect(() => { (async () => { setBnpl(await fetchBnpl()); setDebts(await fetchDebts()); })(); }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Debt & Plans</h1>
        <div className="space-x-2">
          <Button variant="outline">Add Debt</Button>
          <Button>Add BNPL Plan</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-2">BNPL Plans</h2>
          {!bnpl ? <div className="h-24 animate-pulse rounded bg-muted"/> : (
            bnpl.length===0 ? <Empty text="No BNPL plans yet."/> : (
              <div className="divide-y">
                {bnpl.map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{p.provider}</div>
                      <div className="text-sm text-muted-foreground">Purchase {fmt(p.purchaseAmount)} • APR {fmtPct(p.effectiveApr)} {p.nextDue && `• Next due ${p.nextDue}`}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{fmt(p.remaining)}</div>
                      <div className="text-xs text-muted-foreground">remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-medium mb-2">Debts</h2>
          {!debts ? <div className="h-24 animate-pulse rounded bg-muted"/> : (
            debts.length===0 ? <Empty text="No debts added."/> : (
              <div className="divide-y">
                {debts.map(d => (
                  <div key={d.id} className="py-3 grid grid-cols-3 items-center gap-2">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{d.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{fmt(d.balance)}</div>
                      <div className="text-xs text-muted-foreground">balance</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{fmtPct(d.apr)}</div>
                      <div className="text-xs text-muted-foreground">APR • min {fmt(d.minPay)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </Card>
      </section>
    </div>
  );
}

function fmt(n: number) { return new Intl.NumberFormat(undefined,{ style:'currency', currency:'USD' }).format(n); }
function fmtPct(n: number) { return `${(n*100).toFixed(2)}%`; }
function Empty({ text }: { text: string }) { return <div className="text-sm text-muted-foreground">{text}</div>; }
