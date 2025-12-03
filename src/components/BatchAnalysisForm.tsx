"use client";

import { useState, useRef, ChangeEvent, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeSentimentBatch } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { BatchAnalysisResult } from '@/lib/actions';
import { BatchResultTable } from './BatchResultTable';

const initialState: { result: BatchAnalysisResult | null; error: string | null } = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyze Batch
    </Button>
  );
}

export default function BatchAnalysisForm() {
  const [state, formAction] = useActionState(analyzeSentimentBatch, initialState);
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setText(fileContent);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="grid w-full gap-2">
          <Label htmlFor="text-input">Enter your text (one per line)</Label>
          <Textarea
            id="text-input"
            name="text"
            placeholder="Type or paste your text here, with each entry on a new line..."
            className="min-h-[200px] text-base bg-card"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Or upload a text file</Label>
          <div 
            className="relative flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 transition-colors hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
            tabIndex={0}
            role="button"
            aria-label="Upload a text file"
          >
            <div className="text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">.txt files with one entry per line</p>
            </div>
            <Input
              ref={fileInputRef}
              id="file-upload"
              name="file"
              type="file"
              className="sr-only"
              accept=".txt"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && <BatchResultTable results={state.result.results} />}
    </div>
  );
}
