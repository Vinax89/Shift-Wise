// packages/shared/bnpl/detectBnpl.ts
// Heuristic BNPL detector & plan proposer

export type NormalizedTxn = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  amount: number; // negative = debit (payment made by user)
  merchant: string;
  memo?: string;
};

export type ProposedBnplPlan = {
  key: string; // stable detection key
  provider: 'unknown'|'affirm'|'klarna'|'afterpay'|'paypal'|'sezzle'|'shop'|'zip';
  purchaseTxnId: string;
  purchaseAmount: number;
  schedule: { due: string; amount: number }[]; // proposed installments
  cadence: 'weekly'|'biweekly'|'monthly';
  confidence: number; // 0..1
};

const PROVIDER_RE = /(affirm|klarna|after ?pay|sezzle|paypal\s*(pay\s*in\s*4)?|shop\s*pay.*install|zip\s*pay)/i;

function daysBetween(a: string, b: string) { return Math.round((+new Date(b) - +new Date(a)) / 86400000); }

function roundCents(n: number) { return Math.round(n * 100) / 100; }

export function detectBnpl(transactions: NormalizedTxn[], lookaheadDays = 60): ProposedBnplPlan[] {
  const txns = [...transactions].sort((a,b)=> a.date.localeCompare(b.date));
  const plans: ProposedBnplPlan[] = [];

  for (let i = 0; i < txns.length; i++) {
    const t = txns[i];
    // Candidate purchase: relatively large debit with BNPL provider hints in memo/merchant
    const isCandidate = (t.amount < 0) && (Math.abs(t.amount) >= 50) && (PROVIDER_RE.test(t.merchant) || PROVIDER_RE.test(t.memo||''));
    if (!isCandidate) continue;

    const purchaseAmt = Math.abs(t.amount);
    const window = txns.filter(x => daysBetween(t.date, x.date) > 0 && daysBetween(t.date, x.date) <= lookaheadDays);

    // Find 3–6 near-equal debits spaced ~7/14/30 days
    const payments = window.filter(x => x.amount < 0 && Math.abs(Math.abs(x.amount) - purchaseAmt / 4) / (purchaseAmt / 4) < 0.08);
    // Try common cadences first
    const groupByGap: Record<string, NormalizedTxn[]> = { weekly: [], biweekly: [], monthly: [] };
    for (const p of payments) {
      const d = daysBetween(t.date, p.date);
      if (Math.abs(d - 7) <= 2) groupByGap.weekly.push(p);
      if (Math.abs(d - 14) <= 3) groupByGap.biweekly.push(p);
      if (Math.abs(d - 30) <= 5) groupByGap.monthly.push(p);
    }
    const pick = (['biweekly','weekly','monthly'] as const).find(c => groupByGap[c].length >= 3);
    if (!pick) continue;
    const cadence = pick;
    const inst = cadence === 'weekly' ? 7 : cadence === 'biweekly' ? 14 : 30;

    // Build schedule (pay-in-4 default). If more observed, clip to 4.
    const schedule = Array.from({ length: 4 }, (_, k) => {
      const due = new Date(+new Date(t.date) + (k+1) * inst * 86400000).toISOString().slice(0,10);
      const amount = roundCents(purchaseAmt / 4);
      return { due, amount };
    });

    const provider = (t.merchant.match(PROVIDER_RE)?.[1] || t.memo?.match(PROVIDER_RE)?.[1] || 'unknown')
      .toLowerCase().replace(/\s+/g,'') as ProposedBnplPlan['provider'];

    const key = `${t.id}:${cadence}:${schedule[0]?.amount}`;
    plans.push({ key, provider, purchaseTxnId: t.id, purchaseAmount: purchaseAmt, schedule, cadence, confidence: 0.7 });
  }

  return dedupe(plans);
}

function dedupe(plans: ProposedBnplPlan[]): ProposedBnplPlan[] {
  const seen = new Set<string>();
  return plans.filter(p => { if (seen.has(p.key)) return false; seen.add(p.key); return true; });
}
