"use client";

import { useMemo } from 'react';
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { AnalysisResult } from '@/lib/actions';

interface SentimentResultProps {
  result: AnalysisResult;
}

const sentimentConfig = {
  Positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-2))',
    indicatorColor: 'bg-green-500',
  },
  Negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-5))',
    indicatorColor: 'bg-red-500',
  },
  Neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-4))',
    indicatorColor: 'bg-yellow-500',
  },
};

export default function SentimentResult({ result }: SentimentResultProps) {
  const { category, confidence } = result;
  const sentiment = sentimentConfig[category] || sentimentConfig.Neutral;

  const pieChartData = useMemo(() => [
    { name: category, value: confidence, fill: sentiment.color },
    { name: 'Other', value: 1 - confidence, fill: 'hsl(var(--muted))' },
  ], [category, confidence, sentiment.color]);

  const barChartData = useMemo(() => [
    { name: category, confidence: confidence * 100, fill: sentiment.color }
  ], [category, confidence, sentiment.color]);

  const chartConfig = {
    score: {
      label: 'Confidence',
    },
    [category]: {
      label: category,
      color: sentiment.color,
    },
  };

  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
        <CardDescription>
          The sentiment of your text has been analyzed.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${sentiment.indicatorColor}`} />
            <p className="text-lg font-semibold">{sentiment.label}</p>
          </div>
          <p className="text-4xl font-bold">
            {(confidence * 100).toFixed(1)}%
            <span className="text-sm font-normal text-muted-foreground ml-2">Confidence</span>
          </p>
          <p className="text-sm text-muted-foreground italic">
            &quot;{result.inputText.substring(0, 100)}{result.inputText.length > 100 ? '...' : ''}&quot;
          </p>
        </div>
        <div className="grid grid-cols-2 items-center justify-center gap-4">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                startAngle={90}
                endAngle={450}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="outline-none" />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={barChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="confidence" radius={4}>
                 {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
