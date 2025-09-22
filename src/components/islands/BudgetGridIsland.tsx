'use client';
import dynamic from 'next/dynamic';
export default dynamic(() => import('@/components/budget/BudgetGrid.client'), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded" />,
});
