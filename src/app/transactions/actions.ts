'use server';

import { 
  scanReceiptAndCategorizeExpenses,
  ScanReceiptAndCategorizeExpensesInput,
  ScanReceiptAndCategorizeExpensesOutput
} from '@/ai/flows/scan-receipts-categorize-expenses';

import {
  categorizeTransaction as categorizeTransactionAI,
  CategorizeTransactionInput,
  CategorizeTransactionOutput
} from '@/ai/flows/categorize-transactions-ai';

export async function scanReceipt(input: ScanReceiptAndCategorizeExpensesInput): Promise<ScanReceiptAndCategorizeExpensesOutput> {
  try {
    const result = await scanReceiptAndCategorizeExpenses(input);
    return result;
  } catch (error) {
    console.error("Error in scanReceipt server action:", error);
    throw new Error("Failed to scan receipt.");
  }
}

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  try {
    const result = await categorizeTransactionAI(input);
    return result;
  } catch (error) {
    console.error("Error in categorizeTransaction server action:", error);
    throw new Error("Failed to categorize transaction.");
  }
}
