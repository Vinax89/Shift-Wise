
export function exportCsv(rows:any[], filename='chart.csv'){
  const keys = Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
  const head = keys.join(',');
  const body = rows.map(r=> keys.map(k=> JSON.stringify(r[k]??'')).join(',')).join('\n');
  const blob = new Blob([head+'\n'+body], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
