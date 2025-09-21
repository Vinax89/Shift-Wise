'use server';
/**
 * @fileOverview This file defines a Genkit flow for scanning receipts using OCR and AI to automatically extract key information and categorize expenses.
 *
 * - scanReceiptAndCategorizeExpenses - A function that handles the receipt scanning and expense categorization process.
 * - ScanReceiptAndCategorizeExpensesInput - The input type for the scanReceiptAndCategorizeExpenses function.
 * - ScanReceiptAndCategorizeExpensesOutput - The return type for the scanReceiptAndCategorizeExpenses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanReceiptAndCategorizeExpensesInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanReceiptAndCategorizeExpensesInput = z.infer<typeof ScanReceiptAndCategorizeExpensesInputSchema>;

const ScanReceiptAndCategorizeExpensesOutputSchema = z.object({
  merchant: z.string().describe('The name of the merchant on the receipt.'),
  date: z.string().describe('The date of the transaction on the receipt.'),
  totalAmount: z.number().describe('The total amount of the transaction.'),
  category: z.string().describe('The category of the expense (e.g., food, transportation, utilities).'),
  items: z.array(z.object({
    description: z.string().describe('Description of the item'),
    amount: z.number().describe('Amount of the item'),
  })).describe('Itemized list of items purchased, with description and amount for each item.'),
});
export type ScanReceiptAndCategorizeExpensesOutput = z.infer<typeof ScanReceiptAndCategorizeExpensesOutputSchema>;

export async function scanReceiptAndCategorizeExpenses(input: ScanReceiptAndCategorizeExpensesInput): Promise<ScanReceiptAndCategorizeExpensesOutput> {
  return scanReceiptAndCategorizeExpensesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanReceiptAndCategorizeExpensesPrompt',
  input: {schema: ScanReceiptAndCategorizeExpensesInputSchema},
  output: {schema: ScanReceiptAndCategorizeExpensesOutputSchema},
  prompt: `You are an AI assistant that extracts information from receipts and categorizes expenses.

  Analyze the receipt image and extract the following information:
  - Merchant name
  - Transaction date
  - Total amount
  - Category of expense
  - Itemized list of items purchased, with description and amount for each item

  Here is the receipt image: {{media url=receiptDataUri}}

  Return the extracted information in JSON format.
  Make sure the totalAmount and amount fields are numbers (not strings).`,
});

const scanReceiptAndCategorizeExpensesFlow = ai.defineFlow(
  {
    name: 'scanReceiptAndCategorizeExpensesFlow',
    inputSchema: ScanReceiptAndCategorizeExpensesInputSchema,
    outputSchema: ScanReceiptAndCategorizeExpensesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
