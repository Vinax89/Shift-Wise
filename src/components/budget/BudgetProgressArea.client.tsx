
'use client';
import * as React from 'react';
import { SmartAreaChartPro } from '@/components/charts/ChartKitPro';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency } from '@/lib/format/number';

type Row = { day: string; spent: number; budget: number };
const demo: Row[] = Array.from({length: 30}, (_,i)=>({
  day: String(i+1).padStart(2,'0'),
  spent: Math.max(0, Math.round((i+1) * 15 + (Math.sin(i/3)*10))),
  budget: Math.round((i+1) * 20),
}));

export default function BudgetProgressArea({ rows=demo }:{ rows?: Row[] }){
  return (
    <GlassCard title="Period Progress">
      <SmartAreaChartPro data={rows} xKey="day" yKeys={[ 'spent','budget' ]} height={240}
        yFormatter={(n)=> fmtCurrency(n, 'USD')} />
    </GlassCard>
  );
}
