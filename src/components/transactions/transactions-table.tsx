'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { transactions as initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { categorizeTransaction } from '@/app/transactions/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryColorMap: { [key: string]: string } = {
  Groceries: 'bg-green-100 text-green-800 border-green-200',
  Utilities: 'bg-blue-100 text-blue-800 border-blue-200',
  Food: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Transportation: 'bg-purple-100 text-purple-800 border-purple-200',
  Rent: 'bg-red-100 text-red-800 border-red-200',
  Income: 'bg-teal-100 text-teal-800 border-teal-200',
  'Uncategorized': 'bg-gray-100 text-gray-800 border-gray-200'
};

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categorizingId, setCategorizingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCategorize = async (transaction: Transaction) => {
    setCategorizingId(transaction.id);
    try {
      const result = await categorizeTransaction({
        transactionDescription: transaction.merchant,
        transactionAmount: transaction.amount,
      });

      setTransactions(prev =>
        prev.map(t =>
          t.id === transaction.id ? { ...t, category: result.category } : t
        )
      );
      toast({
        title: "Transaction Categorized",
        description: `"${transaction.merchant}" was categorized as ${result.category}.`
      })
    } catch (error) {
      console.error("Categorization failed:", error);
      toast({
        variant: 'destructive',
        title: "Categorization Failed",
        description: "Could not automatically categorize the transaction."
      })
    } finally {
      setCategorizingId(null);
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Merchant</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.merchant}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {format(new Date(transaction.date), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(categoryColorMap[transaction.category] || categoryColorMap['Uncategorized'])}
                >
                  {transaction.category}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleCategorize(transaction)}
                  disabled={categorizingId === transaction.id}
                  aria-label="Categorize with AI"
                >
                  {categorizingId === transaction.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </TableCell>
            <TableCell
              className={cn(
                'text-right font-semibold',
                transaction.type === 'income' ? 'text-green-600' : 'text-slate-800'
              )}
            >
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
