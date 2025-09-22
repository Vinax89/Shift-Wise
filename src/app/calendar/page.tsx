import dynamic from 'next/dynamic';

const CalendarMonth = dynamic(() => import('@/components/calendar/CalendarMonth.client'), { ssr:false });
const AgendaVirtual = dynamic(() => import('@/components/calendar/AgendaVirtual.client'), { ssr:false });

async function getCalendarData(){
  // TODO: swap with Firestore/Functions
  const now = new Date();
  const monthItems = [
    { id:'1', date: now.toISOString().slice(0,10), kind:'shift', title:'Shift 7a–3p', amount: 312 },
    { id:'2', date: now.toISOString().slice(0,10), kind:'bill', title:'Rent', amount: -1800 },
  ] as any[];
  const agenda = [
    { id:'a1', date: now.toISOString().slice(0,10), title:'Shift 7a–3p', meta:'ER', amount:312 },
    { id:'a2', date: now.toISOString().slice(0,10), title:'Rent', amount:-1800 },
  ];
  return { monthItems, agenda };
}

export default async function CalendarPage(){
  const { monthItems, agenda } = await getCalendarData();
  const now = new Date();
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Calendar</h1>
        </header>
        <CalendarMonth year={now.getFullYear()} month={now.getMonth()} items={monthItems as any} onNew={(d)=>{/* open quick-add */}} onOpen={(id)=>{/* open drawer */}} />
      </section>
      <section className="glass rounded-2xl p-4">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Agenda</h2>
        </header>
        <AgendaVirtual rows={agenda as any} onOpen={(id)=>{/* open drawer */}}/>
      </section>
    </main>
  );
}
