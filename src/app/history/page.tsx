import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import HistoryTable from '@/components/HistoryTable';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { HistoryItem } from '@/lib/types';

async function getHistory(): Promise<HistoryItem[] | { error: string }> {
  try {
    const firestore = getFirestore(app);
    const historyCollection = collection(firestore, 'sentimatic_history');
    const q = query(historyCollection, orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const history: HistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamp exists and is a Firestore Timestamp
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        history.push({
          id: doc.id,
          input_text: data.input_text,
          sentiment: data.sentiment,
          confidence: data.confidence,
          timestamp: data.timestamp.toDate().toISOString(),
        });
      }
    });
    return history;
  } catch (error: any) {
    console.error("Error fetching history:", error);
    if (error.code === 'failed-precondition' || error.message.includes('firestore/permission-denied')) {
        return { error: 'Firestore is not configured correctly. Please check your Firebase project setup, environment variables, and security rules.' };
    }
    return { error: 'Could not fetch analysis history. Please try again later.' };
  }
}

export default async function HistoryPage() {
  const historyData = await getHistory();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Analysis History
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View your past 50 sentiment analyses.
        </p>
      </div>

      {Array.isArray(historyData) ? (
        <HistoryTable data={historyData} />
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching History</AlertTitle>
          <AlertDescription>{historyData.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
