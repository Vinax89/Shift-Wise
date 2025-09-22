'use client';
import * as React from 'react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (payload: { shifts: any[] }) => Promise<void>;
};

export default function QuickAddDrawer({ open, onOpenChange, onCreate }: Props) {
  const [form, setForm] = React.useState({
    template: 'Standard',
    hours: 8,
    rate: 25,
    incentive: 0,
    premium: 0,
    date: new Date().toISOString().slice(0, 10),
  });

  async function submit() {
    await onCreate({
      shifts: [
        {
          template: form.template,
          hours: Number(form.hours) || 0,
          rate: Number(form.rate) || 0,
          incentive: Number(form.incentive) || 0,
          premium: Number(form.premium) || 0,
          date: form.date,
          ts: Date.parse(form.date),
        },
      ],
    });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center">
      <div className="w-full rounded-t-2xl bg-[var(--card,#111)] p-4 md:max-w-md md:rounded-2xl">
        <div className="mb-3 text-base font-medium">Quick Add Shift</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2 text-xs opacity-80">
            Date
            <input
              type="date"
              className="mt-1 w-full rounded border border-white/10 bg-transparent px-2 py-1"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>
          <label className="text-xs opacity-80">
            Hours
            <input
              type="number"
              className="mt-1 w-full rounded border border-white/10 bg-transparent px-2 py-1"
              value={form.hours}
              onChange={(e) => setForm((f) => ({ ...f, hours: Number(e.target.value) }))}
            />
          </label>
          <label className="text-xs opacity-80">
            Rate
            <input
              type="number"
              className="mt-1 w-full rounded border border-white/10 bg-transparent px-2 py-1"
              value={form.rate}
              onChange={(e) => setForm((f) => ({ ...f, rate: Number(e.target.value) }))}
            />
          </label>
          <label className="text-xs opacity-80">
            Incentive
            <input
              type="number"
              className="mt-1 w-full rounded border border-white/10 bg-transparent px-2 py-1"
              value={form.incentive}
              onChange={(e) => setForm((f) => ({ ...f, incentive: Number(e.target.value) }))}
            />
          </label>
          <label className="text-xs opacity-80">
            Premium
            <input
              type="number"
              className="mt-1 w-full rounded border border-white/10 bg-transparent px-2 py-1"
              value={form.premium}
              onChange={(e) => setForm((f) => ({ ...f, premium: Number(e.target.value) }))}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded px-3 py-1 ring-1 ring-white/15"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className="rounded bg-primary px-3 py-1 text-primary-fg"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
