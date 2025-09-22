import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/glass/GlassCard';
import ChartHost from '@/components/charts/ChartHost.client';

const ThemedAreaChart = dynamic(() => import('@/components/charts/ThemedAreaChart'), { ssr:false, loading: () => <div className="h-40 animate-pulse rounded"/> });

async function getTrend() {
  return [
    { m: 'Jan', net: 420 }, { m: 'Feb', net: 380 }, { m: 'Mar', net: 515 }, { m: 'Apr', net: 470 },
  ];
}

export default async function ReportsPage() {
  const trend = await getTrend();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <GlassCard title="Net Cashflow Trend">
        <ChartHost height={280}>
          <ThemedAreaChart data={trend} xKey="m" yKey="net"
            yFormatOptions={{style:'currency',currency:'USD',maximumFractionDigits:0}} />
        </ChartHost>
      </GlassCard>
    </main>
  );
}
