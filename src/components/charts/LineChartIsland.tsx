'use client';
import dynamic from 'next/dynamic';

const ThemedLineChart = dynamic(
  () => import('@/components/charts/ThemedLineChart'),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded bg-muted" /> }
);

export default function LineChartIsland(props: any) {
  return <ThemedLineChart {...props} />;
}
