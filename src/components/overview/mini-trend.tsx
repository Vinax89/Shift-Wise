'use client';

import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";

export function MiniTrend({ data, color }: { data: { label: string; value: number }[], color: string }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);

  if (!isClient) {
    return <Skeleton className="h-10 w-24" />
  }

  return (
    <div className="h-10 w-24">
       <ChartContainer config={{}} className="w-full h-full">
         <ResponsiveContainer>
           <LineChart 
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
         </ResponsiveContainer>
       </ChartContainer>
    </div>
  );
}
