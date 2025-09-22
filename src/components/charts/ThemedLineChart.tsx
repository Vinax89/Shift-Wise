'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

type Props<T extends object> = {
  data: T[];
  xKey: keyof T;
  yKeys: (keyof T)[];
  height?: number | string;
  locale?: string;
  yFormatOptions?: Intl.NumberFormatOptions;
};

export default function ThemedLineChart<T extends Record<string, any>>({ data, xKey, yKeys, height = 280, locale, yFormatOptions }: Props<T>) {
  const fmt = new Intl.NumberFormat(locale, yFormatOptions);
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
          <XAxis dataKey={xKey as string} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} minTickGap={24} />
          <YAxis tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickFormatter={(n: any) => fmt.format(Number(n))} width={48} />
          <Tooltip contentStyle={{ background: 'hsl(var(--chart-bg))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--chart-fg))' }} labelStyle={{ color: 'hsl(var(--chart-fg))' }} cursor={{ stroke: 'hsl(var(--chart-axis-weak))', strokeDasharray: '4 4' }} formatter={(v: any) => fmt.format(Number(v))} />
          <ReferenceLine y={0} stroke="hsl(var(--chart-axis-weak))" />
          {yKeys.map((k, i) => (
            <Line key={String(k)} type="monotone" dataKey={k as string} stroke={`hsl(var(--chart-${(i % 5) + 1}))`} strokeWidth={2} dot={false} activeDot={{ r: 3, stroke: 'hsl(var(--chart-bg))', strokeWidth: 2 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
