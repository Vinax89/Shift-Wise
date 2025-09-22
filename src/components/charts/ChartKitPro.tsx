
'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Brush } from 'recharts';
import { useRangeSync } from '@/components/charts/RangeSyncContext';

// ==================== Perf Helpers ====================
const useRafThrottle = <T extends (...a:any[])=>void>(fn:T)=>{
  const f = React.useRef<number>(); const last = React.useRef<any[]>();
  return React.useCallback((...args:any[])=>{ last.current=args; if (f.current) return; f.current=requestAnimationFrame(()=>{ f.current=undefined; fn(...(last.current||[])); }); },[fn]);
};
const useStable = <T,>(v:T)=> React.useMemo(()=>v, []);

// ==================== Downsample & Smooth ====================
function toXY<T>(data:T[], xKey:keyof T, yKey:keyof T){
  return data.map((d:any)=>({ x: +d[xKey], y: +d[yKey] })).filter(p=>Number.isFinite(p.x) && Number.isFinite(p.y));
}
function fromXY<T>(xy:{x:number;y:number}[], orig:T[], xKey:keyof T, yKey:keyof T):T[]{
  const map = new Set(xy.map(p=>p.x));
  return (orig as any[]).filter(d=> map.has(+d[xKey]));
}
function ema(series:number[], k=0.2){ const out:number[]=[]; let prev=series[0]; for (let i=0;i<series.length;i++){ prev = k*series[i] + (1-k)*prev; out.push(prev);} return out; }

function useDownsampled<T>(data:T[], xKey:keyof T, yKeys:(keyof T)[], maxPoints=600){
  const [out, setOut] = React.useState<T[]>(data);
  React.useEffect(()=>{
    if (!data || data.length<=maxPoints) { setOut(data); return; }
    let worker: Worker | null = null; let alive = true;
    (async ()=>{
      try {
        // @ts-ignore: bundler URL form
        worker = new Worker(new URL('../../workers/downsample.worker.ts', import.meta.url));
        const x = toXY(data, xKey, yKeys[0]);
        worker.onmessage = (ev: MessageEvent)=>{ if(!alive) return; const ds = ev.data as {x:number;y:number}[]; setOut(fromXY(ds, data, xKey, yKeys[0])); worker?.terminate(); };
        worker.postMessage({ series: x, threshold: maxPoints });
      } catch {
        // Fallback synchronous LTTB (small cost)
        setOut(data.filter((_,i)=> i % Math.ceil(data.length/maxPoints) === 0));
      }
    })();
    return ()=>{ alive=false; worker?.terminate(); };
  },[data, xKey, yKeys, maxPoints]);
  return out;
}

// ==================== Ticks & Tooltip ====================
function buildXTicks<T>(data:T[], key:keyof T, max=6){ if(!data?.length) return []; const step=Math.max(1,Math.floor((data.length)/max)); const out:any[]=[]; for(let i=0;i<data.length;i+=step) out.push((data[i] as any)[key]); if(out[out.length-1]!== (data[data.length-1] as any)[key]) out.push((data[data.length-1] as any)[key]); return out; }
function buildYTicks<T>(data:T[], keys:(keyof T)[], max=5){ const vals:number[]=[]; data.forEach((d:any)=> keys.forEach(k=>{ const v=+d[k]; if(Number.isFinite(v)) vals.push(v);})); if(!vals.length) return []; const min=Math.min(...vals), maxv=Math.max(...vals); if(min===maxv) return [min]; const step=(maxv-min)/Math.max(1,max-1); const t:number[]=[]; for(let i=0;i<max;i++) t.push(Math.round((min+step*i)*100)/100); t.push(maxv); return Array.from(new Set(t)); }

