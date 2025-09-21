'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScanLine, Loader2 } from 'lucide-react';
import { scanReceipt } from '@/app/transactions/actions';
import type { ScanReceiptAndCategorizeExpensesOutput } from '@/ai/flows/scan-receipts-categorize-expenses';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ScanReceiptDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanReceiptAndCategorizeExpensesOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setResult(null);
    } else {
      setFile(null);
    }
  };
  
  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const scanResult = await scanReceipt({ receiptDataUri: base64 });
        setResult(scanResult);
      } catch (error) {
        console.error('Receipt scan failed:', error);
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not extract information from the receipt. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "File Error",
          description: "There was a problem reading the uploaded file.",
        });
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setIsLoading(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
          <DialogDescription>
            Upload an image of a receipt to automatically extract transaction details.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="receipt-file">Receipt Image</Label>
            <Input id="receipt-file" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Scanning receipt...</span>
            </div>
          )}
        </div>
        ) : (
        <div className="space-y-4 py-4">
            <h4 className="font-semibold">Extracted Information</h4>
            <div className="rounded-md border p-4 space-y-2 text-sm">
                <p><strong>Merchant:</strong> {result.merchant}</p>
                <p><strong>Date:</strong> {result.date}</p>
                <p><strong>Total:</strong> {formatCurrency(result.totalAmount)}</p>
                <p><strong>Category:</strong> {result.category}</p>
            </div>
        </div>
        )}
        
        <DialogFooter>
          {result ? (
              <Button onClick={() => handleOpenChange(false)}>Add Transaction</Button>
          ) : (
             <Button onClick={handleScan} disabled={!file || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                Scan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
