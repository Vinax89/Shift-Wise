'use server';
/**
 * @fileOverview An AI agent for visualizing tax burdens based on ZIP code, using an LLM to retrieve local tax rules.
 *
 * - taxBurdenVisualization - A function that handles the tax burden visualization process.
 * - TaxBurdenVisualizationInput - The input type for the taxBurdenVisualization function.
 * - TaxBurdenVisualizationOutput - The return type for the taxBurdenVisualization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generate } from 'genkit';

export type TaxInput = {
  zip: string;
  filingStatus: 'single'|'married'|'hoh';
  grossAnnual: number;
  state: string;
  locality?: string;
};

export type TaxOutput = {
  federal: number; state: number; local: number;
  employer: { fica: number; futa?: number };
  notes?: string;
};

export async function llmSummarizeTax(input: TaxInput): Promise<TaxOutput> {
  // The LLM is for **explanatory text** only; real math should come from your rules engine.
  const sys = `You summarize tax components. You must output strict JSON with keys: federal, state, local, employer:{fica,futa?}, notes. No prose.`;
  const { text, outputText } = await generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: JSON.stringify(input),
    config: {
        custom: {role: 'system', content: sys}
    },
    output: { format: 'json' },
  } as any);
  try { return JSON.parse(outputText ?? text ?? '{}'); } catch { return { federal: 0, state: 0, local: 0, employer:{fica:0}, notes:'parse-fallback' }; }
}

const TaxBurdenVisualizationInputSchema = z.object({
  zipCode: z
    .string()
    .length(5)
    .regex(/^\d+$/)
    .describe('The ZIP code to calculate taxes for.'),
});
export type TaxBurdenVisualizationInput = z.infer<
  typeof TaxBurdenVisualizationInputSchema
>;

const TaxBurdenVisualizationOutputSchema = z.object({
  federalTax: z.number().describe('Federal tax amount.'),
  stateTax: z.number().describe('State tax amount.'),
  localTax: z.number().describe('Local tax amount.'),
  taxBurdenExplanation: z
    .string()
    .describe('Explanation of the tax burden calculation.'),
});
export type TaxBurdenVisualizationOutput = z.infer<
  typeof TaxBurdenVisualizationOutputSchema
>;

export async function taxBurdenVisualization(
  input: TaxBurdenVisualizationInput
): Promise<TaxBurdenVisualizationOutput> {
    const taxInput: TaxInput = {
        zip: input.zipCode,
        filingStatus: 'single', // placeholder
        grossAnnual: 50000, // placeholder
        state: 'CA', // placeholder
    };
    const result = await llmSummarizeTax(taxInput);
    return {
        federalTax: result.federal,
        stateTax: result.state,
        localTax: result.local,
        taxBurdenExplanation: result.notes || 'Taxes calculated based on provided information.'
    };
}