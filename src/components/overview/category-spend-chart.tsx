
'use client';
import * as React from 'react';
import { SmartBarChartPro } from '@/components/charts/ChartKitPro';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency } from '@/lib/format/number';

export type Row = { category: string; spent: number };
const demo: Row[] = [ {category:'Groceries',spent:420},{category:'Dining',spent:180},{category:'Transport',spent:140},{category:'Utilities',spent:95},{category:'Subscriptions',spent:62} ];
export default function CategorySpendChart({ rows=demo }: { rows?: Row[] }){
  return (
    <GlassCard title="Spending by Category">
      <SmartBarChartPro data={rows} xKey={'category'} yKey={'spent'} height={280}
        yFormatter={(n)=> fmtCurrency(n, 'USD')} />
    </GlassCard>
  );
}
