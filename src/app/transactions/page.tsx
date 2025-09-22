import { getTransactions } from '@/lib/data/transactions';
import { TransactionsList } from '@/components/transactions/transactions-list';

export default async function TransactionsPage() {
  const txs = await getTransactions(5000);
  return (
    <main className="mx-auto max-w-6xl p-4">
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Transactions</h1>
        </header>
        {txs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <TransactionsList transactions={txs} />
        )}
      </section>
    </main>
  );
}
