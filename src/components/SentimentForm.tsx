"use client";

import { useState, useRef, ChangeEvent, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeSentiment } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import SentimentResult from './SentimentResult';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalysisResult } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialState: { result: AnalysisResult | null; error: string | null } = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyze Sentiment
    </Button>
  );
}

export default function SentimentForm() {
  const [state, formAction] = useActionState(analyzeSentiment, initialState);
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedText = localStorage.getItem('sentimatic-single-text');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    if (state.error) {
       toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);
  
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);
      localStorage.setItem('sentimatic-single-text', newText);
  }


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
          toast({
              variant: "destructive",
              title: "File Too Large",
              description: "Please upload a file smaller than 1MB.",
          });
          return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setText(fileContent);
        localStorage.setItem('sentimatic-single-text', fileContent);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="grid w-full gap-2">
          <Label htmlFor="text-input">Enter your text</Label>
          <Textarea
            id="text-input"
            name="text"
            placeholder="Type or paste your text here..."
            className="min-h-[150px] text-base bg-card"
            value={text}
            onChange={handleTextChange}
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
              <p className="text-xs text-muted-foreground">.txt files only (max 1MB)</p>
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

      {state.error && !state.result && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && <SentimentResult result={state.result} />}
    </div>
  );
}
