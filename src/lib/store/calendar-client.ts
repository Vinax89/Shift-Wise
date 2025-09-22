'use client';

import { auth, db } from '@/lib/firebase/client';
import {
  writeBatch,
  doc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

type Shift = {
  ts: number;         // epoch millis
  date?: string;      // ISO yyyy-mm-dd
  hours?: number;
  rate?: number;
  incentive?: number;
  premium?: number;
  template?: string;
  id?: string;
};

/**
 * Save shifts with end-user credentials (client SDK).
 * Firestore Rules enforce: only the owner (auth.uid) can write to their path.
 */
export async function saveShiftsClient(shifts: Shift[]) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not signed in');
  if (!Array.isArray(shifts) || shifts.length === 0) return;

  const batch = writeBatch(db);
  const userRef = doc(db, 'users', uid);
  batch.set(userRef, { updatedAt: serverTimestamp() }, { merge: true });

  const col = collection(db, 'users', uid, 'shifts');
  const now = Date.now();
  for (const s of shifts) {
    const ts = Number.isFinite(s?.ts) ? (s!.ts as number) : now;
    const id = String(s?.id ?? `${ts}-${Math.random().toString(36).slice(2, 8)}`);
    batch.set(doc(col, id), {
      ...s,
      ts,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  await batch.commit();
  return true;
}
