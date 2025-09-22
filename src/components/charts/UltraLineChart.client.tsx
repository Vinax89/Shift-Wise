
'use client';
import * as React from 'react';

// Props compatible with SmartLineChartPro subset
export default function UltraLineChart<T>({ data, xKey, yKeys, height=260, yFormatter }:{
  data:T[]; xKey:keyof T; yKeys:(keyof T)[]; height?:number; yFormatter?:(n:number)=>string;
}){
  const ref = React.useRef<HTMLDivElement>(null);
  const plotRef = React.useRef<any>(null);

  React.useEffect(()=>{
    let u: any;
    (async ()=>{
      if (!ref.current) return;
      try{
        const uPlot = (await import('uplot')).default; // optional dep
        await import('uplot/dist/uPlot.min.css');
        const xs = (data as any[]).map(d=> Number(d[xKey]));
        const series = yKeys.map(k=> (data as any[]).map(d=> Number(d[k])));
        const scaleY = { range:(u:any, min:number, max:number)=> [min, max] } as any;
        
        // Destroy existing instance if it exists
        if (plotRef.current) {
          plotRef.current.destroy();
        }

        u = new uPlot({
          width: ref.current.clientWidth, height,
          scales: { x:{ time:false }, y: scaleY },
          series: [{ label: String(xKey) }, ...yKeys.map(k=> ({ label:String(k), stroke: 'var(--ch-1)', width: 2 }))],
          axes: [ 
            { stroke: 'var(--muted)', grid: { stroke: 'var(--ch-grid)' } }, 
            { 
              values:(u:any, ticks:number[])=> ticks.map(t=> yFormatter? yFormatter(t as any): String(t)),
              stroke: 'var(--muted)',
              grid: { stroke: 'var(--ch-grid)' }
            }
          ],
        }, [ xs, ...series ], ref.current!);
        plotRef.current = u;

      }catch(e){ 
        console.warn("uPlot library not found. Skipping chart rendering. Run `pnpm add uplot` to enable.");
      }
    })();
    return ()=>{ if (plotRef.current) { try{ plotRef.current.destroy(); }catch{} } };
  },[data, xKey, yKeys, height, yFormatter]);

  return <div ref={ref} className="glass rounded-xl p-3" style={{ minHeight: height }} />;
}

