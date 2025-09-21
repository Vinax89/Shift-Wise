import { getTransactions } from '@/lib/data/transactions';
import dynamic from 'next/dynamic';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { ImportTransactionsDialog } from '@/components/transactions/import-transactions-dialog';
import { ScanReceiptDialog } from '@/components/transactions/scan-receipt-dialog';

const VirtualList = dynamic(() => import('@/components/transactions/VirtualList').then(m => m.VirtualList), { ssr: false });

export default async function TransactionsPage() {
  const txs = await getTransactions(5000);
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View, manage, and categorize your financial transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <ImportTransactionsDialog />
          <ScanReceiptDialog />
        </div>
      </div>
      <section className="glass rounded-2xl p-4">
        {txs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <VirtualList rows={txs.map((t) => <TransactionRow key={t.id} t={t} />)} />
        )}
      </section>
    </div>
  );
}