function Portal({ x, y, children }:{ x:number; y:number; children:React.ReactNode }){
  const el = React.useMemo(()=>{ if(typeof document==='undefined') return null; const d=document.createElement('div'); d.style.position='fixed'; d.style.left='0'; d.style.top='0'; d.style.zIndex='60'; d.style.pointerEvents='none'; document.body.appendChild(d); return d; },[]);
  React.useEffect(()=>()=>{ if(el && el.parentNode) el.parentNode.removeChild(el); },[el]);
  if(!el) return null; el.style.transform=`translate(${Math.round(x)}px, ${Math.round(y)}px)`; return createPortal(children, el);
}

const Tip = ({ label, rows, fmt }:{ label:React.ReactNode; rows:{name:string; value:number; color?:string}[]; fmt?:(n:number)=>string }) => (
  <div className="rounded-lg bg-[color:var(--tooltip-bg,rgba(0,0,0,.7))] px-2 py-1.5 text-xs text-white shadow-lg backdrop-blur">
    <div className="mb-1 font-medium opacity-80">{label}</div>
    {rows.map(r=> (
      <div key={r.name} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{background:r.color}}/>
          <span className="opacity-80">{r.name}</span>
        </div>
        <span className="font-medium tabular-nums">{fmt?fmt(r.value):r.value}</span>
      </div>
    ))}
  </div>
);

