import BatchAnalysisForm from '@/components/BatchAnalysisForm';

export default function BatchPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline">
          Batch Sentiment Analysis
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Paste multiple lines of text or upload a file to analyze them all at once.
        </p>
      </div>
      <div className="mx-auto max-w-3xl mt-8">
        <BatchAnalysisForm />
      </div>
    </div>
  );
}
