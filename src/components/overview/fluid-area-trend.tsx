'use client';
import * as React from 'react';
import ChartFrame from '@/components/charts/ChartFrame.client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export type Point = { x: string; a: number; b: number };
export default function FluidAreaTrend({ points = [] as Point[] }) {
  return (
    <div className="glass rounded-xl p-3">
      <h3 className="mb-2 text-base font-semibold text-base">Trends</h3>
      <ChartFrame height={260}>
        {({ width, height }) => (
          <AreaChart width={width} height={height} data={points} margin={{ top: 10, right: 12, left: 12, bottom: 8 }}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ch-1)" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="var(--ch-1)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ch-2)" stopOpacity={0.45}/>
                <stop offset="95%" stopColor="var(--ch-2)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tickMargin={6} />
            <YAxis />
            <Tooltip contentStyle={{ background: 'rgba(10,10,16,0.9)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12 }} />
            <Area type="monotone" dataKey="a" stroke="var(--ch-1)" fill="url(#ga)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="b" stroke="var(--ch-2)" fill="url(#gb)" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        )}
      </ChartFrame>
    </div>
  );
}
