// app/transactions/page.tsx
import TransactionsController from './TransactionsController.client';

export default async function TransactionsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <section className="glass rounded-2xl p-4">
        <TransactionsController />
      </section>
    </main>
  );
}
