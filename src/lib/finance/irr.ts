// packages/shared/finance/irr.ts
// Robust IRR + APR helpers (TypeScript, no deps)

export type CashFlow = { t: number; v: number }; // t in periods (e.g., 0,1,2...), v positive=inflow to user

function npv(rate: number, flows: CashFlow[]): number {
  let s = 0;
  for (const { t, v } of flows) s += v / Math.pow(1 + rate, t);
  return s;
}

function dnpv(rate: number, flows: CashFlow[]): number {
  let s = 0;
  for (const { t, v } of flows) if (t !== 0) s += (-t * v) / Math.pow(1 + rate, t + 1);
  return s;
}

export function irr(
  flows: CashFlow[],
  opts: { guess?: number; maxIter?: number; tol?: number; lo?: number; hi?: number } = {}
): number {
  if (!flows.length) throw new Error('irr: empty cashflows');
  const { guess = 0.1, maxIter = 100, tol = 1e-7, lo = -0.9, hi = 10 } = opts;

  // Quick return if NPV(0) ≈ 0
  const npv0 = npv(0, flows);
  if (Math.abs(npv0) < tol) return 0;

  // 1) Bracket a root in [lo, hi]
  let a = lo, b = hi;
  let fa = npv(a, flows);
  let fb = npv(b, flows);
  if (fa * fb > 0) {
    // Scan for a sign change
    const steps = 64;
    let prevR = a, prevF = fa;
    for (let i = 1; i <= steps; i++) {
      const r = a + ((b - a) * i) / steps;
      const f = npv(r, flows);
      if (prevF * f <= 0) { a = prevR; b = r; fa = prevF; fb = f; break; }
      prevR = r; prevF = f;
      if (i === steps) throw new Error('irr: failed to bracket root');
    }
  }

  // 2) Hybrid Newton–Bisection
  let x = Math.min(Math.max(guess, a), b);
  let fx = npv(x, flows);
  for (let i = 0; i < maxIter; i++) {
    const d = dnpv(x, flows);
    let step = fx / (d !== 0 ? d : 1e-9);
    let xn = x - step; // Newton step
    if (!(xn > a && xn < b)) xn = (a + b) / 2; // fall back to bisection
    const fn = npv(xn, flows);
    // Shrink bracket
    if (fa * fn <= 0) { b = xn; fb = fn; } else { a = xn; fa = fn; }
    x = xn; fx = fn;
    if (Math.abs(fx) < tol || Math.abs(b - a) < tol) return x;
  }
  throw new Error('irr: did not converge');
}

export function aprFromBnpl(
  amount: number, // purchase amount (>0)
  fee: number,    // upfront or total fees (>0 paid by user)
  installments: number[], // positive numbers user pays each period
  cadencePerYear: number // e.g., 26 for biweekly, 12 monthly
): number {
  const flows: CashFlow[] = [{ t: 0, v: amount - fee }];
  installments.forEach((p, i) => flows.push({ t: i + 1, v: -Math.abs(p) }));
  if (fee === 0 && installments.reduce((a, b) => a + b, 0) === amount) return 0; // 0% BNPL
  const r = irr(flows, { guess: 0.1 });
  return Math.pow(1 + r, cadencePerYear) - 1;
}

export function aprFromStatementInterest(interest: number, avgDailyBalance: number, cycleDays: number): number {
  if (avgDailyBalance <= 0 || cycleDays <= 0) return 0;
  const periodic = interest / avgDailyBalance; // per-cycle rate
  return periodic * (365 / cycleDays); // simple annualized estimate
}

export function aprFromLoan(P: number, N: number, A: number): number {
  // Solve for monthly r in A = P * (1 - (1+r)^-N)/r
  const f = (r: number) => P * (1 - Math.pow(1 + r, -N)) / r - A;
  let lo = 0, hi = 1; // 0..100%/month
  let flo = f(lo), fhi = f(hi);
  if (flo * fhi > 0) throw new Error('loan APR: cannot bracket');
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2; const fm = f(mid);
    if (Math.abs(fm) < 1e-8) return mid * 12; // nominal APR
    if (flo * fm <= 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return ((lo + hi) / 2) * 12;
}
