'use client';
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function useRafThrottle<T extends (...args:any[])=>void>(fn:T, fps=60){
  const frame = React.useRef<number>();
  const lastArgs = React.useRef<any[]>();
  return React.useCallback((...args:any[])=>{
    lastArgs.current=args; if (frame.current) return;
    frame.current=requestAnimationFrame(()=>{ frame.current=undefined; fn(...(lastArgs.current||[])); });
  },[fn]);
}

export default function LineChartIsland({ data, xKey, yKeys, height=240, yFormatter }:{
  data: any[]; xKey: string; yKeys: string[]; height?: number; yFormatter?: (n:number)=>string;
}){
  const [hover, setHover] = React.useState<any>(null);
  const onMove = useRafThrottle((e:any)=> setHover(e?.activePayload?.[0]?.payload), 60);
  const onLeave = () => setHover(null);
  const anim = typeof window!=='undefined' && !document.documentElement.classList.contains('motion-quiet');

  return (
    <div style={{height}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} onMouseMove={onMove} onMouseLeave={onLeave} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeOpacity={0.08} />
          <XAxis dataKey={xKey} minTickGap={24} tickMargin={8} />
          <YAxis width={56} tickFormatter={yFormatter} tickMargin={8} />
          <Tooltip isAnimationActive={false} wrapperStyle={{ pointerEvents:'none' }} formatter={(val:any)=> yFormatter? yFormatter(Number(val)) : val} />
          {yKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} strokeOpacity={0.9} strokeWidth={2}
                  dot={false} activeDot={{ r: 3 }} isAnimationActive={anim} animationDuration={anim? 200:0} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
