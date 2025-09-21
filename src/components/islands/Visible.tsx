'use client';
import { useEffect, useRef, useState } from 'react';

export default function Visible({ height = 200, children }: { height?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShow(true); io.disconnect(); }
    }, { rootMargin: '128px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{show ? children : <div style={{ height }} className="animate-pulse rounded bg-muted"/>}</div>;
}
