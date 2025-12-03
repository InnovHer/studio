'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/lib/actions';

interface BatchResultTableProps {
  results: AnalysisResult[];
}

const sentimentColors: Record<AnalysisResult['category'], string> = {
  Positive: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  Negative: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  Neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
};

export function BatchResultTable({ results }: BatchResultTableProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card">
        <h3 className="text-xl font-semibold">No Results</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The analysis returned no results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableCaption>A list of your batch sentiment analyses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Text</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Explanation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <p className="truncate max-w-xs xl:max-w-md">
                  {item.inputText}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('font-semibold', sentimentColors[item.category] || sentimentColors.Neutral)}>
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell>{(item.confidence * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.explanation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
