'use client';
import * as React from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useForm } from 'react-hook-form';

export type BudgetRow = { id: string; envelope: string; planned: number; spent: number; remaining: number };

export default function BudgetGrid({ rows, onChange }: { rows: BudgetRow[]; onChange?: (r: BudgetRow[]) => void }) {
  const [data, setData] = React.useState(rows);
  const cols = React.useMemo<ColumnDef<BudgetRow>[]>(() => [
    { accessorKey: 'envelope', header: 'Envelope', cell: ctx => <CellText row={ctx.row.original} field='envelope' onEdit={update}/> },
    { accessorKey: 'planned', header: 'Planned', cell: ctx => <CellNumber row={ctx.row.original} field='planned' onEdit={update}/> },
    { accessorKey: 'spent', header: 'Spent', cell: ctx => <span className="tabular-nums">{fmt(ctx.row.original.spent)}</span> },
    { accessorKey: 'remaining', header: 'Remaining', cell: ctx => <strong className={`tabular-nums ${ctx.row.original.remaining<0?'text-danger':'text-success'}`}>{fmt(ctx.row.original.remaining)}</strong> },
  ], []);

  function recompute(next: BudgetRow[]): BudgetRow[] {
    return next.map(r => ({ ...r, remaining: Math.round((r.planned - r.spent) * 100) / 100 }));
  }
  function update(id: string, patch: Partial<BudgetRow>) {
    setData(prev => {
      const next = prev.map(r => r.id===id? { ...r, ...patch } : r);
      const out = recompute(next);
      onChange?.(out);
      return out;
    });
  }

  const table = useReactTable({ data, columns: cols, getCoreRowModel: getCoreRowModel() });
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({ count: table.getRowModel().rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 44, overscan: 8 });

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div role="table" aria-label="Budget grid" className="grid grid-cols-4 border-b border-border/70 text-xs text-muted-fg">
        {table.getHeaderGroups().map(hg => hg.headers.map(h => <div key={h.id} className="px-3 py-2 font-medium">{flexRender(h.column.columnDef.header, h.getContext())}</div>))}
      </div>
      <div ref={parentRef} className="h-[60vh] overflow-auto [content-visibility:auto] [contain-intrinsic-size:44px]">
        <div style={{ height: rowVirtualizer.getTotalSize() }} className="relative">
          {rowVirtualizer.getVirtualItems().map(v => {
            const row = table.getRowModel().rows[v.index];
            return (
              <div key={row.id} className="absolute left-0 right-0 grid grid-cols-4 border-b border-border/60" style={{ transform: `translateY(${v.start}px)`, height: v.size }}>
                {row.getVisibleCells().map(cell => (
                  <div key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CellText({ row, field, onEdit }: { row: BudgetGridRow; field: 'envelope'; onEdit: (id:string, patch:any)=>void }){
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(row[field]);
  return editing ? (
    <input autoFocus value={value} onChange={e=>setValue(e.target.value)} onBlur={()=>{ onEdit(row.id, { [field]: value }); setEditing(false); }} className="w-full rounded border border-border bg-card px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring" />
  ) : (
    <button onClick={()=>setEditing(true)} className="w-full text-left focus:outline-none focus:ring-2 focus:ring-ring">{value}</button>
  );
}

type BudgetGridRow = BudgetRow;
function CellNumber({ row, field, onEdit }: { row: BudgetGridRow; field: 'planned'; onEdit: (id:string, patch:any)=>void }){
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(String(row[field]));
  function commit(){ const n = Number(value.replace(/[^0-9.-]/g,'')); onEdit(row.id, { [field]: isFinite(n) ? n : row[field] }); setEditing(false); }
  return editing ? (
    <input autoFocus inputMode="decimal" value={value} onChange={e=>setValue(e.target.value)} onBlur={commit} onKeyDown={(e)=>{ if(e.key==='Enter') commit(); if(e.key==='Escape') setEditing(false); }} className="w-full rounded border border-border bg-card px-2 py-1 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-ring" />
  ) : (
    <button onClick={()=>setEditing(true)} className="w-full text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-ring">{fmt(row[field])}</button>
  );
}

function fmt(n:number){ return new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(n); }
