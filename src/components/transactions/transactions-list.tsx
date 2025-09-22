'use client';

import dynamic from 'next/dynamic';
import type { Transaction } from '@/lib/types';
import { TransactionRow } from '@/components/transactions/TransactionRow';

const VirtualList = dynamic(() => import('@/components/transactions/VirtualList').then(m => m.VirtualList), { ssr: false });

interface TransactionsListProps {
    transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    return (
        <VirtualList rows={transactions.map((t) => <TransactionRow key={t.id} t={t} />)} />
    );
}
