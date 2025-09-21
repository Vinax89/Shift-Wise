'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { formatCurrency } from '@/lib/utils';

type Props<T extends object> = {
  data: T[];
  xKey: keyof T;
  yKeys: Array<keyof T | { key: keyof T, name: string }>;
  height?: number | string;
  yFormatter?: (n: number) => string;
  title?: string;
};

export default function ThemedLineChart<T extends Record<string, any>>({ 
  data, xKey, yKeys, height = 280, yFormatter = (n) => formatCurrency(n), title 
}: Props<T>) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    if (!isClient) {
        return (
            <div className="p-3" style={{ height }}>
                {title && <div className="text-sm text-muted-foreground mb-2">{title}</div>}
                <Skeleton className="w-full h-[calc(100%-1.75rem)]" />
            </div>
        );
    }
  
  return (
     <div className="p-3">
       {title && <div className="text-sm text-muted-foreground mb-2">{title}</div>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
            <CartesianGrid stroke={`hsl(var(--chart-grid) / 0.35)`} strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} minTickGap={24} />
            <YAxis tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickLine={{ stroke: 'hsl(var(--chart-axis-weak))' }} tickFormatter={yFormatter} width={48} />
            <Tooltip 
                contentStyle={{
                    background: 'hsl(var(--chart-bg))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--chart-fg))',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px hsl(var(--shadow)/0.1), 0 2px 4px -2px hsl(var(--shadow)/0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--chart-fg))', fontWeight: 'bold' }}
                cursor={{ stroke: 'hsl(var(--chart-axis-weak))', strokeDasharray: '4 4' }}
                formatter={(value: number, name: string) => [yFormatter(value), name]}
            />
            <ReferenceLine y={0} stroke="hsl(var(--chart-axis-weak))" strokeDasharray="2 4" />
            {yKeys.map((k, i) => {
                const key = typeof k === 'object' ? k.key : k;
                const name = typeof k === 'object' ? k.name : String(k);
                return (
                <Line 
                    key={String(key)}
                    name={name}
                    type="monotone" 
                    dataKey={key as string} 
                    stroke={`hsl(var(--chart-${(i % 5) + 1}))`} 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 4, stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
                    isAnimationActive={false} 
                />
                )
            })}
            </LineChart>
        </ResponsiveContainer>
        </div>
    </div>
  );
}
