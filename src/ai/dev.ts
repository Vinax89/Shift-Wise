import { config } from 'dotenv';
config();

import '@/ai/flows/scan-receipts-categorize-expenses.ts';
import '@/ai/flows/categorize-transactions-ai.ts';
import '@/ai/flows/tax-burden-visualization-llm.ts';