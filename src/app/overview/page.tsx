import { getHomeTrend } from '@/lib/data/home';
import Visible from '@/components/islands/Visible';
import LineChartIsland from '@/components/charts/LineChartIsland';

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
          <Visible height={280}>
            <LineChartIsland data={trend} xKey="month" yKeys={["inflow","outflow"]} height={280}
              yFormatter={(n: number)=> new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)} />
          </Visible>
        </div>
      </section>
    </main>
  );
}
