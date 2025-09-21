'use client';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ rows }: { rows: React.ReactNode[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });
  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto [content-visibility:auto] [contain-intrinsic-size:56px]">
      <div style={{ height: rowVirtualizer.getTotalSize() }} className="relative w-full">
        {rowVirtualizer.getVirtualItems().map((v) => (
          <div key={v.key} className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${v.start}px)`, height: `${v.size}px` }}>
            {rows[v.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
