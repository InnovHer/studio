import SentimentForm from '@/components/SentimentForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline">
          Analyze Text Sentiment
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Paste your text, or upload a file, and let our AI analyze its sentiment.
        </p>
      </div>
      <div className="mx-auto max-w-3xl mt-8">
        <SentimentForm />
      </div>
    </div>
  );
}
