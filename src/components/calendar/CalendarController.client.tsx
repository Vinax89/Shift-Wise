'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';

const CalendarMonth = dynamic(() => import('@/components/calendar/CalendarMonth.client'), { ssr:false, loading: () => <div className="h-40 animate-pulse rounded"/> });
const AgendaVirtual = dynamic(() => import('@/components/calendar/AgendaVirtual.client'), { ssr:false, loading: () => <div className="h-40 animate-pulse rounded"/> });
const QuickAddDrawer = dynamic(() => import('@/components/calendar/QuickAddDrawer.client'), { ssr:false });

export default function CalendarController({ today }: { today: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Calendar</h1>
        <button className="rounded bg-primary px-3 py-2 text-primary-fg" onClick={()=>setOpen(true)}>Quick Add</button>
      </div>
      <CalendarMonth today={today} />
      <AgendaVirtual />
      <QuickAddDrawer open={open} onOpenChange={setOpen} onCreate={async()=>{}} />
    </div>
  );
}
