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
import { useMemo } from 'react';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function CategorySpendChart() {
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
    return chartData.reduce((acc, data, index) => {
      acc[data.name] = {
        label: data.name,
        color: chartColors[index % chartColors.length],
      };
      return acc;
    }, {} as any);
  }, [chartData]);

  return (
    <div className="w-full h-80">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
      >
        <PieChart>
          <ChartTooltip
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
