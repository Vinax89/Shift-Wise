
// LTTB: Largest-Triangle-Three-Buckets — simplified & fast
export type Series = { x: number; y: number }[];

self.onmessage = (ev: MessageEvent) => {
  const { series, threshold } = ev.data as { series: Series; threshold: number };
  const out = lttb(series, threshold);
  (self as any).postMessage(out);
};

function lttb(data: Series, threshold: number): Series {
  const n = data.length; if (threshold >= n || threshold <= 2) return data.slice();
  const bucketSize = (n - 2) / (threshold - 2);
  const sampled: Series = [ data[0] ];
  let a = 0; // a is the index of the last selected point
  for (let i = 0; i < threshold - 2; i++) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const range = data.slice(rangeStart, Math.min(rangeEnd, n));
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    let avgX = 0, avgY = 0, avgRangeLength = (avgRangeEnd - avgRangeStart) || 1;
    for (let j = avgRangeStart; j < avgRangeEnd; j++) { const p = data[j]; avgX += p.x; avgY += p.y; }
    avgX /= avgRangeLength; avgY /= avgRangeLength;
    let maxArea = -1, nextA = rangeStart;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const p = data[j];
      const pa = data[a];
      const area = Math.abs((pa.x - avgX) * (p.y - pa.y) - (pa.x - p.x) * (avgY - pa.y)) * 0.5;
      if (area > maxArea) { maxArea = area; nextA = j; }
    }
    sampled.push(data[nextA]); a = nextA;
  }
  sampled.push(data[n - 1]);
  return sampled;
}
