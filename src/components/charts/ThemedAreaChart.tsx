'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NoData from './NoData';

type Props<T extends object> = { data: T[]; xKey: keyof T; yKey: keyof T; height?: number | string; locale?: string; yFormatOptions?: Intl.NumberFormatOptions; };

function computeDomain<T extends Record<string, any>>(rows: T[], yKeys: (keyof T)[]) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  const norm = rows.map((r) => {
    const out: Record<string, number> = { ...r } as any;
    for (const k of yKeys) {
      const v = Number((r as any)[k]);
      if (Number.isFinite(v)) {
        out[k as string] = v;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    return out as T;
  });
  if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
    return { domain: [0, 1] as [number, number], normalized: [], empty: true };
  }
  const span = Math.max(1, max - min);
  const pad = Math.max(4, Math.round(span * 0.1));
  const lo = Math.min(0, Math.floor(min - pad));
  const hi = Math.max(0, Math.ceil(max + pad));
  return { domain: [lo, hi] as [number, number], normalized: norm, empty: false };
}

export default function ThemedAreaChart<T extends Record<string, any>>({ data, xKey, yKey, height = 280, locale, yFormatOptions }: Props<T>) {
  const fmt = new Intl.NumberFormat(locale, yFormatOptions);
  const { domain, normalized, empty } = computeDomain(data, [yKey]);
  
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {empty ? (
          <NoData />
        ) : (
          <AreaChart data={normalized} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
            <defs>
              <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`hsl(var(--chart-1))`} stopOpacity={0.35}/>
                <stop offset="95%" stopColor={`hsl(var(--chart-1))`} stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} minTickGap={24} />
            <YAxis domain={domain} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickFormatter={(n: any) => fmt.format(Number(n))} width={48} />
            <Tooltip contentStyle={{ background: 'hsl(var(--chart-bg))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--chart-fg))' }} labelStyle={{ color: 'hsl(var(--chart-fg))' }} cursor={{ stroke: 'hsl(var(--chart-axis-weak))', strokeDasharray: '4 4' }} formatter={(v: any) => fmt.format(Number(v))} />
            <Area type="monotone" dataKey={yKey as string} stroke={`hsl(var(--chart-1))`} fillOpacity={1} fill="url(#area1)" strokeWidth={2}/>
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
