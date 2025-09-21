import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/types';

export function TransactionRow({ t }: { t: Transaction }) {
  return (
    <div className={cn('flex items-center justify-between border-b border-border/60 bg-card px-3 py-3 h-full')}> 
      <div>
        <div className="font-medium text-card-foreground">{t.merchant}</div>
        <div className="text-xs text-muted-foreground">{t.date} {t.category ? `• ${t.category}` : ''}</div>
      </div>
      <div className={cn('text-sm font-semibold', t.amount < 0 ? 'text-danger' : 'text-success')}>{formatCurrency(t.amount)}</div>
    </div>
  );
}
