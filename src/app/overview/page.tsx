import { getHomeTrend } from '@/lib/data/home';
import LineChartIsland from '@/components/charts/LineChartIsland';
import ChartHost from '@/components/charts/ChartHost.client';

export default async function HomePage() {
  const trend = await getHomeTrend();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-6">
      <section className="glass rounded-2xl p-4">
        <header className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Overview</h1>
        </header>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-fg">Net This Month</div>
            <div className="text-2xl font-semibold">${(trend.at(-1)?.inflow ?? 0) + (trend.at(-1)?.outflow ?? 0)}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-fg">Inflow</div>
            <div className="text-2xl font-semibold">${trend.at(-1)?.inflow ?? 0}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-fg">Outflow</div>
            <div className="text-2xl font-semibold">${Math.abs(trend.at(-1)?.outflow ?? 0)}</div>
          </div>
        </div>
        <div className="mt-4">
          <ChartHost height={280}>
            <LineChartIsland data={trend} xKey="month" yKeys={["inflow","outflow"]}
              locale={undefined} yFormatOptions={{ style:'currency', currency:'USD', maximumFractionDigits:0 }} />
          </ChartHost>
        </div>
      </section>
    </main>
  );
}
