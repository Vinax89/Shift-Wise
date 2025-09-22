import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/glass/GlassCard';
import Visible from '@/components/islands/Visible';

const ThemedBarChart = dynamic(() => import('@/components/charts/ThemedBarChart'), { ssr:false, loading: () => <div className="h-40 animate-pulse rounded"/> });
const BudgetGrid = dynamic(() => import('@/components/budget/BudgetGrid.client'), { ssr:false });

async function getBudgetBars() {
  // TODO: replace with Firestore/Functions; fallback demo
  return [
    { cat: 'Rent', spent: 1800, budget: 1800 },
    { cat: 'Groceries', spent: 520, budget: 600 },
    { cat: 'Transport', spent: 210, budget: 250 },
    { cat: 'Dining', spent: 320, budget: 300 },
  ];
}

async function getBudget(){
  return [
    { id:'b1', envelope:'Rent', planned:1800, spent:1800, remaining:0 },
    { id:'b2', envelope:'Groceries', planned:600, spent:520, remaining:80 },
    { id:'b3', envelope:'Transport', planned:250, spent:210, remaining:40 },
    { id:'b4', envelope:'Dining', planned:300, spent:320, remaining:-20 },
  ];
}

export default async function BudgetPage() {
  const data = await getBudgetBars();
  const rows = await getBudget();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <GlassCard title="Budget Overview">
        <Visible height={280}>
          <ThemedBarChart data={data} xKey="cat" yKeys={["spent","budget"]}
            yFormatOptions={{style:'currency',currency:'USD',maximumFractionDigits:0}} />
        </Visible>
      </GlassCard>
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Planner</h2>
        </header>
        <BudgetGrid rows={rows} onChange={(next)=>{/* server action save */}} />
      </section>
    </main>
  );
}
