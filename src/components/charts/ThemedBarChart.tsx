'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type Props<T extends object> = { data: T[]; xKey: keyof T; yKeys: (keyof T)[]; height?: number | string; yFormatter?: (n: number) => string };
export default function ThemedBarChart<T extends Record<string, any>>({ data, xKey, yKeys, height = 280, yFormatter }: Props<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
          <XAxis dataKey={xKey as string} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} minTickGap={24} />
          <YAxis tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickFormatter={yFormatter} width={48} />
          <Tooltip contentStyle={{ background: 'hsl(var(--chart-bg))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--chart-fg))' }} labelStyle={{ color: 'hsl(var(--chart-fg))' }} cursor={{ fill: 'hsl(var(--chart-grid) / 0.12)' }} />
          <ReferenceLine y={0} stroke="hsl(var(--chart-axis-weak))" />
          {yKeys.map((k, i) => (
            <Bar key={String(k)} dataKey={k as string} fill={`hsl(var(--chart-${(i % 5) + 1}))`} radius={[8,8,0,0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
