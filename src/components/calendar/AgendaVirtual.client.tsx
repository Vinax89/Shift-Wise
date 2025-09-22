'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export type AgendaRow = { id: string; date: string; title: string; meta?: string; amount?: number };
export default function AgendaVirtual({ rows, onOpen }: { rows: AgendaRow[]; onOpen: (id: string) => void }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const v = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 56, overscan: 10 });
  return (
    <div ref={parentRef} className="h-[60vh] overflow-auto [content-visibility:auto] [contain-intrinsic-size:56px] rounded-2xl border border-border bg-card">
      <div style={{ height: v.getTotalSize() }} className="relative">
        {v.getVirtualItems().map(item => {
          const row = rows[item.index];
          return (
            <div key={item.key} className="absolute left-0 right-0" style={{ transform: `translateY(${item.start}px)`, height: item.size }}>
              <button onClick={()=>onOpen(row.id)} className="flex w-full items-center justify-between px-3 py-3 text-left hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
                <div>
                  <div className="text-sm font-medium text-card-fg">{row.title}</div>
                  <div className="text-xs text-muted-fg">{row.date} {row.meta ? `• ${row.meta}` : ''}</div>
                </div>
                {row.amount!==undefined && <div className={`text-sm font-semibold ${row.amount<0?'text-danger':'text-success'}`}>{fmt(row.amount)}</div>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function fmt(n:number){ return new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(n); }
