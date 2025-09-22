'use client';

import * as React from 'react';
import QuickAddDrawer from '@/components/calendar/QuickAddDrawer.client';
import { saveShiftsClient } from '@/lib/store/calendar-client';

type Props = {
  onCreate?: (payload: any) => Promise<void>;
};

export default function QuickAddClient({ onCreate }: Props) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  return (
    <div className="glass rounded-xl p-3">
      <button
        className="rounded bg-primary px-3 py-2 text-primary-fg disabled:opacity-60"
        onClick={() => setOpen(true)}
        disabled={busy}
      >
        Quick Add
      </button>

      <QuickAddDrawer
        open={open}
        onOpenChange={setOpen}
        onCreate={async (p) => {
          try {
            setBusy(true);
            if (onCreate) {
              await onCreate(p);
            } else {
              // Client-side write using end-user credentials
              await saveShiftsClient(p?.shifts ?? []);
            }
            setOpen(false);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
