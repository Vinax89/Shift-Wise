'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useEventsLive } from '@/hooks/useEventsLive';

const CalendarMonth = dynamic(() => import('@/components/calendar/CalendarMonth.client'), { ssr:false });
const AgendaVirtual = dynamic(() => import('@/components/calendar/AgendaVirtual.client'), { ssr:false });
const QuickAddDrawer = dynamic(() => import('@/components/calendar/QuickAddDrawer.client'), { ssr:false });

export default function CalendarPage() {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      {/* Drawer controller in a client island */}
      <QuickAddController today={today} />
    </main>
  );
}

function QuickAddController({ today }: any) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>(today);
  const [cursor, setCursor] = useState(new Date());

  const from = format(startOfMonth(cursor), 'yyyy-MM-dd');
  const to = format(endOfMonth(cursor), 'yyyy-MM-dd');

  const { data: monthItems } = useEventsLive({ from, to, max: 5000 });
  const { data: agenda } = useEventsLive({ from, to, max: 5000 });

  return (
    <>
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Calendar</h1>
          <button onClick={()=>{ setDate(today); setOpen(true); }} className="rounded bg-primary px-3 py-2 text-primary-fg">Quick Add</button>
        </header>
        <CalendarMonth year={new Date(date).getFullYear()} month={new Date(date).getMonth()} items={monthItems} onNew={(d)=>{ setDate(format(d,'yyyy-MM-dd')); setOpen(true); }} onOpen={() => { /* open details */ }} />
      </section>
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Agenda</h2>
        </header>
        <AgendaVirtual rows={agenda} onOpen={() => {}} />
      </section>
      <QuickAddDrawer open={open} onOpenChange={setOpen} initialDate={date} />
    </>
  );
}
