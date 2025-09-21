import { getHomeTrend } from '@/lib/data/home';
import dynamic from 'next/dynamic';
import Visible from '@/components/islands/Visible';

const ThemedLineChart = dynamic(() => import('@/components/charts/themed-line-chart'), { ssr: false, loading: () => <div className="h-40 animate-pulse rounded"/> });

export default async function HomePage() {
  const trend = await getHomeTrend();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-6">
      <section className="glass rounded-2xl p-4">
        <header className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold font-headline">Overview</h1>
        </header>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">Net This Month</div>
            <div className="text-2xl font-semibold font-headline">${(trend.at(-1)?.inflow ?? 0) + (trend.at(-1)?.outflow ?? 0)}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">Inflow</div>
            <div className="text-2xl font-semibold font-headline">${trend.at(-1)?.inflow ?? 0}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">Outflow</div>
            <div className="text-2xl font-semibold font-headline">${Math.abs(trend.at(-1)?.outflow ?? 0)}</div>
          </div>
        </div>
        <div className="mt-4">
          <Visible height={280}>
            <ThemedLineChart data={trend} xKey="month" yKeys={["inflow","outflow"]} height={280}
              yFormatter={(n)=> new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)} />
          </Visible>
        </div>
      </section>
    </main>
  );
}
