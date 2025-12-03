export interface HistoryItem {
  id: string;
  input_text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  confidence: number;
  timestamp: string; // ISO string
}
