import BudgetClient from '@/components/budget/BudgetClient';

export default async function Page(){
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-semibold">Budget Planner</h1>
      <BudgetClient />
    </main>
  );
}
