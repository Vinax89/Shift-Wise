'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

// --- Types ---
export type TrendPoint = {
  x: string | number | Date; // label or timestamp
  y: number;
};

type FluidChartProps = {
  data: TrendPoint[];
  className?: string;
  aspect?: number;     // width / height, e.g. 16/9
  minHeight?: number;  // px fallback before first measure
  stroke?: string;     // CSS color for line
  fill?: string;       // CSS color for area base
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

function useContainerSize<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const ro = new ResizeObserver(([entry]) => {
      // rAF to avoid layout thrash during continuous resizing
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { width, height } = entry.contentRect;
        setSize((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width: Math.round(width), height: Math.round(height) }
        );
      });
    });
    ro.observe(ref.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return { ref, ...size };
}

// --- Component ---
export function FluidAreaTrend({
  data,
  className,
  aspect = 16 / 9,
  minHeight = 220,
  stroke = 'hsl(var(--chart-1))',
  fill = 'hsl(var(--chart-1))',
  showGrid = true,
}: FluidChartProps) {
  const { ref, width } = useContainerSize<HTMLDivElement>();
  const height = React.useMemo(
    () => Math.max(minHeight, width ? Math.round(width / aspect) : minHeight),
    [width, aspect, minHeight]
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const gradId = React.useId();

  // Normalize x labels (keep it lightweight)
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

  return (
    <div
      ref={ref}
      className={['w-full', className]
        .filter(Boolean)
        .join(' ')}
      style={{ minHeight }}
      aria-label="Trend chart"
      role="img"
    >
      {width <= 0 ? (
        // Skeleton while measuring
        <div className="h-full w-full animate-pulse rounded-xl bg-muted" style={{ height }}/>
      ) : (
        <AreaChart
          width={width}
          height={height}
          data={chartData}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            {/* Soft gradient that respects theme color */}
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
              borderRadius: 12,
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'hsl(var(--background))',
            }}
            labelStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
            formatter={(v: number) =>
              [formatCurrency(v), undefined]
            }
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
      )}
    </div>
  );
}
