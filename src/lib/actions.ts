'use server';

import { z } from 'zod';
import { categorizeText } from '@/ai/flows/categorize-text';
import { categorizeTextBatch } from '@/ai/flows/categorize-text-batch';
import { getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
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
        const docRef = collection(firestore, 'sentimatic_history');
        addDoc(docRef, {
            input_text: result.inputText,
            sentiment: result.category,
            confidence: result.confidence,
            explanation: result.explanation,
            timestamp: serverTimestamp(),
        }).catch(console.error);
    } catch (dbError) {
        console.error("Firestore error:", dbError);
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

// Batch processing
export type BatchAnalysisResult = {
  results: AnalysisResult[];
}

type BatchState = {
  result: BatchAnalysisResult | null;
  error: string | null;
}

const BatchFormSchema = z.object({
  text: z.string().min(1, {
    message: 'Text input cannot be empty.',
  }),
});

export async function analyzeSentimentBatch(
  prevState: BatchState,
  formData: FormData
): Promise<BatchState> {
   const validatedFields = BatchFormSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      result: null,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { text } = validatedFields.data;
  const texts = text.split('\n').filter(t => t.trim() !== '');

  if (texts.length === 0) {
    return {
      result: null,
      error: 'No text to analyze. Please provide at least one line of text.',
    }
  }

  try {
    const aiResult = await categorizeTextBatch({
      texts,
      categories: 'Positive, Negative, Neutral',
    });

    const results: AnalysisResult[] = aiResult.results;

    try {
      const firestore = getFirestore(app);
      const historyCollection = collection(firestore, 'sentimatic_history');
      const batch = writeBatch(firestore);
      
      results.forEach(result => {
        const newDocRef = doc(historyCollection);
        batch.set(newDocRef, {
          input_text: result.inputText,
          sentiment: result.category,
          confidence: result.confidence,
          explanation: result.explanation,
          timestamp: serverTimestamp(),
        });
      });

      batch.commit().catch(console.error);
    } catch (dbError) {
      console.error("Firestore batch write error:", dbError);
    }

    return { result: { results }, error: null };
  } catch (error) {
    console.error('Batch sentiment analysis failed:', error);
    return {
      result: null,
      error: 'Failed to analyze sentiment for the batch. Please try again later.',
    };
  }
}
