'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import NoData from './NoData';

type Props<T extends object> = {
  data: T[];
  xKey: keyof T;
  yKeys: (keyof T)[];
  height?: number | string;
  locale?: string;
  yFormatOptions?: Intl.NumberFormatOptions;
};

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
    // nothing numeric
    return { domain: [0, 1] as [number, number], normalized: [], empty: true };
  }
  // pad 10% so lines aren’t glued to edges; always include 0 so mixed sign charts show baseline
  const span = Math.max(1, max - min);
  const pad = Math.max(4, Math.round(span * 0.1));
  const lo = Math.min(0, Math.floor(min - pad));
  const hi = Math.max(0, Math.ceil(max + pad));
  return { domain: [lo, hi] as [number, number], normalized: norm, empty: false };
}

export default function ThemedLineChart<T extends Record<string, any>>({
  data,
  xKey,
  yKeys,
  height = 280,
  locale,
  yFormatOptions,
}: Props<T>) {
  const fmt = new Intl.NumberFormat(locale, yFormatOptions);
  const { domain, normalized, empty } = computeDomain(data, yKeys);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {empty ? (
          <NoData />
        ) : (
          <LineChart data={normalized} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
            <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey as string}
              tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }}
              tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }}
              minTickGap={24}
            />
            <YAxis
              domain={domain}
              tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }}
              tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }}
              tickFormatter={(n: any) => fmt.format(Number(n))}
              width={56}
            />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--chart-bg))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--chart-fg))' }}
              labelStyle={{ color: 'hsl(var(--chart-fg))' }}
              cursor={{ stroke: 'hsl(var(--chart-axis-weak))', strokeDasharray: '4 4' }}
              formatter={(v: any) => fmt.format(Number(v))}
            />
            <ReferenceLine y={0} stroke="hsl(var(--chart-axis-weak))" />
            {yKeys.map((k, i) => (
              <Line
                key={String(k)}
                type="monotone"
                dataKey={k as string}
                stroke={`hsl(var(--chart-${(i % 5) + 1}))`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, stroke: 'hsl(var(--chart-bg))', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
