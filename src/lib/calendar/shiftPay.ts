export type ShiftInput = {
  hours: number;                // computed from start/end or entered
  hourlyRate: number;
  incentive?: number;           // flat per shift
  premiumPct?: number;          // e.g., 15 for 15%
  differentials?: { label: string; hours: number; pct: number }[]; // night/weekend diffs
};

export function computeShiftPay(s: ShiftInput) {
  const base = s.hours * s.hourlyRate;
  const incentive = s.incentive ?? 0;
  const premium = (s.premiumPct ?? 0) / 100 * base;
  const diffs = (s.differentials ?? []).reduce((sum, d) => sum + d.hours * s.hourlyRate * (d.pct / 100), 0);
  const gross = Math.round((base + incentive + premium + diffs) * 100) / 100;
  return { base, incentive, premium, diffs, gross };
}
