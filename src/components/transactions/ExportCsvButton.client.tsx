'use client';
import * as React from 'react';

type Row = { id?: string; date: string; merchant: string; amount: number; category?: string };
export default function ExportCsvButton({ rows, filename = 'transactions.csv' }: { rows: Row[]; filename?: string }) {
  function download() {
    const header = ['date','merchant','amount','category'];
    const lines = rows.map(r => [r.date, safe(r.merchant), r.amount.toFixed(2), r.category ?? ''].map(csvCell).join(','));
    const blob = new Blob([header.join(',') + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 0);
  }
  return (
    <button onClick={download} className="rounded bg-muted px-3 py-2 text-sm text-card-fg hover:bg-muted/80">Export CSV</button>
  );
}
function csvCell(x: any){ const s=String(x); return /[",\n]/.test(s)? '"'+s.replace(/"/g,'""')+'"' : s; }
function safe(s:string){ return s?.replace(/\s+/g,' ').trim() || ''; }
