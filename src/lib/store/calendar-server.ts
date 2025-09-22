import { adminDb } from '@/lib/firebase/admin';

// Server-side Firestore write (uses Admin SDK)
export async function saveShifts(uid: string, shifts: any[]) {
  if (!uid) throw new Error('Missing uid');
  const batch = adminDb.batch();
  const now = Date.now();
  const userRef = adminDb.collection('users').doc(uid);
  batch.set(userRef, { updatedAt: now }, { merge: true });

  const shiftsCol = userRef.collection('shifts');
  for (const s of shifts || []) {
    const ts = Number.isFinite(s?.ts) ? s.ts : now;
    const id = String(s?.id ?? `${ts}-${Math.random().toString(36).slice(2, 8)}`);
    batch.set(
      shiftsCol.doc(id),
      { ...s, ts, updatedAt: now },
      { merge: true }
    );
  }

  await batch.commit();
}
