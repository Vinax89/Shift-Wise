import { getHomeTrend } from '@/lib/data/home';
import { CashFlowTrend } from '@/components/overview/cash-flow-trend';
import { RecentTransactions } from '@/components/overview/recent-transactions';
import { CategorySpendChart } from '@/components/overview/category-spend-chart';
import { IncomeViability } from '@/components/overview/income-viability';
import { SavingsGoalsProgress } from '@/components/overview/savings-goals-progress';

export default async function OverviewPage() {
  const trend = await getHomeTrend();
  return (
    <main className="space-y-6">
      <IncomeViability />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-4 h-full">
             <CashFlowTrend data={trend} />
          </div>
        </div>
        <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4 h-full">
                <CategorySpendChart />
            </div>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-4 h-full">
             <h3 className="text-lg font-semibold font-headline mb-4">Savings Goals</h3>
             <SavingsGoalsProgress />
          </div>
        </div>
        <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4 h-full">
                <h3 className="text-lg font-semibold font-headline mb-4">Recent Transactions</h3>
                <RecentTransactions />
            </div>
        </div>
      </div>

    </main>
  );
}
