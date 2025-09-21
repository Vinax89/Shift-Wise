'use client';

import { useMemo } from 'react';
import { transactions } from '@/lib/data';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import ThemedLineChart from '../charts/themed-line-chart';
import { formatCurrency } from '@/lib/utils';

export function CashFlowTrend() {
  const chartData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    const dateInterval = eachDayOfInterval({ start, end });

    const dailyData = dateInterval.map(date => {
      const formattedDate = format(date, 'MMM d');
      const dailyTransactions = transactions.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      
      const income = dailyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = dailyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return { date: formattedDate, income, expense };
    });

    return dailyData;
  }, []);

  return (
    <ThemedLineChart
      data={chartData}
      xKey="date"
      yKeys={[{key: 'income', name: "Income"}, {key: 'expense', name: "Expenses"}]}
      height={300}
      yFormatter={(n) => {
          if (n > 1000) return `${formatCurrency(n/1000)}k`;
          return formatCurrency(n);
      }}
      title="Cash Flow"
    />
  );
}
