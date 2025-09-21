import { Transaction } from "../types";

export async function getTransactions(limit = 5000): Promise<Transaction[]> {
  try {
    // This is a placeholder. In a real app, you would fetch from an API.
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? ''}/api/transactions?limit=${limit}`, { next: { revalidate: 120, tags: ['transactions'] } });
    // if (!res.ok) throw new Error('bad');
    // return (await res.json()) as Transaction[];
    
    // For now, returning mock data.
    const { transactions } = await import('@/lib/data');
    return transactions;

  } catch {
    return [];
  }
}
