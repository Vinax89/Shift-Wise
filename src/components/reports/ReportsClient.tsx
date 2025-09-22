'use client';
import * as React from 'react';
import SpendingOverTime from '@/components/reports/SpendingOverTime.client';
import IncomeVsOutflow from '@/components/reports/IncomeVsOutflow.client';
import StackedTopNCategories from '@/components/reports/StackedTopNCategories.client';

export default function ReportsClient(){
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SpendingOverTime />
      <IncomeVsOutflow />
      <div className="md:col-span-2">
        <StackedTopNCategories />
      </div>
    </div>
  );
}
