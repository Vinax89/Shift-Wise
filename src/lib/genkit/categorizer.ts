
'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionsInputSchema = z.object({
  tenantId: z.string().describe('The tenant ID for multi-tenant isolation.'),
  txns: z.array(z.object({
    id: z.string(),
    merchant: z.string(),
    amount: z.number()
  })).describe('An array of transactions to categorize.')
});

const CategorizeTransactionsOutputSchema = z.object({
  categorizations: z.array(z.object({
    id: z.string().describe('The ID of the transaction.'),
    category: z.string().describe('The suggested category.'),
    confidence: z.number().describe('A confidence score from 0 to 1.')
  }))
});


const prompt = ai.definePrompt({
  name: 'categorizeTransactionsPrompt',
  input: { schema: CategorizeTransactionsInputSchema },
  output: { schema: CategorizeTransactionsOutputSchema },
  prompt: `
    You are an expert financial assistant. Your task is to categorize a list of transactions for a specific user (tenant).
    Use the following taxonomy for categories: Income, Groceries, Transport, Dining, Housing, Utilities, Health, Subscriptions, Shopping, Entertainment, Education, Fees, Transfers, Savings, Investments, Gifts, Travel, Insurance, Taxes, Uncategorized.

    Tenant ID: {{{tenantId}}}

    Transactions to categorize:
    {{#each txns}}
    - ID: {{this.id}}, Merchant: "{{this.merchant}}", Amount: {{this.amount}}
    {{/each}}

    Return a JSON object with a single key "categorizations" containing an array of objects, where each object has "id", "category", and "confidence".
  `,
});

const categorizeFlow = ai.defineFlow(
  {
    name: 'categorizeFlow',
    inputSchema: CategorizeTransactionsInputSchema,
    outputSchema: CategorizeTransactionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function runCategorizer(tenantId: string, txns: { id:string; merchant:string; amount:number }[]): Promise<{ id: string; category: string; confidence: number }[]> {
  const result = await categorizeFlow({ tenantId, txns });
  return result.categorizations || [];
}
