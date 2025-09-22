'use client';
import * as React from 'react';
import CashFlowTrend from './cash-flow-trend';
import CategorySpend from './category-spend-chart';
import MiniTrend from './mini-trend';

export type TrendPoint = { month:string; inflow:number; outflow:number };
export default function OverviewClient({ trend }:{ trend: TrendPoint[] }){
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CashFlowTrend points={trend as any} />
      <CategorySpend />
      <MiniTrend />
    </div>
  );
}
