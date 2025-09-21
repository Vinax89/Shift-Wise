'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RouteTransitions() {
  const path = usePathname();
  useEffect(() => {
    // Respect reduced motion automatically; no-op if unsupported.
    // The callback can be empty to mark a transition boundary.
    (document as any).startViewTransition?.(() => {});
  }, [path]);
  return null;
}
