'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import NoData from './NoData';

type Props<T extends object> = { data: T[]; xKey: keyof T; yKeys: (keyof T)[]; height?: number | string; locale?: string; yFormatOptions?: Intl.NumberFormatOptions; };

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

export default function ThemedBarChart<T extends Record<string, any>>({ data, xKey, yKeys, height = 280, locale, yFormatOptions }: Props<T>) {
  const fmt = new Intl.NumberFormat(locale, yFormatOptions);
  const { domain, normalized, empty } = computeDomain(data, yKeys);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {empty ? (
          <NoData />
        ) : (
          <BarChart data={normalized} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
            <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} minTickGap={24} />
            <YAxis domain={domain} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickFormatter={(n: any) => fmt.format(Number(n))} width={48} />
            <Tooltip contentStyle={{ background: 'hsl(var(--chart-bg))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--chart-fg))' }} labelStyle={{ color: 'hsl(var(--chart-fg))' }} cursor={{ fill: 'hsl(var(--chart-grid) / 0.12)' }} formatter={(v: any) => fmt.format(Number(v))} />
            <ReferenceLine y={0} stroke="hsl(var(--chart-axis-weak))" />
            {yKeys.map((k, i) => (
              <Bar key={String(k)} dataKey={k as string} fill={`hsl(var(--chart-${(i % 5) + 1}))`} radius={[8,8,0,0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
