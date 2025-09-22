import OverviewClient from '@/components/overview/OverviewClient';

async function getHomeTrend(){
  // TODO: Firestore/Functions; demo data for instant visuals
  return [
    { month:'Jan', inflow:2400, outflow:2100 },
    { month:'Feb', inflow:2200, outflow:1900 },
    { month:'Mar', inflow:2600, outflow:2300 },
    { month:'Apr', inflow:2550, outflow:2400 },
    { month:'May', inflow:2800, outflow:2600 },
    { month:'Jun', inflow:2750, outflow:2500 },
  ];
}

export default async function Page(){
  const trend = await getHomeTrend();
  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <OverviewClient trend={trend} />
    </main>
  );
}
