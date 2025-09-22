'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase/client';
import { collection, onSnapshot, orderBy, query, where, limit as qlimit, startAt, endAt } from 'firebase/firestore';
import type { CalendarEvent } from '@/lib/calendar/types';

export function useEventsLive({ from, to, max = 5000, kinds }: { from: string; to: string; max?: number; kinds?: string[] }) {
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const uid = auth.currentUser?.uid ?? 'demo';
    const col = collection(db, 'events');
    const clauses = [where('uid', '==', uid), where('date', '>=', from), where('date', '<=', to)];
    if (kinds && kinds.length) clauses.push(where('kind', 'in', kinds as any));
    const q = query(col, ...clauses, orderBy('date', 'asc'), qlimit(max));
    const unsub = onSnapshot(q, (snap) => {
      const rows: CalendarEvent[] = [];
      snap.forEach((d: any) => rows.push({ id: d.id, ...d.data() }));
      setData(rows); setLoading(false);
    });
    return () => unsub();
  }, [from, to, max, JSON.stringify(kinds)]);
  return { data, loading };
}
