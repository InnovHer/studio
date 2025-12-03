"use client";

import { useMemo } from 'react';
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '@/lib/actions';
import { Separator } from './ui/separator';

interface SentimentResultProps {
  result: AnalysisResult;
}

const sentimentConfig = {
  Positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-2))',
    indicatorColor: 'bg-green-500',
    icon: <Smile className="h-8 w-8 text-green-500" />,
  },
  Negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-5))',
    indicatorColor: 'bg-red-500',
    icon: <Frown className="h-8 w-8 text-red-500" />,
  },
  Neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-4))',
    indicatorColor: 'bg-yellow-500',
    icon: <Meh className="h-8 w-8 text-yellow-500" />,
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
    <Card className="w-full animate-in fade-in-50 duration-500 shadow-xl rounded-2xl border-2 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline tracking-tighter">Analysis Complete!</CardTitle>
        <CardDescription>
          Here is the sentiment breakdown of your text.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-lg bg-card-foreground/5">
              <div className="flex items-center gap-3">
                {sentiment.icon}
                <Badge className="text-xl px-4 py-1" style={{ backgroundColor: sentiment.color, color: 'white' }}>{sentiment.label}</Badge>
              </div>
              <p className="text-6xl font-bold font-headline tracking-tighter">
                {(confidence * 100).toFixed(1)}%
              </p>
              <p className="text-lg text-muted-foreground -mt-2">Confidence</p>
            </div>
            <div className="grid grid-cols-2 items-center justify-center gap-4 p-4">
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
                    outerRadius={80}
                    strokeWidth={5}
                    startAngle={90}
                    endAngle={450}
                    cornerRadius={5}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart accessibilityLayer data={barChartData} margin={{ top: 20, right: 0, bottom: 20, left: 0 }} barSize={50}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={false}
                  />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="confidence" radius={8}>
                    <LabelList dataKey="confidence" position="top" formatter={(value: number) => `${value.toFixed(1)}%`} className="font-bold fill-foreground" />
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
        </div>

        <Separator />
        
        <div className="space-y-4 px-6 pb-6">
          <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-primary"/>
              <h3 className="text-xl font-semibold font-headline">Explanation</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {result.explanation}
          </p>
          <p className="text-sm text-muted-foreground italic text-center mt-4 p-3 bg-background rounded-md">
             &quot;{result.inputText.substring(0, 120)}{result.inputText.length > 120 ? '...' : ''}&quot;
           </p>
        </div>

      </CardContent>
    </Card>
  );
}
