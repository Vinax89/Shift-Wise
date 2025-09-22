'use client';
import { db, auth } from '@/lib/firebase/client';
import { collection, doc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';

export type Rule = { uid: string; merchantNorm: string; category: string; updatedAt?: any };

export async function fetchRules(): Promise<Map<string,string>> {
  const uid = auth.currentUser?.uid ?? 'demo';
  const col = collection(db, 'rules');
  const q = query(col, where('uid','==',uid));
  const snap = await getDocs(q);
  const map = new Map<string,string>();
  snap.forEach(d => map.set(d.get('merchantNorm'), d.get('category')));
  return map;
}

export async function upsertRule(merchantNorm: string, category: string) {
  const uid = auth.currentUser?.uid ?? 'demo';
  const id = `${uid}:${merchantNorm}`; // simple deterministic id
  await setDoc(doc(collection(db, 'rules'), id), { uid, merchantNorm, category, updatedAt: serverTimestamp() }, { merge: true });
}

export function normalizeMerchant(name: string){ return name?.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim() ?? ''; }

export function suggestCategory(merchant: string, amount: number, ruleMap: Map<string,string>): string | undefined {
  const norm = normalizeMerchant(merchant);
  if (ruleMap.has(norm)) return ruleMap.get(norm);
  if (amount >= 0) return 'Income';
  // naive heuristics as fallback
  if (/uber|lyft|shell|chevron|bp|exxon/.test(norm)) return 'Transport';
  if (/kroger|walmart|costco|aldi|trader|whole foods|safeway|sprouts/.test(norm)) return 'Groceries';
  if (/netflix|spotify|hulu|prime|apple|google/.test(norm)) return 'Subscriptions';
  if (/rent|landlord|apt|apartment|mortgage/.test(norm)) return 'Housing';
  return undefined;
}
