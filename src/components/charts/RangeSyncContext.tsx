'use client';
import * as React from 'react';

type Domain = [any, any] | null; // x domain (e.g., [min, max])

type Store = Record<string, Domain>;
const Ctx = React.createContext<{ get:(k:string)=>Domain; set:(k:string, d:Domain)=>void }>({
  get: ()=> null, set: ()=>{}
});

export function RangeSyncProvider({ children }:{ children: React.ReactNode }){
  const ref = React.useRef<Store>({});
  const get = React.useCallback((k:string)=> ref.current[k] ?? null,[]);
  const set = React.useCallback((k:string, d:Domain)=>{ ref.current[k] = d; window.dispatchEvent(new CustomEvent(`range:${k}`,{ detail:d })); },[]);
  const value = React.useMemo(()=>({ get, set }),[get,set]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRangeSync(channel: string){
  const { get, set } = React.useContext(Ctx);
  const [domain, setDomain] = React.useState<Domain>(get(channel));
  React.useEffect(()=>{
    const on = (e:any)=> setDomain(e.detail as Domain);
    const type = `range:${channel}`; window.addEventListener(type, on); return ()=> window.removeEventListener(type, on);
  },[channel]);
  const update = React.useCallback((d:Domain)=>{ set(channel, d); },[channel, set]);
  return [domain, update] as const;
}
