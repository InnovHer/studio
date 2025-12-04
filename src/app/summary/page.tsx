import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { HistoryItem } from '@/lib/types';
import SummaryDashboard from '@/components/SummaryDashboard';

async function getHistory(): Promise<HistoryItem[] | { error: string }> {
  try {
    // Ensure Firebase project ID is available
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error('Firebase project ID is not configured. Please check your .env file.');
    }
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
    if (error.code === 'permission-denied' || (error.message && error.message.includes('permission-denied'))) {
        return { error: 'Firestore permission denied. Please check your security rules in the Firebase console.' };
    }
     if (error.message && error.message.includes('Firebase project ID is not configured')) {
        return { error: 'Your Firebase project is not configured correctly. Please check your environment variables.' };
    }
    if (error.message && error.message.includes('firestore.googleapis.com')) {
        return { error: 'The Cloud Firestore API is not enabled for your project. Please enable it in the Google Cloud console and refresh the page.' };
    }
    return { error: 'Could not fetch analysis history. Please ensure your Firebase project is set up correctly and try again later.' };
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
