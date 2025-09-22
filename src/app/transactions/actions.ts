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

import {
  roundUpTransaction as roundUpTransactionAI,
  RoundUpTransactionInput,
  RoundUpTransactionOutput
} from '@/ai/flows/round-up-transaction';
import { runCategorizer } from '@/lib/genkit/categorizer';

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

export async function roundUpTransaction(input: RoundUpTransactionInput): Promise<RoundUpTransactionOutput> {
  try {
    const result = await roundUpTransactionAI(input);
    return result;
  } catch (error) {
    console.error("Error in roundUpTransaction server action:", error);
    throw new Error("Failed to round up transaction.");
  }
}

export async function suggestCategories({ tenantId, txns }:{ tenantId: string; txns: { id:string; merchant:string; memo?:string; mcc?:string; amount:number }[] }){
  const out = await runCategorizer(tenantId, txns);
  return out; // [{ id, category, confidence }]
}
