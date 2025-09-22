'use client';
import * as React from 'react';
import BudgetGrid from '@/components/budget/BudgetGrid.client';
import BudgetProgressArea from '@/components/budget/BudgetProgressArea.client';

export default function BudgetClient(){
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <BudgetGrid />
      </div>
      <div>
        <BudgetProgressArea />
      </div>
    </div>
  );
}
