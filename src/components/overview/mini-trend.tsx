'use client';

import { LineChart, Line, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';

export function MiniTrend({ data, color }: { data: { label: string; value: number }[], color: string }) {
  return (
    <div className="h-10 w-24">
       <ChartContainer config={{}} className="w-full h-full">
         <LineChart 
          width={96} 
          height={40} 
          data={data} 
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
         >
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
       </ChartContainer>
    </div>
  );
}
