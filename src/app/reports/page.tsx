import ReportsClient from '@/components/reports/ReportsClient';
import { RangeSyncProvider } from '@/components/charts/RangeSyncContext';

export default async function Page(){
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <RangeSyncProvider>
        <ReportsClient />
      </RangeSyncProvider>
    </main>
  );
}
