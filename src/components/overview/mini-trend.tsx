
'use client';
import * as React from 'react';
import { SmartLineChartPro } from '@/components/charts/ChartKitPro';
import { GlassCard } from '../glass/GlassCard';
import { fmtCurrency, fmtInt } from '@/lib/format/number';

export type Point = { x: string; y: number };

export default function MiniTrend({ title="Net Savings", points=[{x:'W1',y:100},{x:'W2',y:80},{x:'W3',y:120},{x:'W4',y:90}], height=120, currency='USD' }:{ title?:string; points?:Point[]; height?:number; currency?:string; }){
  const latest = points[points.length-1]?.y || 0;
  const avg = points.reduce((a,p)=>a+p.y,0)/points.length;
  const change = latest - avg;
  
  return (
    <GlassCard title={title}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold">{fmtCurrency(latest, currency)}</div>
          <div className="text-xs text-muted">
            <span className={change > 0 ? 'text-success' : 'text-danger'}>
              {change > 0 ? '▲' : '▼'} {fmtCurrency(Math.abs(change), currency)} ({fmtInt((change/avg)*100)}%)
            </span> vs avg
          </div>
        </div>
        <div className="w-24 h-12 -mr-3 -mt-3">
          <SmartLineChartPro data={points} xKey="x" yKeys={[ 'y' ]} height={60} />
        </div>
      </div>
    </GlassCard>
  );
}
