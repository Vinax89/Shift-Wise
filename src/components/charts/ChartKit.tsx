'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid
} from 'recharts';

// ---------- perf helpers ----------
function useRafThrottle<T extends (...args:any[])=>void>(fn:T){
  const f = React.useRef<number>(); const last = React.useRef<any[]>();
  return React.useCallback((...args:any[])=>{ last.current=args; if (f.current) return; f.current=requestAnimationFrame(()=>{ f.current=undefined; fn(...(last.current||[])); }); },[fn]);
}

function buildXTicks(data:any[], key:string, max=6){
  if (!data?.length) return [] as any[];
  const step = Math.max(1, Math.floor(data.length / max));
  const out:any[] = []; for (let i=0;i<data.length;i+=step) out.push(data[i][key]);
  if (out[out.length-1] !== data[data.length-1][key]) out.push(data[data.length-1][key]);
  return out;
}
function buildYTicks(data:any[], keys:string[], max=5){
  const vals:number[] = [];
  for (const d of data) for (const k of keys) { const v = Number(d[k]); if (!Number.isNaN(v)) vals.push(v); }
  if (!vals.length) return [];
  const min = Math.min(...vals), maxv = Math.max(...vals);
  if (min===maxv){ return [min]; }
  const step = (maxv-min)/Math.max(1,max-1);
  const t:number[] = []; for (let i=0;i<max;i++) t.push(Math.round((min+step*i)*100)/100);
  t.push(maxv);
  return Array.from(new Set(t));
}

// ---------- tooltip ----------
function TooltipPortal({ x, y, children }:{ x:number; y:number; children:React.ReactNode }){
  const el = React.useMemo(()=>{
    if (typeof document==='undefined') return null; const div = document.createElement('div');
    div.style.position='fixed'; div.style.left='0'; div.style.top='0'; div.style.zIndex='80';
    div.style.pointerEvents='none';
    document.body.appendChild(div); return div;
  },[]);
  React.useEffect(()=>()=>{ if (el && el.parentNode) el.parentNode.removeChild(el); },[el]);
  if (!el) return null;
  el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  return createPortal(children, el);
}

function DefaultTooltip({ label, lines, yFmt }:{ label:string; lines:{name:string; value:number}[]; yFmt?:(n:number)=>string }){
  return (
    <div className="rounded-lg bg-black/70 px-2 py-1 text-xs text-white shadow-lg backdrop-blur dark:bg-white/10">
      <div className="mb-1 opacity-80">{label}</div>
      {lines.map((l)=> (
        <div key={l.name} className="flex items-center justify-between gap-4">
          <span className="opacity-80">{l.name}</span>
          <span className="tabular-nums">{yFmt? yFmt(l.value): String(l.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- SmartLineChart ----------
export function SmartLineChart({ data, xKey, yKeys, height=240, yFormatter, className }:{
  data: any[]; xKey: string; yKeys: string[]; height?: number; yFormatter?: (n:number)=>string; className?: string;
}){
  const [hover, setHover] = React.useState<{x:number;y:number;pt:any}|null>(null);
  const onMove = useRafThrottle((e:any)=>{
    if (!e || !e.chartX) return; const p = e?.activePayload?.[0]?.payload; if (!p) return;
    setHover({ x:e.chartX+12, y:e.chartY+12, pt:p });
  });
  const onLeave = ()=> setHover(null);

  const xticks = React.useMemo(()=>buildXTicks(data, xKey, 6), [data, xKey]);
  const yticks = React.useMemo(()=>buildYTicks(data, yKeys, 5), [data, yKeys]);

  return (
    <div className={`glass rounded-xl p-3 ${className||''}`} style={{minHeight:height}}>
      <div style={{height}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 12 }} onMouseMove={onMove} onMouseLeave={onLeave}>
            <CartesianGrid strokeOpacity={0.08} />
            <XAxis dataKey={xKey} ticks={xticks} minTickGap={20} tickMargin={8} />
            <YAxis ticks={yticks} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals />
            {yKeys.map((k) => (
              <Line key={k} type="monotone" dataKey={k} strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hover && (
        <TooltipPortal x={hover.x} y={hover.y}>
          <DefaultTooltip label={hover.pt[xKey]} lines={yKeys.map(k=>({ name:k, value:Number(hover.pt[k]||0) }))} yFmt={yFormatter} />
        </TooltipPortal>
      )}
    </div>
  );
}

// ---------- SmartBarChart ----------
export function SmartBarChart({ data, xKey, yKey, height=240, yFormatter, className }:{
  data:any[]; xKey:string; yKey:string; height?:number; yFormatter?:(n:number)=>string; className?:string;
}){
  const xticks = React.useMemo(()=>buildXTicks(data, xKey, 8), [data, xKey]);
  const yticks = React.useMemo(()=>buildYTicks(data, [yKey], 5), [data, yKey]);
  return (
    <div className={`glass rounded-xl p-3 ${className||''}`} style={{minHeight:height}}>
      <div style={{height}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
            <CartesianGrid strokeOpacity={0.08} />
            <XAxis dataKey={xKey} ticks={xticks} minTickGap={20} tickMargin={8} />
            <YAxis ticks={yticks} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals />
            <Bar dataKey={yKey} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- SmartAreaChart ----------
import { AreaChart, Area } from 'recharts';

export function SmartAreaChart({ data, xKey, yKeys, height=240, yFormatter, className }:{
  data: any[]; xKey: string; yKeys: string[]; height?: number; yFormatter?: (n:number)=>string; className?: string;
}){
  const xticks = React.useMemo(()=>buildXTicks(data, xKey, 6), [data, xKey]);
  const yticks = React.useMemo(()=>buildYTicks(data, yKeys, 5), [data, yKeys]);

  return (
    <div className={`glass rounded-xl p-3 ${className||''}`} style={{minHeight:height}}>
      <div style={{height}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
            <CartesianGrid strokeOpacity={0.08} />
            <XAxis dataKey={xKey} ticks={xticks} minTickGap={20} tickMargin={8} />
            <YAxis ticks={yticks} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals />
            {yKeys.map((k, i) => (
              <Area key={k} type="monotone" dataKey={k}
                    stroke="currentColor" fill="currentColor" fillOpacity={0.15 + i*0.12}
                    isAnimationActive={false} activeDot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
