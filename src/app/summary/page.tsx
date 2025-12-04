import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { HistoryItem } from '@/lib/types';
import SummaryDashboard from '@/components/SummaryDashboard';

async function getHistory(): Promise<HistoryItem[] | { error: string }> {
  try {
    const firestore = getFirestore(app);
    const historyCollection = collection(firestore, 'sentimatic_history');
    const q = query(historyCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const history: HistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        history.push({
          id: doc.id,
          input_text: data.input_text,
          sentiment: data.sentiment,
          confidence: data.confidence,
          timestamp: data.timestamp.toDate().toISOString(),
          explanation: data.explanation
        });
      }
    });
    return history;
  } catch (error: any) {
    console.error("Error fetching history:", error);
    if (error.code === 'failed-precondition' || error.message.includes('firestore/permission-denied')) {
        return { error: 'Firestore is not configured correctly. Please check your Firebase project setup and security rules.' };
    }
    return { error: 'Could not fetch analysis history. Please try again later.' };
  }
}

export default async function SummaryPage() {
  const historyData = await getHistory();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Analysis Summary
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          An overview of all your past analyses.
        </p>
      </div>

      {Array.isArray(historyData) ? (
        <SummaryDashboard data={historyData} />
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

export const revalidate = 60;
