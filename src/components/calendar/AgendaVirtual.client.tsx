'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

type Item = { id: string; date: string; title: string; meta?: string };
const demo: Item[] = Array.from({ length: 200 }, (_, i) => ({
  id: `a${i}`,
  date: new Date(Date.now() + i*86400000).toISOString().slice(0,10),
  title: i % 5 ? 'Shift' : 'Bill Due',
  meta: i % 5 ? '09:00–17:00' : '$12.00',
}));

export default function AgendaVirtual({ items = demo }: { items?: Item[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virt = useVirtualizer({ count: items.length, getScrollElement: () => parentRef.current, estimateSize: () => 56, overscan: 8 });
  return (
    <section className="glass rounded-xl p-3">
      <h2 className="mb-2 text-base font-semibold">Agenda</h2>
      <div ref={parentRef} className="h-[360px] overflow-auto">
        <div style={{ height: virt.getTotalSize(), position:'relative' }}>
          {virt.getVirtualItems().map(v => {
            const item = items[v.index];
            return (
              <div key={item.id} style={{ position:'absolute', top:0, left:0, right:0, transform:`translateY(${v.start}px)` }}
                   className="flex items-center justify-between border-b border-white/5 px-2 py-2">
                <div>
                  <div className="text-sm">{item.title}</div>
                  <div className="text-xs text-muted">{item.meta}</div>
                </div>
                <div className="text-xs text-muted tabular-nums">{new Date(item.date).toLocaleDateString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
