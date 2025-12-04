'use client';

import { Button } from '@/components/ui/button';
import type { AnalysisResult } from '@/lib/actions';
import { Download } from 'lucide-react';

interface ExportResultsProps {
  results: AnalysisResult[];
}

export function ExportResults({ results }: ExportResultsProps) {
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(results, null, 2);
    downloadFile(jsonContent, 'analysis-results.json', 'application/json');
  };

  const handleExportCSV = () => {
    const headers = ['inputText', 'category', 'confidence', 'explanation'];
    const csvRows = [
      headers.join(','),
      ...results.map(row => {
        const values = headers.map(header => {
          const value = row[header as keyof AnalysisResult];
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        return values.join(',');
      }),
    ];
    const csvContent = csvRows.join('\n');
    downloadFile(csvContent, 'analysis-results.csv', 'text/csv');
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={handleExportCSV}>
        <Download className="mr-2 h-4 w-4" />
        Export as CSV
      </Button>
      <Button variant="outline" onClick={handleExportJSON}>
        <Download className="mr-2 h-4 w-4" />
        Export as JSON
      </Button>
    </div>
  );
}
