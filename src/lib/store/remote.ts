'use client';
import { db, auth } from '@/lib/firebase/client';
import { collection, doc, getDocs, writeBatch, query, where, orderBy, limit, setDoc, serverTimestamp } from 'firebase/firestore';
import type { BudgetRow, Txn } from '.';

// Note: UID is hardcoded to 'demo' for now. Replace with actual user management.
const getUid = () => auth.currentUser?.uid ?? 'demo';

// --- Budgets ---
export async function listBudgets(): Promise<BudgetRow[]> {
  const uid = getUid();
  const col = collection(db, `users/${uid}/budgets`);
  const snap = await getDocs(query(col, orderBy('category')));
  const rows: BudgetRow[] = [];
  snap.forEach(d => rows.push({ id: d.id, ...d.data() } as BudgetRow));
  return rows;
}

export async function upsertBudget(row: Partial<BudgetRow> & {id: string}): Promise<BudgetRow> {
  const uid = getUid();
  const ref = doc(db, `users/${uid}/budgets`, row.id);
  await setDoc(ref, { ...row, updatedAt: serverTimestamp() }, { merge: true });
  return row as BudgetRow; // optimistic return
}


// --- Transactions ---
export async function listTxns(): Promise<Txn[]> {
  const uid = getUid();
  const col = collection(db, `users/${uid}/transactions`);
  const snap = await getDocs(query(col, orderBy('date', 'desc'), limit(500)));
  const rows: Txn[] = [];
  snap.forEach(d => rows.push({ id: d.id, ...d.data() } as Txn));
  return rows;
}

export async function upsertTxns(changes: (Partial<Txn> & {id: string})[]): Promise<void> {
  const uid = getUid();
  const col = collection(db, `users/${uid}/transactions`);
  const batch = writeBatch(db);
  for (const c of changes) {
    const ref = doc(col, c.id);
    batch.set(ref, { ...c, updatedAt: serverTimestamp() }, { merge: true });
  }
  await batch.commit();
}
