import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { ImportTransactionsDialog } from '@/components/transactions/import-transactions-dialog';
import { ScanReceiptDialog } from '@/components/transactions/scan-receipt-dialog';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View, manage, and categorize your financial transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <ImportTransactionsDialog />
          <ScanReceiptDialog />
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <TransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
