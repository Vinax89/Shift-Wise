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
import { Upload } from 'lucide-react';

export function ImportTransactionsDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV, OFX, or QFX file to import your transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="transaction-file">Transaction File</Label>
            <Input id="transaction-file" type="file" accept=".csv,.ofx,.qfx" onChange={handleFileChange} />
             {fileName && <p className="text-sm text-muted-foreground mt-2">Selected file: {fileName}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)} disabled={!fileName}>
            Import File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
