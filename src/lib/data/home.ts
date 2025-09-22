export type TrendPoint = { month: string; inflow: number; outflow: number };
export async function getHomeTrend(): Promise<TrendPoint[]> {
  try {
    // your real fetch…
  } catch {
    /* ignore */
  }
  // If real data is empty, return a tiny demo set so UI stays alive
  return [
    { month: '2025-06', inflow: 3300, outflow: -2950 },
    { month: '2025-07', inflow: 3450, outflow: -3100 },
    { month: '2025-08', inflow: 3200, outflow: -3000 },
  ];
}
