'use client';
export default function CalendarMonth({ today }: { today: string }){
  return (
    <section className="glass rounded-xl p-3">
      <div className="text-sm text-muted">Month view placeholder — {new Date(today).toLocaleDateString()}</div>
    </section>
  );
}
