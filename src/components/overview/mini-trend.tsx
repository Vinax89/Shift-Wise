'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';

export function MiniTrend({ data, color }: { data: { label: string; value: number }[], color: string }) {
  return (
    <div className="h-10 w-24">
       <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Tooltip 
            content={<ChartTooltipContent 
                formatter={(value) => formatCurrency(value as number)} 
                hideLabel 
                hideIndicator
            />}
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, fill: 'transparent' }}
          />
          <Line type="monotone" dataKey="value" stroke={color} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
