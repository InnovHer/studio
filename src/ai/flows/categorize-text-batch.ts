'use server';

/**
 * @fileOverview A text categorization AI agent for batch processing.
 *
 * - categorizeTextBatch - A function that handles batch text categorization.
 * - CategorizeTextBatchInput - The input type for the categorizeTextBatch function.
 * - CategorizeTextBatchOutput - The return type for the categorizeTextBatch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeTextBatchInputSchema = z.object({
  texts: z.array(z.string()).describe('The texts to categorize.'),
  categories: z
    .string()
    .describe(
      'A comma separated list of categories to categorize the text into.'
    ),
});
export type CategorizeTextBatchInput = z.infer<typeof CategorizeTextBatchInputSchema>;

const SingleCategorizationResultSchema = z.object({
  inputText: z.string().describe('The original text that was analyzed.'),
  category: z.string().describe('The category the text belongs to.'),
  confidence: z
    .number()
    .describe(
      'The confidence score (0-1) that the text belongs to the category.'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation (1-2 sentences) of why the text was assigned its category.'
    ),
});

const CategorizeTextBatchOutputSchema = z.object({
  results: z.array(SingleCategorizationResultSchema),
});
export type CategorizeTextBatchOutput = z.infer<typeof CategorizeTextBatchOutputSchema>;

export async function categorizeTextBatch(input: CategorizeTextBatchInput): Promise<CategorizeTextBatchOutput> {
  return categorizeTextBatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTextBatchPrompt',
  input: { schema: CategorizeTextBatchInputSchema },
  output: { schema: CategorizeTextBatchOutputSchema },
  prompt: `You are a text categorization expert. For each text provided in the array, you will categorize it into one of the following categories and provide a brief explanation.

Categories: {{{categories}}}

Texts:
{{#each texts}}
- "{{this}}"
{{/each}}

Respond with a JSON object containing a "results" array. Each item in the array should be an object with the original "inputText", its assigned "category", a "confidence" score (0-1), and a brief, 1-2 sentence "explanation".
`,
});

const categorizeTextBatchFlow = ai.defineFlow(
  {
    name: 'categorizeTextBatchFlow',
    inputSchema: CategorizeTextBatchInputSchema,
    outputSchema: CategorizeTextBatchOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
