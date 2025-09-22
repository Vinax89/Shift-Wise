'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { fmtCurrency } from '@/lib/format/number';

export type Txn = { id: string; date: string; merchant: string; amount: number; category?: string };
export default function RecentTransactions({ items = [] as Txn[], currency='USD' }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 6,
  });
  return (
    <div className="glass rounded-xl p-3">
      <h3 className="mb-2 text-base font-semibold text-base">Recent</h3>
      <div ref={parentRef} className="h-[300px] overflow-auto">
        <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(v => {
            const t = items[v.index];
            return (
              <div key={t.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${v.start}px)` }}
                   className="flex items-center justify-between border-b border-white/5 px-2 py-2">
                <div>
                  <div className="text-sm text-base">{t.merchant}</div>
                  <div className="text-xs text-muted">{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div className={`text-sm ${t.amount<0? 'text-red-400':'text-green-400'}`}>{fmtCurrency(t.amount, currency)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
