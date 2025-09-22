
'use client';
import * as React from 'react';
import { SmartAreaChartPro } from '@/components/charts/ChartKitPro';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency } from '@/lib/format/number';

type Row = { month: string; spending: number };
const demo: Row[] = [
  { month:'Jan', spending: 980 },
  { month:'Feb', spending: 1040 },
  { month:'Mar', spending: 880 },
  { month:'Apr', spending: 1120 },
  { month:'May', spending: 1210 },
  { month:'Jun', spending: 990 },
];

export default function SpendingOverTime({ rows = demo }:{ rows?: Row[] }){
  return (
    <GlassCard title="Spending Over Time">
      <SmartAreaChartPro data={rows} xKey="month" yKeys={[ 'spending' ]} height={260}
        yFormatter={(n)=> fmtCurrency(n, 'USD')} />
    </GlassCard>
  );
}
