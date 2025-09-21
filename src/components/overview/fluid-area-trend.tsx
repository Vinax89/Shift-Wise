'use client';

import * as React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

// --- Types ---
export type TrendPoint = {
  x: string | number | Date; // label or timestamp
  y: number;
};

type FluidChartProps = {
  data: TrendPoint[];
  className?: string;
  aspect?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  showGrid?: boolean;
};

// --- Hooks ---
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches);
    setPrefers(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  return prefers;
}

// --- Component ---
export function FluidAreaTrend({
  data,
  className,
  aspect = 16 / 9,
  height = 220,
  stroke = 'hsl(var(--chart-1))',
  fill = 'hsl(var(--chart-1))',
  showGrid = true,
}: FluidChartProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  const prefersReducedMotion = usePrefersReducedMotion();
  const gradId = React.useId();

  const chartData = React.useMemo(
    () =>
      data.map((d) => ({
        x:
          d.x instanceof Date
            ? d.x.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : String(d.x),
        y: d.y,
      })),
    [data]
  );
  
  if (!isClient) {
    return <Skeleton className="w-full h-full" style={{height}} />
  }

  return (
    <div
      className={['w-full', className].filter(Boolean).join(' ')}
      style={{ height }}
      aria-label="Trend chart"
      role="img"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity={0.28} />
              <stop offset="85%" stopColor={fill} stopOpacity={0.04} />
              <stop offset="100%" stopColor={fill} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid vertical={false} stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="4 4"/>
          )}

          <XAxis
            dataKey="x"
            tickMargin={12}
            axisLine={false}
            tickLine={false}
            minTickGap={32}
            fontSize={12}
            tick={{ fill: 'hsl(var(--chart-axis))' }}
          />
          <YAxis
            dataKey="y"
            width={48}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            fontSize={12}
            tick={{ fill: 'hsl(var(--chart-axis))' }}
            tickFormatter={(v) => Intl.NumberFormat(undefined, { notation: 'compact' }).format(v as number)}
          />

          <Tooltip
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            contentStyle={{
              background: 'hsl(var(--chart-bg))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--chart-fg))',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px hsl(var(--shadow)/0.1), 0 2px 4px -2px hsl(var(--shadow)/0.1)'
            }}
            labelStyle={{ color: 'hsl(var(--chart-fg))', fontWeight: 'bold' }}
            formatter={(v: number) => [formatCurrency(v), undefined]}
          />

          <Area
            type="monotone"
            dataKey="y"
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={600}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
