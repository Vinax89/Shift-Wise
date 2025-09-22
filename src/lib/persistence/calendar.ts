'use client';
import { db, auth } from '@/lib/firebase/client';
import { addDoc, collection, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import type { CalendarEvent, Recurrence } from '@/lib/calendar/types';
import { occurrences } from '@/lib/calendar/recurrence';

const evCol = () => collection(db, 'events');

export async function createEvent(e: Omit<CalendarEvent, 'uid' | 'createdAt'>) {
  const uid = auth.currentUser?.uid ?? 'demo';
  return addDoc(evCol(), { ...e, uid, createdAt: serverTimestamp() });
}

export async function createRecurring(
  seed: Omit<CalendarEvent, 'uid' | 'createdAt' | 'date'> & { date: string },
  rule: Recurrence,
  untilISO: string
) {
  const uid = auth.currentUser?.uid ?? 'demo';
  const batch = writeBatch(db);
  for (const day of occurrences(seed.date, rule, untilISO)) {
    const ref = doc(evCol());
    batch.set(ref, { ...seed, uid, date: day, createdAt: serverTimestamp() });
  }
  await batch.commit();
}
