'use server';

import {
  taxBurdenVisualization,
  TaxBurdenVisualizationInput,
  TaxBurdenVisualizationOutput,
} from '@/ai/flows/tax-burden-visualization-llm';

export async function getTaxBurden(input: TaxBurdenVisualizationInput): Promise<TaxBurdenVisualizationOutput> {
  try {
    const result = await taxBurdenVisualization(input);
    return result;
  } catch (error) {
    console.error('Error in getTaxBurden server action:', error);
    throw new Error('Failed to calculate tax burden.');
  }
}
