import QuickAddClient from '@/components/calendar/QuickAddClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <h1 className="text-xl font-semibold">Calendar</h1>
      <QuickAddClient />
      {/* Render your calendar grid/month/agenda below */}
    </main>
  );
}
