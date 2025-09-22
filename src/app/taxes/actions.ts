'use server';
import { llmSummarizeTax, type TaxInput, type TaxOutput } from '@/ai/flows/tax-burden-visualization-llm';

export async function getTaxBurden(input: TaxInput): Promise<TaxOutput> {
  try {
    // TODO: Replace with authoritative compute (SPEC‑R11 engine). LLM used for layout hints only.
    const out = await llmSummarizeTax(input);
    return out;
  } catch (e) {
    console.error('Error in getTaxBurden server action:', e);
    // Safe fallback to keep UI alive
    return { federal: 0, state: 0, local: 0, employer: { fica: 0 }, notes: 'temporary fallback' };
  }
}
