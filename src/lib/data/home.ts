export type TrendPoint = { month: string; inflow: number; outflow: number };
export async function getHomeTrend(): Promise<TrendPoint[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? ''}/api/trend`, { next: { revalidate: 300, tags: ['trend'] } });
    if (!res.ok) throw new Error('bad');
    return (await res.json()) as TrendPoint[];
  } catch {
    // Fallback stub so page renders even without API
    return [
      { month: 'Jan', inflow: 3200, outflow: -2800 },
      { month: 'Feb', inflow: 3400, outflow: -2950 },
      { month: 'Mar', inflow: 3100, outflow: -3000 },
    ];
  }
}
