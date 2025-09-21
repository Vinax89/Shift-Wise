import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import type { Goal } from '@/lib/types';
import { differenceInDays } from 'date-fns';
import { Target } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Target className="w-8 h-8 text-primary" />
        <div>
            <CardTitle className="font-headline">{goal.name}</CardTitle>
            <CardDescription>
                {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
          <p className="text-sm text-muted-foreground">
              You are <span className="font-semibold text-primary">{Math.round(progress)}%</span> of the way there!
          </p>
      </CardFooter>
    </Card>
  );
}
