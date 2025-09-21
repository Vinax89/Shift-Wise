'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { transactions } from '@/lib/data';
import { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { format, subDays } from 'date-fns';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-2))',
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--chart-1))',
  },
};

export function IncomeExpenseChart() {
  const chartData = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const dailyData: { [key: string]: { income: number; expense: number } } = {};

    for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), i), 'MMM d');
        dailyData[date] = { income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      if (transactionDate >= thirtyDaysAgo) {
        const date = format(transactionDate, 'MMM d');
        if (t.type === 'income') {
          dailyData[date].income += t.amount;
        } else {
          dailyData[date].expense += Math.abs(t.amount);
        }
      }
    });
    
    return Object.entries(dailyData).map(([date, values]) => ({
        date,
        ...values
    })).reverse();
  }, []);

  return (
    <div className="w-full h-80">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={chartData} accessibilityLayer>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(value, name) => `${chartConfig[name as keyof typeof chartConfig].label}: ${formatCurrency(value as number)}`} />}
          />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