// ==================== Gradients ====================
function Gradients(){
  return (
    <svg width="0" height="0" style={{ position:'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--ch-1)" stopOpacity=".35" /><stop offset="100%" stopColor="var(--ch-1)" stopOpacity="0" /></linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--ch-2)" stopOpacity=".25" /><stop offset="100%" stopColor="var(--ch-2)" stopOpacity="0" /></linearGradient>
      </defs>
    </svg>
  );
}

// ==================== Smart Pro Charts ====================
export function SmartLineChartPro<T>({ data, xKey, yKeys, height=260, yFormatter, className, crosshair=true, maxPoints=800, smooth=false, rangeChannel, showBrush=false }:{
  data:T[]; xKey:keyof T; yKeys:(keyof T)[]; height?:number; yFormatter?:(n:number)=>string; className?:string; crosshair?:boolean; maxPoints?:number; smooth?:boolean; rangeChannel?:string; showBrush?:boolean;
}){
  const [shared, setShared] = (rangeChannel ? useRangeSync(rangeChannel) : [null, ()=>{}]) as any;
  const ds = useDownsampled(data, xKey, yKeys, maxPoints);
  const xt = React.useMemo(()=>buildXTicks(ds, xKey, 6), [ds, xKey]);
  const yt = React.useMemo(()=>buildYTicks(ds, yKeys, 5), [ds, yKeys]);
  const [hover, setHover] = React.useState<{x:number;y:number;pt:any}|null>(null);
  const onMove = useRafThrottle((e:any)=>{ const p=e?.activePayload?.[0]?.payload; if(!p) return; setHover({ x:e.chartX+12, y:e.chartY+12, pt:p }); });
  const onLeave = ()=> setHover(null);

  // optional smoothing (EMA) per series
  const view = React.useMemo(()=>{
    if(!smooth) return ds; if(!ds?.length) return ds;
    const out = ds.map((d:any)=> ({ ...d }));
    yKeys.forEach(k=>{ const arr = ds.map((d:any)=> +d[k]); const s = ema(arr, 0.2); s.forEach((v,i)=> (out[i] as any)[k]=v); });
    return out;
  },[ds, yKeys, smooth]);

  return (
    <div className={`chart-container ${className||''}`} style={{ minHeight: height }}>
      <Gradients />
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={view} margin={{ top:8,right:12,bottom:8,left:12 }} onMouseMove={onMove} onMouseLeave={onLeave}>
            {/* when shared domain is set, XAxis will naturally render subset labels; recharts doesn't hard-clip by domain, so we expose brush below */}
            <CartesianGrid stroke={`var(--ch-grid)`} vertical={false} />
            <XAxis dataKey={xKey as any} ticks={xt} minTickGap={20} tickMargin={8} axisLine={false} tickLine={false} />
            <YAxis ticks={yt} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals axisLine={false} tickLine={false} />
            {crosshair && hover && <ReferenceLine x={hover.pt[xKey as any]} stroke="var(--ch-grid)" strokeDasharray="3 3" />}
            {yKeys.map((k, idx)=> (
              <Line key={String(k)} type="monotone" dataKey={k as any} stroke={`var(--ch-${(idx%5)+1})`} dot={false} activeDot={false} isAnimationActive={false} strokeWidth={2} />
            ))}
             {showBrush && (
              <Brush travellerWidth={8} height={18} stroke="var(--ch-grid)"
                onChange={(r:any)=> setShared([r?.startIndex, r?.endIndex])}/>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hover && (
        <Portal x={hover.x} y={hover.y}>
          <Tip label={hover.pt[xKey as any]} rows={yKeys.map((k,i)=>({ name:String(k), value:+hover.pt[k as any]||0, color:`var(--ch-${(i%5)+1})` }))} fmt={yFormatter} />
        </Portal>
      )}
    </div>
  );
}

export function SmartAreaChartPro<T>({ data, xKey, yKeys, height=260, yFormatter, className, maxPoints=800, rangeChannel, showBrush=true }:{
  data:T[]; xKey:keyof T; yKeys:(keyof T)[]; height?:number; yFormatter?:(n:number)=>string; className?:string; maxPoints?:number; rangeChannel?:string; showBrush?:boolean;
}){
  const [shared, setShared] = (rangeChannel ? useRangeSync(rangeChannel) : [null, ()=>{}]) as any;
  const ds = useDownsampled(data, xKey, yKeys, maxPoints);
  const xt = React.useMemo(()=>buildXTicks(ds, xKey, 6), [ds, xKey]);
  const yt = React.useMemo(()=>buildYTicks(ds, yKeys, 5), [ds, yKeys]);
  return (
    <div className={`chart-container ${className||''}`} style={{ minHeight: height }}>
      <Gradients />
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ds} margin={{ top:8,right:12,bottom:8,left:12 }}>
            <CartesianGrid stroke={`var(--ch-grid)`} vertical={false} />
            <XAxis dataKey={xKey as any} ticks={xt} minTickGap={20} tickMargin={8} axisLine={false} tickLine={false}/>
            <YAxis ticks={yt} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals axisLine={false} tickLine={false} />
            {yKeys.map((k, i)=> (
              <Area key={String(k)} type="monotone" dataKey={k as any} stroke={`var(--ch-${(i%5)+1})`} fill={`url(#g${(i%2)+1})`} isAnimationActive={false} activeDot={false} strokeWidth={2} />
            ))}
             {showBrush && (
              <Brush travellerWidth={8} height={18} stroke="var(--ch-grid)"
                onChange={(r:any)=> setShared([r?.startIndex, r?.endIndex])}/>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SmartBarChartPro<T>({ data, xKey, yKey, height=240, yFormatter, className }:{
  data:T[]; xKey:keyof T; yKey:keyof T; height?:number; yFormatter?:(n:number)=>string; className?:string;
}){
  const xt = React.useMemo(()=>buildXTicks(data, xKey, 8), [data, xKey]);
  const yt = React.useMemo(()=>buildYTicks(data, [yKey], 5), [data, yKey]);
  return (
    <div className={`chart-container ${className||''}`} style={{ minHeight: height }}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top:8,right:12,bottom:8,left:12 }}>
            <CartesianGrid stroke={`var(--ch-grid)`} vertical={false} />
            <XAxis dataKey={xKey as any} ticks={xt} minTickGap={20} tickMargin={8} axisLine={false} tickLine={false} />
            <YAxis ticks={yt} width={56} tickMargin={6} tickFormatter={yFormatter} allowDecimals axisLine={false} tickLine={false} />
            <Bar dataKey={yKey as any} isAnimationActive={false} fill={`var(--ch-1)`} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
