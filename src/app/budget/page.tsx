import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/glass/GlassCard';
import Visible from '@/components/islands/Visible';

const ThemedBarChart = dynamic(() => import('@/components/charts/ThemedBarChart'), { ssr:false, loading: () => <div className="h-40 animate-pulse rounded"/> });

async function getBudgetBars() {
  // TODO: replace with Firestore/Functions; fallback demo
  return [
    { cat: 'Rent', spent: 1800, budget: 1800 },
    { cat: 'Groceries', spent: 520, budget: 600 },
    { cat: 'Transport', spent: 210, budget: 250 },
    { cat: 'Dining', spent: 320, budget: 300 },
  ];
}

export default async function BudgetPage() {
  const data = await getBudgetBars();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <GlassCard title="Budget Overview">
        <Visible height={280}>
          <ThemedBarChart data={data} xKey="cat" yKeys={["spent","budget"]}
            yFormatter={(n)=> new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)} />
        </Visible>
      </GlassCard>
      {/* TODO: add editable grid below (separate island) */}
    </main>
  );
}
