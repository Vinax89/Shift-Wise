'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, PiggyBank } from 'lucide-react';
import { getTaxBurden } from '@/app/taxes/actions';
import type { TaxBurdenVisualizationOutput } from '@/ai/flows/tax-burden-visualization-llm';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '@/lib/utils';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const formSchema = z.object({
  zipCode: z.string().length(5, 'ZIP code must be 5 digits.').regex(/^\d+$/, 'ZIP code must be numeric.'),
});

export function TaxVisualizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaxBurdenVisualizationOutput | null>(null);
  const { toast } = useToast();
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
    ]);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const taxResult = await getTaxBurden(values);
      setResult(taxResult);
    } catch (error) {
      console.error('Tax visualization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: 'Could not calculate tax burden. Please try another ZIP code.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = result ? [
    { name: 'Federal', tax: result.federalTax, fill: chartColors[0] },
    { name: 'State', tax: result.stateTax, fill: chartColors[1] },
    { name: 'Local', tax: result.localTax, fill: chartColors[2] },
  ] : [];

  const chartConfig = {
      tax: { label: "Tax", color: "hsl(var(--chart-1))" },
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-full max-w-xs">
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PiggyBank className="mr-2 h-4 w-4" />}
            Calculate
          </Button>
        </form>
      </Form>

      {result && (
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline">Tax Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-between"><span>Federal Tax:</span> <span className="font-medium">{formatCurrency(result.federalTax)}</span></div>
                    <div className="flex justify-between"><span>State Tax:</span> <span className="font-medium">{formatCurrency(result.stateTax)}</span></div>
                    <div className="flex justify-between"><span>Local Tax:</span> <span className="font-medium">{formatCurrency(result.localTax)}</span></div>
                    <div className="flex justify-between pt-4 border-t font-bold"><span>Total Tax:</span> <span>{formatCurrency(result.federalTax + result.stateTax + result.localTax)}</span></div>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                 <CardHeader>
                    <CardTitle className="font-headline">Visual Comparison</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <ChartContainer config={chartConfig} className="w-full h-52">
                        <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical" accessibilityLayer>
                                <XAxis type="number" hide tick={{fill: 'hsl(var(--chart-axis))'}} axisLine={{stroke: 'hsl(var(--chart-axis-weak))'}} />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--chart-axis))'}} />
                                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} cursor={{fill: 'hsl(var(--muted))'}} />
                                <Bar dataKey="tax" radius={4} layout="vertical" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="md:col-span-3">
                 <CardHeader>
                    <CardTitle className="font-headline">AI Explanation</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.taxBurdenExplanation}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
