'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase/client';
import { collection, onSnapshot, orderBy, query, where, limit as qlimit, startAt, endAt } from 'firebase/firestore';

export type Txn = { id: string; uid: string; date: string; merchant: string; amount: number; category?: string; source?: string; accountId?: string };

export function useTransactionsLive({ from, to, max = 2000 }: { from?: string; to?: string; max?: number }) {
  const [rows, setRows] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const uid = auth.currentUser?.uid ?? 'demo';
    const col = collection(db, 'transactions');
    const parts: any[] = [where('uid', '==', uid)];
    if (from) parts.push(where('date', '>=', from));
    if (to) parts.push(where('date', '<=', to));
    const q = query(col, ...parts, orderBy('date', 'desc'), qlimit(max));
    const unsub = onSnapshot(q, (snap) => {
      const out: Txn[] = [];
      snap.forEach((d: any) => out.push({ id: d.id, ...d.data() }));
      setRows(out); setLoading(false);
    });
    return () => unsub();
  }, [from, to, max]);
  return { rows, loading };
}
