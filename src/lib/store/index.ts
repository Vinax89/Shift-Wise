export type BudgetRow = {
  id: string;
  category: string;
  period: 'weekly'|'biweekly'|'semimonthly'|'monthly';
  amount: number; // planned
  spent: number;  // actual
  rollover: boolean;
};

export type Txn = {
  id: string; date: string; merchant: string; amount: number; category?: string; note?: string;
};

export type ShiftTemplate = {
  id: string; title: string; start: string; end: string; rate: number; premium?: number; incentive?: number; repeat: 'none'|'weekly'|'biweekly'|'custom'; repeatCount?: number;
};

// Detects presence of Firebase config on client
export function hasFirebaseCfg() {
  if (typeof window === 'undefined') return false;
  const k = (globalThis as any).firebaseConfig || {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  return !!(k && (k.apiKey || k.projectId));
}

// Minimal in-memory demo data for immediate visuals
const demoBudgets: BudgetRow[] = [
  { id: 'b1', category: 'Rent', period: 'monthly', amount: 1800, spent: 1800, rollover: false },
  { id: 'b2', category: 'Groceries', period: 'biweekly', amount: 280, spent: 260, rollover: true },
  { id: 'b3', category: 'Transport', period: 'monthly', amount: 220, spent: 205, rollover: true },
];

let memBudgets = [...demoBudgets];
let memTxns: Txn[] = [
  { id: 't1', date: '2025-08-18', merchant: 'Kroger', amount: -54.23, category: 'Groceries' },
  { id: 't2', date: '2025-08-17', merchant: 'Shell', amount: -36.5, category: 'Transport' },
  { id: 't3', date: '2025-08-16', merchant: 'Payroll', amount: 1420, category: 'Income' },
];

export const store = {
  async listBudgets(): Promise<BudgetRow[]> { return hasFirebaseCfg() ? await import('../store/remote').then(m=>m.listBudgets()) : memBudgets; },
  async upsertBudget(row: Partial<BudgetRow> & {id: string}): Promise<BudgetRow> {
    if (hasFirebaseCfg()) return import('../store/remote').then(m=>m.upsertBudget(row));
    memBudgets = memBudgets.map(b => b.id===row.id ? { ...b, ...row } as BudgetRow : b);
    return memBudgets.find(b=>b.id===row.id)!;
  },
  async listTxns(): Promise<Txn[]> { return hasFirebaseCfg() ? await import('../store/remote').then(m=>m.listTxns()) : memTxns; },
  async upsertTxns(changes: (Partial<Txn> & {id: string})[]): Promise<void> {
    if (hasFirebaseCfg()) return import('../store/remote').then(m=>m.upsertTxns(changes));
    const map = new Map(memTxns.map(t=>[t.id,t] as const));
    for (const c of changes) map.set(c.id, { ...map.get(c.id)!, ...c });
    memTxns = Array.from(map.values());
  },
};
