import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CashFlowTrend } from '@/components/overview/cash-flow-trend';
import { CategorySpendChart } from '@/components/overview/category-spend-chart';
import { SavingsGoalsProgress } from '@/components/overview/savings-goals-progress';
import { RecentTransactions } from '@/components/overview/recent-transactions';
import { IncomeViability } from '@/components/overview/income-viability';

export default function OverviewPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Income Viability</CardTitle>
            <CardDescription>
              A summary of your gross income, estimated taxes, and cost of living.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeViability />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2 glass rounded-2xl p-6">
        <CashFlowTrend />
      </div>

      <div className="lg:col-span-2 glass rounded-2xl p-6">
        <CategorySpendChart />
      </div>
      
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Savings Goals</CardTitle>
            <CardDescription>
              Track your progress towards your financial goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SavingsGoalsProgress />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
