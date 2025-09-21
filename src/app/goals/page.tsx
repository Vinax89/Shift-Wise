import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GoalCard } from '@/components/goals/goal-card';
import { goals } from '@/lib/data';

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">
            Set and track your financial goals to build a better future.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
