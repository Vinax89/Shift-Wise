
'use client';
import * as React from 'react';

export function ChartControls({ ranges=['3M','6M','1Y','ALL'], onRange, series, onToggle, smooth, onSmooth, onExport }:{
  ranges?: string[]; onRange?: (r:string)=>void; series: { key:string; label:string; visible:boolean }[]; onToggle:(k:string)=>void; smooth:boolean; onSmooth:(v:boolean)=>void; onExport?: ()=>void;
}){
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <div className="mr-2 inline-flex overflow-hidden rounded-lg ring-1 ring-white/10">
        {ranges.map(r=> (
          <button key={r} className="px-2 py-1 text-xs hover:bg-white/5" onClick={()=>onRange?.(r)}>{r}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs opacity-80">
        <input type="checkbox" checked={smooth} onChange={e=>onSmooth(e.target.checked)} /> Smoothing
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {series.map(s=> (
          <label key={s.key} className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={s.visible} onChange={()=>onToggle(s.key)} /> {s.label}
          </label>
        ))}
      </div>
      <div className="grow"/>
      {onExport && <button className="rounded px-2 py-1 text-xs ring-1 ring-white/10 hover:bg-white/5" onClick={onExport}>Export CSV</button>}
    </div>
  );
}
