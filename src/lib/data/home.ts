export type TrendPoint = { month: string; inflow: number; outflow: number };
export async function getHomeTrend(): Promise<TrendPoint[]> {
  // TODO: expose a secured API in your Functions; here’s a placeholder shape
  return [ { month:'2025-06', inflow: 3400, outflow: -2800 }, { month:'2025-07', inflow: 3300, outflow: -2950 } ];
}
