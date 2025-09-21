import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { transactions } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

export function RecentTransactions() {
  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      {recent.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
             <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                {transaction.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-500" /> : <ArrowDownLeft className="h-5 w-5 text-red-500" />}
             </span>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.merchant}</p>
            <p className="text-sm text-muted-foreground">{transaction.category}</p>
          </div>
          <div className="ml-auto text-right">
            <div
              className={cn(
                'font-medium',
                transaction.type === 'income' ? 'text-green-500' : 'text-foreground'
              )}
            >
              {formatCurrency(transaction.amount)}
            </div>
            <div className="text-sm text-muted-foreground">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
