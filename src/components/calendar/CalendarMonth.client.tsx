'use client';
import * as React from 'react';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, isToday, format } from 'date-fns';

export type CalItem = { id: string; date: string; kind: 'shift'|'bill'|'subscription'|'payday'; title: string; amount?: number };

type Props = { year: number; month: number; items: CalItem[]; onNew: (date: Date) => void; onOpen: (id: string) => void };

export default function CalendarMonth({ year, month, items, onNew, onOpen }: Props) {
  const first = startOfMonth(new Date(year, month, 1));
  const last = endOfMonth(first);
  const gridStart = startOfWeek(first, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(last, { weekStartsOn: 0 });

  const byDay = React.useMemo(() => {
    const map = new Map<string, CalItem[]>();
    for (const it of items) {
      const key = it.date.slice(0,10);
      const arr = map.get(key) || []; arr.push(it); map.set(key, arr);
    }
    return map;
  }, [items]);

  const [focus, setFocus] = React.useState<Date>(new Date());
  const grid: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) grid.push(d);

  function onKey(e: React.KeyboardEvent<HTMLButtonElement>, d: Date) {
    const idx = grid.findIndex(x => x.getTime() === d.getTime());
    const col = idx % 7; const row = Math.floor(idx / 7);
    const move = (r: number, c: number) => {
      const n = (row + r) * 7 + (col + c);
      if (n >= 0 && n < grid.length) setFocus(grid[n]);
    };
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); move(0, 1); break;
      case 'ArrowLeft': e.preventDefault(); move(0, -1); break;
      case 'ArrowDown': e.preventDefault(); move(1, 0); break;
      case 'ArrowUp': e.preventDefault(); move(-1, 0); break;
      case 'Enter': e.preventDefault(); onNew(d); break;
      case 'Delete': e.preventDefault(); /* optional: open day to delete */ break;
    }
  }

  return (
    <div role="grid" aria-label={format(first, 'MMMM yyyy')} className="rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border/70 text-xs text-muted-fg">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(w => <div key={w} className="px-2 py-1">{w}</div>)}
      </div>
      <div role="rowgroup" className="grid grid-cols-7">
        {grid.map((d) => {
          const k = format(d, 'yyyy-MM-dd');
          const dayItems = byDay.get(k) || [];
          const muted = !isSameMonth(d, first);
          const today = isToday(d);
          const isFocused = focus.toDateString() === d.toDateString();
          return (
            <div key={k} role="gridcell" aria-selected={isFocused} className={`min-h-[96px] border-t border-l border-border/60 p-1 ${muted ? 'opacity-60' : ''}`}>
              <button
                onKeyDown={(e)=>onKey(e,d)} onDoubleClick={()=>onNew(d)} onClick={()=>setFocus(d)}
                className={`w-full text-left rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-ring ${today ? 'bg-muted' : ''}`}
                aria-label={k}
              >
                <span className="text-xs font-semibold">{d.getDate()}</span>
              </button>
              <ul className="mt-1 flex flex-col gap-0.5">
                {dayItems.slice(0,3).map(it => (
                  <li key={it.id}>
                    <button
                      onClick={()=>onOpen(it.id)}
                      className={`w-full truncate rounded px-1 py-0.5 text-xs hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring ${chipClass(it.kind)}`}
                      aria-label={`${it.title} on ${k}`}
                    >{it.title}{it.amount!==undefined ? ` • ${fmt(it.amount)}`:''}</button>
                  </li>
                ))}
                {dayItems.length>3 && <li className="text-[10px] text-muted-fg">+{dayItems.length-3} more</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function chipClass(kind: CalItem['kind']) {
  switch(kind){
    case 'shift': return 'bg-[hsl(var(--chart-1)/.18)] text-[hsl(var(--chart-1))]';
    case 'bill': return 'bg-[hsl(var(--warning)/.18)] text-[hsl(var(--warning))]';
    case 'subscription': return 'bg-[hsl(var(--secondary)/.18)] text-[hsl(var(--secondary))]';
    case 'payday': return 'bg-[hsl(var(--success)/.18)] text-[hsl(var(--success))]';
  }
}
function fmt(n:number){ return new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n); }
