'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { computeShiftPay } from '@/lib/calendar/shiftPay';
import { createEvent, createRecurring } from '@/lib/persistence/calendar';
import type { Recurrence } from '@/lib/calendar/types';
import { RRule, Frequency } from 'rrule';

const ShiftSchema = z.object({
  date: z.string(),
  start: z.string().default('07:00'),
  end: z.string().default('15:00'),
  hourlyRate: z.coerce.number().nonnegative(),
  incentive: z.coerce.number().default(0),
  premiumPct: z.coerce.number().default(0),
});

const BillSchema = z.object({
  date: z.string(),
  name: z.string().min(1),
  amount: z.coerce.number().positive(),
  recurring: z.boolean().default(false),
  freq: z.enum(['once','weekly','monthly']).default('once'),
});

export default function QuickAddDrawer({ open, onOpenChange, initialDate }: { open: boolean; onOpenChange: (v: boolean) => void; initialDate: string }) {
  const [tab, setTab] = React.useState<'shift'|'bill'|'subscription'>('shift');

  const shift = useForm({ resolver: zodResolver(ShiftSchema), defaultValues: { date: initialDate, start: '07:00', end: '15:00', hourlyRate: 25, incentive: 0, premiumPct: 0 } });
  const bill = useForm({ resolver: zodResolver(BillSchema), defaultValues: { date: initialDate, name: '', amount: 100, recurring: false, freq: 'once' } });
  const [sub, setSub] = React.useState({ name: '', amount: 9.99, start: initialDate, freq: 'MONTHLY' as keyof typeof Frequency, interval: 1, count: 6 });


  async function submitShift(v: z.infer<typeof ShiftSchema>) {
    const [sh, sm] = v.start.split(':').map(Number);
    const [eh, em] = v.end.split(':').map(Number);
    let hours = (eh + em/60) - (sh + sm/60); if (hours < 0) hours += 24; // overnight support
    const totals = computeShiftPay({ hours, hourlyRate: v.hourlyRate, incentive: v.incentive, premiumPct: v.premiumPct });
    await createEvent({ kind:'shift', date: v.date, title: `${v.start}–${v.end} Shift`, amount: totals.gross, meta: { ...v, hours, totals } });
    onOpenChange(false);
  }

  async function submitBill(v: z.infer<typeof BillSchema>) {
    if (!v.recurring || v.freq === 'once') {
      await createEvent({ kind:'bill', date: v.date, title: v.name, amount: -Math.abs(v.amount) });
      onOpenChange(false); return;
    }
    const seed = { kind:'bill' as const, date: v.date, title: v.name, amount: -Math.abs(v.amount) };
    let rule: Recurrence = v.freq === 'weekly' ? { freq:'weekly', byWeekday:[new Date(v.date).getDay()] } : { freq:'monthly', byMonthDay: new Date(v.date).getDate() };
    const until = new Date(new Date(v.date).getFullYear(), new Date(v.date).getMonth()+6, 1); // backfill 6 months
    await createRecurring(seed, rule, until.toISOString().slice(0,10));
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 glass rounded-t-2xl p-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[640px] md:rounded-2xl">
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Quick Add</Dialog.Title>
            <Dialog.Close className="rounded px-2 py-1 text-sm hover:bg-muted">Close</Dialog.Close>
          </div>

          <div className="mb-3 flex gap-2 text-sm">
            <button onClick={()=>setTab('shift')} className={`rounded px-2 py-1 ${tab==='shift'?'bg-primary text-primary-fg':'bg-muted text-muted-fg'}`}>Shift</button>
            <button onClick={()=>setTab('bill')} className={`rounded px-2 py-1 ${tab==='bill'?'bg-primary text-primary-fg':'bg-muted text-muted-fg'}`}>Bill</button>
            <button onClick={()=>setTab('subscription')} className={`rounded px-2 py-1 ${tab==='subscription'?'bg-primary text-primary-fg':'bg-muted text-muted-fg'}`}>Subscription</button>
          </div>

          {tab==='shift' && (
            <form onSubmit={shift.handleSubmit(submitShift)} className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-sm">Date<input type="date" {...shift.register('date')} className="rounded border border-border bg-card px-2 py-1"/></label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1 text-sm">Start<input type="time" {...shift.register('start')} className="rounded border border-border bg-card px-2 py-1"/></label>
                  <label className="grid gap-1 text-sm">End<input type="time" {...shift.register('end')} className="rounded border border-border bg-card px-2 py-1"/></label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="grid gap-1 text-sm">Hourly<input inputMode="decimal" {...shift.register('hourlyRate')} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Incentive<input inputMode="decimal" {...shift.register('incentive')} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Premium %<input inputMode="decimal" {...shift.register('premiumPct')} className="rounded border border-border bg-card px-2 py-1"/></label>
              </div>
              <button className="rounded bg-primary px-3 py-2 text-primary-fg">Add Shift</button>
            </form>
          )}

          {tab==='bill' && (
            <form onSubmit={bill.handleSubmit(submitBill)} className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-sm">Date<input type="date" {...bill.register('date')} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Name<input {...bill.register('name')} className="rounded border border-border bg-card px-2 py-1"/></label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-sm">Amount<input inputMode="decimal" {...bill.register('amount')} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="flex items-center justify-between text-sm">Recurring
                  <input type="checkbox" {...bill.register('recurring')} />
                </label>
              </div>
              <label className="grid gap-1 text-sm">Frequency
                <select {...bill.register('freq')} className="rounded border border-border bg-card px-2 py-1">
                  <option value="once">Once</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
              <button className="rounded bg-primary px-3 py-2 text-primary-fg">Add</button>
            </form>
          )}
          
          {tab==='subscription' && (
            <form onSubmit={async (e)=>{e.preventDefault();
              const rule = new RRule({
                freq: Frequency[sub.freq],
                dtstart: new Date(sub.start + 'T00:00:00Z'),
                interval: sub.interval,
                count: sub.count,
              });
              // store a recurrence doc and let Cloud Function materialize
              await createEvent({ kind:'subscription', date: sub.start, title: sub.name, amount: -Math.abs(sub.amount), meta: { rrule: rule.toString() } });
              onOpenChange(false);
            }} className="grid gap-3">
              <label className="grid gap-1 text-sm">Name<input value={sub.name} onChange={e=>setSub(s=>({...s,name:e.target.value}))} className="rounded border border-border bg-card px-2 py-1"/></label>
              <div className="grid grid-cols-3 gap-2">
                <label className="grid gap-1 text-sm">Start<input type="date" value={sub.start} onChange={e=>setSub(s=>({...s,start:e.target.value}))} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Amount<input inputMode="decimal" value={sub.amount} onChange={e=>setSub(s=>({...s,amount:Number(e.target.value)}))} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Freq<select value={sub.freq} onChange={e=>setSub(s=>({...s,freq:e.target.value as any}))} className="rounded border border-border bg-card px-2 py-1">
                  <option>DAILY</option><option>WEEKLY</option><option>MONTHLY</option><option>YEARLY</option>
                </select></label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-sm">Interval<input inputMode="numeric" value={sub.interval} onChange={e=>setSub(s=>({...s,interval:Number(e.target.value)}))} className="rounded border border-border bg-card px-2 py-1"/></label>
                <label className="grid gap-1 text-sm">Occurrences<input inputMode="numeric" value={sub.count} onChange={e=>setSub(s=>({...s,count:Number(e.target.value)}))} className="rounded border border-border bg-card px-2 py-1"/></label>
              </div>
              <button className="rounded bg-primary px-3 py-2 text-primary-fg">Create Subscription</button>
            </form>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
