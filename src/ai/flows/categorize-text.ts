'use server';

/**
 * @fileOverview A text categorization AI agent.
 *
 * - categorizeText - A function that handles the text categorization process.
 * - CategorizeTextInput - The input type for the categorizeText function.
 * - CategorizeTextOutput - The return type for the categorizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTextInputSchema = z.object({
  text: z.string().describe('The text to categorize.'),
  categories: z
    .string()
    .describe(
      'A comma separated list of categories to categorize the text into.'
    ),
});
export type CategorizeTextInput = z.infer<typeof CategorizeTextInputSchema>;

const CategorizeTextOutputSchema = z.object({
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
export type CategorizeTextOutput = z.infer<typeof CategorizeTextOutputSchema>;

export async function categorizeText(input: CategorizeTextInput): Promise<CategorizeTextOutput> {
  return categorizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTextPrompt',
  input: {schema: CategorizeTextInputSchema},
  output: {schema: CategorizeTextOutputSchema},
  prompt: `You are a text categorization expert. You will categorize the given text into one of the following categories and provide a brief explanation.

Categories: {{{categories}}}

Text: {{{text}}}

Respond with a JSON object that contains the category, the confidence score (0-1), and a brief, 1-2 sentence explanation for the categorization.
`,
});

const categorizeTextFlow = ai.defineFlow(
  {
    name: 'categorizeTextFlow',
    inputSchema: CategorizeTextInputSchema,
    outputSchema: CategorizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
