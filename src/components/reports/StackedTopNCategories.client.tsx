'use client';
import * as React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Brush } from 'recharts';
import { useRangeSync } from '@/components/charts/RangeSyncContext';

// Demo data: months x categories
const cats = ['Rent','Groceries','Dining','Transport','Utilities','Subscriptions','Misc'] as const;
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const demo = months.map((m, i)=>{
  const base = 500 + i*10; return {
    month: m,
    Rent: 1200,
    Groceries: 320 + (i%3)*20,
    Dining: 180 + (i%2)*30,
    Transport: 140 + (i%4)*15,
    Utilities: 110 + (i%5)*5,
    Subscriptions: 70 + (i%6)*4,
    Misc: Math.max(0, base - 120)
  };
});

type Row = typeof demo[number];

function topNKeys(rows:Row[], N=5){
  const totals: Record<string, number> = {};
  rows.forEach(r=> cats.forEach(c=> totals[c] = (totals[c]||0) + (r as any)[c]));
  return Object.entries(totals).sort((a,b)=> b[1]-a[1]).slice(0,N).map(([k])=>k);
}

export default function StackedTopNCategories({ rows=demo, N=5, rangeChannel='stacked' }:{ rows?: Row[]; N?: number; rangeChannel?: string }){
  const keys = topNKeys(rows, N);
  const [shared, setShared] = useRangeSync(rangeChannel);
  return (
    <div className="glass rounded-xl p-3" style={{ minHeight: 300 }}>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top:8,right:12,bottom:8,left:12 }}>
            <CartesianGrid strokeOpacity={0.08} vertical={false} />
            <XAxis dataKey="month" minTickGap={20} tickMargin={8} />
            <YAxis width={56} tickMargin={6} />
            {keys.map((k, i)=> (
              <Area key={k} type="monotone" dataKey={k} stackId="1" stroke="currentColor" fill={`url(#g${(i%2)+1})`} isAnimationActive={false} />
            ))}
            <Brush travellerWidth={8} height={18} stroke="currentColor" onChange={(r:any)=> setShared([r?.startIndex, r?.endIndex])} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
