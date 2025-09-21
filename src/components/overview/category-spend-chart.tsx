'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { transactions } from '@/lib/data';
import { useMemo, useState, useEffect } from 'react';

export function CategorySpendChart() {
  const [chartColors, setChartColors] = useState<string[]>([]);
   const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const color = (v: string) => `hsl(${css(v)})`;

    setChartColors([
      color('--chart-1'),
      color('--chart-2'),
      color('--chart-3'),
      color('--chart-4'),
      color('--chart-5'),
    ]);
  }, []);


  const chartData = useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Uncategorized';
        const amount = Math.abs(t.amount);
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      name: category,
      value: total,
    }));
  }, []);
  
  const chartConfig = useMemo(() => {
    if (!isClient) return {};
    return chartData.reduce((acc, data, index) => {
      acc[data.name] = {
        label: data.name,
        color: chartColors[index % chartColors.length],
      };
      return acc;
    }, {} as any);
  }, [chartData, isClient, chartColors]);

  if (!isClient) {
      return <div className="w-full h-80 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <div className="w-full h-80">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="value" hideLabel />}
          />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="60%">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
