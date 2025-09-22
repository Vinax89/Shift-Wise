
'use client';
import * as React from 'react';
import { SmartLineChartPro } from '@/components/charts/ChartKitPro';
import { ChartControls } from '@/components/charts/ChartControls';
import { exportCsv } from '@/components/charts/exportCsv';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency } from '@/lib/format/number';

type Row = { month: string; income: number; outflow: number };
const demo: Row[] = [
  { month:'Jan', income: 2400, outflow: 2100 },
  { month:'Feb', income: 2300, outflow: 1900 },
  { month:'Mar', income: 2550, outflow: 2300 },
  { month:'Apr', income: 2600, outflow: 2400 },
  { month:'May', income: 2800, outflow: 2600 },
  { month:'Jun', income: 2750, outflow: 2550 },
];

export default function IncomeVsOutflow({ rows=demo }:{ rows?: Row[] }){
    const [smooth, setSmooth] = React.useState(true);
    const [vis, setVis] = React.useState({ income:true, outflow:true });
    const visibleKeys = (['income','outflow'] as const).filter(k=> vis[k]);

    return (
      <GlassCard title="Income vs. Outflow" action={
        <ChartControls 
            series={[{key:'income',label:'Income',visible:vis.income},{key:'outflow',label:'Outflow',visible:vis.outflow}]} 
            onToggle={(k)=>setVis(v=>({ ...v, [k]: !v[k as keyof typeof v] }))} 
            smooth={smooth} 
            onSmooth={setSmooth} 
            onExport={()=> exportCsv(rows)} 
        />
      }>
        <SmartLineChartPro data={rows} xKey="month" yKeys={visibleKeys as any} height={260} smooth={smooth}
        yFormatter={(n)=> fmtCurrency(n, 'USD')} />
      </GlassCard>
    );
}
