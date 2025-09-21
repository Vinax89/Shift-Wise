'use client';

import { useMemo } from 'react';
import { transactions } from '@/lib/data';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { FluidAreaTrend, type TrendPoint } from './fluid-area-trend';

export function CashFlowTrend() {
  const chartData: TrendPoint[] = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    const dateInterval = eachDayOfInterval({ start, end });

    const dailyData = dateInterval.reduce((acc, date) => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      acc[formattedDate] = { income: 0, expense: 0 };
      return acc;
    }, {} as { [key: string]: { income: number; expense: number } });

    transactions.forEach((t) => {
      if (new Date(t.date) >= start) {
        const formattedDate = format(new Date(t.date), 'yyyy-MM-dd');
        if (dailyData[formattedDate]) {
          if (t.type === 'income') {
            dailyData[formattedDate].income += t.amount;
          } else {
            dailyData[formattedDate].expense += Math.abs(t.amount);
          }
        }
      }
    });
    
    // Create two series: one for income and one for expenses
    const incomeSeries: TrendPoint[] = Object.entries(dailyData).map(([date, values]) => ({
      x: new Date(date),
      y: values.income,
    }));
    
    const expenseSeries: TrendPoint[] = Object.entries(dailyData).map(([date, values]) => ({
        x: new Date(date),
        y: values.expense,
      }));

    // For this example, we'll just show expenses.
    // A more advanced chart could show both.
    return expenseSeries;

  }, []);

  return (
      <FluidAreaTrend data={chartData} aspect={21/9} minHeight={300} stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" />
  );
}
