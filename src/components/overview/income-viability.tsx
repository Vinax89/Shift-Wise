'use client';

import { formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { transactions } from '@/lib/data';

export function IncomeViability() {
  const grossIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Dummy data for taxes and cost of living
  const estimatedTaxes = grossIncome * 0.22;
  const costOfLiving = transactions
    .filter(t => t.category === 'Rent' || t.category === 'Utilities' || t.category === 'Groceries' || t.category === 'Transportation')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netIncome = grossIncome - estimatedTaxes - costOfLiving;

  const summaryItems = [
    {
      label: 'Gross Income',
      value: grossIncome,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Estimated Taxes',
      value: -estimatedTaxes,
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      label: 'Cost of Living',
      value: -costOfLiving,
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      label: 'Net Income',
      value: netIncome,
      icon: Wallet,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
          <div className={`p-3 rounded-full bg-muted ${item.color}`}>
            <item.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold font-headline">
              {formatCurrency(item.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
