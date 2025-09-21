import { goals } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { Target } from 'lucide-react';

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const goal = goals.find((g) => g.id === params.id);

  if (!goal) {
    notFound();
  }

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Target className="w-10 h-10 text-primary" />
          <div>
            <CardTitle className="font-headline text-3xl">{goal.name}</CardTitle>
            <CardDescription>
              Deadline: {format(new Date(goal.deadline), 'MMMM d, yyyy')} ({daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold font-headline">{formatCurrency(goal.currentAmount)}</span>
            <span className="text-sm text-muted-foreground"> of {formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} className="h-4" />
        </div>
        <p className="text-center text-muted-foreground">
            You are <span className="font-semibold text-primary">{Math.round(progress)}%</span> of the way to your goal!
        </p>
      </CardContent>
    </Card>
  );
}
