import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-text.ts';
import '@/ai/flows/categorize-text-batch.ts';
import '@/ai/flows/summarize-large-text.ts';
import '@/ai/flows/suggest-improvements.ts';
