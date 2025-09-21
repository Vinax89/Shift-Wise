import { Progress } from '@/components/ui/progress';
import { goals } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';

export function SavingsGoalsProgress() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

        return (
          <div key={goal.id} className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-medium">{goal.name}</h4>
              <span className="text-sm text-muted-foreground">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
              </span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">
                {formatCurrency(goal.currentAmount)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
