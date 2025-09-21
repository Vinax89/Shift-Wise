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
  return taxBurdenVisualizationFlow(input);
}

const getTaxRules = ai.defineTool({
  name: 'getTaxRules',
  description: 'Retrieves federal, state, and local tax rules for a given ZIP code.',
  inputSchema: z.object({
    zipCode: z
      .string()
      .length(5)
      .regex(/^\d+$/)
      .describe('The ZIP code to retrieve tax rules for.'),
  }),
  outputSchema: z.string().describe('The tax rules for the given ZIP code.'),
},
async input => {
    // TODO: Add actual implementation here to fetch tax rules for the given zip code
    // For now, return a dummy string
    return `Tax rules for zip code ${input.zipCode}: Federal: 24%, State: 6%, Local: 2%`;
  }
);

const prompt = ai.definePrompt({
  name: 'taxBurdenVisualizationPrompt',
  tools: [getTaxRules],
  input: {schema: TaxBurdenVisualizationInputSchema},
  output: {schema: TaxBurdenVisualizationOutputSchema},
  prompt: `You are a tax expert who visualizes tax burdens for users based on their ZIP code.

  First, call the getTaxRules tool to get the tax rules for the given ZIP code.
  Then, calculate the federal, state, and local taxes based on these rules.
  Finally, create a tax burden explanation for the user.

  ZIP Code: {{{zipCode}}}

  The tax rules: {{await getTaxRules zipCode=zipCode}}

  Based on the tax rules and ZIP code, please provide the following information:
  - federalTax: The calculated federal tax amount.
  - stateTax: The calculated state tax amount.
  - localTax: The calculated local tax amount.
  - taxBurdenExplanation: An explanation of how the tax burden was calculated.
  `,
});

const taxBurdenVisualizationFlow = ai.defineFlow(
  {
    name: 'taxBurdenVisualizationFlow',
    inputSchema: TaxBurdenVisualizationInputSchema,
    outputSchema: TaxBurdenVisualizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
