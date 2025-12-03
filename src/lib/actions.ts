'use server';

import { z } from 'zod';
import { categorizeText } from '@/ai/flows/categorize-text';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const FormSchema = z.object({
  text: z.string().min(1, {
    message: 'Text input cannot be empty.',
  }),
});

export type AnalysisResult = {
  inputText: string;
  category: 'Positive' | 'Negative' | 'Neutral';
  confidence: number;
  explanation: string;
};

type State = {
  result: AnalysisResult | null;
  error: string | null;
};

export async function analyzeSentiment(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { text } = validatedFields.data;

  try {
    const aiResult = await categorizeText({
      text,
      categories: 'Positive, Negative, Neutral',
    });

    const result: AnalysisResult = {
      inputText: text,
      category: aiResult.category as AnalysisResult['category'],
      confidence: aiResult.confidence,
      explanation: aiResult.explanation,
    };
    
    try {
        const firestore = getFirestore(app);
        // Don't await this, let it run in the background
        addDoc(collection(firestore, 'sentimatic_history'), {
            input_text: result.inputText,
            sentiment: result.category,
            confidence: result.confidence,
            explanation: result.explanation,
            timestamp: serverTimestamp(),
        }).catch(console.error);
    } catch (dbError) {
        console.error("Firestore error:", dbError);
        // Continue without saving to history if Firestore fails
    }


    return { result, error: null };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return {
      result: null,
      error: 'Failed to analyze sentiment. Please try again later.',
    };
  }
}
