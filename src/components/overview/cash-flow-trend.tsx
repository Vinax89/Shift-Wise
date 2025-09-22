'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { transactions } from '@/lib/data';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { TrendPoint } from '@/lib/data/home';

const ThemedLineChart = dynamic(() => import('../charts/themed-line-chart'), { 
  ssr: false, 
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-muted" /> 
});

export function CashFlowTrend({ data }: { data: TrendPoint[] }) {

  return (
    <ThemedLineChart
      data={data}
      xKey="month"
      yKeys={[{key: 'inflow', name: "Inflow"}, {key: 'outflow', name: "Outflow"}]}
      height={320}
      yFormatter={(n) => {
          if (n > 1000) return `${formatCurrency(n/1000)}k`;
          return formatCurrency(n);
      }}
      title="Cash Flow"
    />
  );
}
