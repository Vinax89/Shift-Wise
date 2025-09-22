
'use client';
import * as React from 'react';
import { SmartLineChartPro } from '@/components/charts/ChartKitPro';
import { ChartControls } from '@/components/charts/ChartControls';
import { exportCsv } from '@/components/charts/exportCsv';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency } from '@/lib/format/number';

export type Point = { t: number; month: string; inflow: number; outflow: number };
const demo: Point[] = [ '2025-01','2025-02','2025-03','2025-04','2025-05','2025-06' ].map((m,i)=>({
  t: Date.parse(m+'-01'), month: m.slice(5), inflow: 2200 + i*120 + (i%2? 60:-40), outflow: 1900 + i*110
}));

export default function CashFlowTrend({ points=demo }: { points?: Point[] }){
  const [smooth, setSmooth] = React.useState(true);
  const [vis, setVis] = React.useState({ inflow:true, outflow:true });
  const visibleKeys = (['inflow','outflow'] as const).filter(k=> (vis as any)[k]);
  return (
    <GlassCard title="Cash Flow" action={
      <ChartControls 
        series={[{key:'inflow',label:'Inflow',visible:vis.inflow},{key:'outflow',label:'Outflow',visible:vis.outflow}]} 
        onToggle={(k)=>setVis(v=>({ ...v, [k]: !v[k as keyof typeof v] }))} 
        smooth={smooth} onSmooth={setSmooth} 
        onExport={()=> exportCsv(points)} 
        ranges={[]}
      />
    }>
      <SmartLineChartPro data={points} xKey={'month'} yKeys={visibleKeys as any} height={280} smooth={smooth}
        yFormatter={(n)=> fmtCurrency(n, 'USD')} />
    </GlassCard>
  );
}
