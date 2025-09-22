'use client';
import dynamic from 'next/dynamic';
export default dynamic(() => import('@/components/charts/ThemedBarChart'), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded" />,
});
