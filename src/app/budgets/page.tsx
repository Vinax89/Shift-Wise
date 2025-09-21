'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { transactions } from '@/lib/data';

type PaySchedule = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

const budgetSummary = {
  income: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) / 2, // Assuming biweekly
  spent: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0) / 2,
  remaining: 0
};
budgetSummary.remaining = budgetSummary.income - budgetSummary.spent;

export default function BudgetsPage() {
  const [paySchedule, setPaySchedule] = useState<PaySchedule>('biweekly');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Paycheck-Aligned Budgeting</CardTitle>
          <CardDescription>
            Align your budget with your pay cycle to better manage your irregular income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-2">
            <Label htmlFor="pay-schedule">Select Your Pay Schedule</Label>
            <Select value={paySchedule} onValueChange={(value) => setPaySchedule(value as PaySchedule)}>
              <SelectTrigger id="pay-schedule" className="w-[280px]">
                <SelectValue placeholder="Select a schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly (every 2 weeks)</SelectItem>
                <SelectItem value="semimonthly">Semi-monthly (twice a month)</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">Current Budget Period</CardTitle>
              <CardDescription>A summary of your income and spending for this pay period.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                      <p className="text-sm text-muted-foreground">Budgeted Income</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(budgetSummary.income)}</p>
                  </div>
                   <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-2xl font-bold">{formatCurrency(budgetSummary.spent)}</p>
                  </div>
                   <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(budgetSummary.remaining)}</p>
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
