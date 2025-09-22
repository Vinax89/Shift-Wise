'use client';
import * as Dialog from '@radix-ui/react-dialog';

export type ParsedTxn = { date: string; merchant: string; amount: number; memo?: string };

export default function ImportTransactionsDialog({ open, onOpenChange, onImport }: { open: boolean; onOpenChange: (v: boolean) => void; onImport: (rows: ParsedTxn[]) => void }) {
  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const file = files[0];
    const text = await file.text();
    const lower = file.name.toLowerCase();
    let rows: ParsedTxn[] = [];
    if (lower.endsWith('.csv')) rows = parseCSV(text);
    else if (lower.endsWith('.ofx') || lower.endsWith('.qfx')) rows = parseOFX(text);
    else { alert('Unsupported file type'); return; }
    onImport(rows);
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 glass rounded-t-2xl p-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] md:rounded-2xl">
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Import Transactions</Dialog.Title>
            <Dialog.Close className="rounded px-2 py-1 text-sm hover:bg-muted">Close</Dialog.Close>
          </div>
          <div className="rounded border border-border bg-card p-4 text-sm">
            <input type="file" accept=".csv,.ofx,.qfx" onChange={(e)=>handleFiles(e.target.files)} />
            <p className="mt-2 text-xs text-muted-fg">Accepts CSV/OFX/QFX. CSV columns auto-detected for common exports (date, description/merchant, amount).</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Minimal CSV (comma) parser: date,merchant,amount,memo — tolerant, ignores header lines
function parseCSV(text: string): ParsedTxn[] {
  const out: ParsedTxn[] = [];
  const lines = text.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const cells = safeSplit(line);
    if (!cells.length) continue;
    if (/date/i.test(cells[0]) && /amount/i.test(cells.join(','))) continue; // skip header
    const [c0,c1,c2,c3] = cells;
    const amt = Number(String(c2).replace(/[^0-9.-]/g,''));
    if (!isFinite(amt)) continue;
    out.push({ date: c0, merchant: c1 || '', amount: amt, memo: c3 });
  }
  return out;
}
function safeSplit(line: string): string[] {
  // Naive CSV split supporting quoted commas
  const res: string[] = []; let cur = ''; let inQ = false;
  for (let i=0;i<line.length;i++){
    const ch = line[i];
    if (ch==='"'){ inQ = !inQ; continue; }
    if (ch===',' && !inQ){ res.push(cur.trim()); cur=''; continue; }
    cur += ch;
  }
  res.push(cur.trim());
  return res.map(s=>s.replace(/^"|"$/g,''));
}

// Ultra-light OFX/QFX parser (amount/date/name only)
function parseOFX(text: string): ParsedTxn[] {
  const out: ParsedTxn[] = [];
  const txns = text.split(/<STMTTRN>/i).slice(1);
  for (const blob of txns) {
    const amt = Number((blob.match(/<TRNAMT>([^<]+)/i)?.[1] || '').trim());
    const dt  = (blob.match(/<DTPOSTED>([^<]+)/i)?.[1] || '').slice(0,8);
    const name = (blob.match(/<NAME>([^<]+)/i)?.[1] || '').trim();
    if (!isFinite(amt) || !dt) continue;
    const iso = dt.replace(/(\d{4})(\d{2})(\d{2}).*/, '$1-$2-$3');
    out.push({ date: iso, merchant: name, amount: amt });
  }
  return out;
}
