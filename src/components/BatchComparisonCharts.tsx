'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { AnalysisResult } from '@/lib/actions';

interface BatchComparisonChartsProps {
  results: AnalysisResult[];
}

const sentimentConfig = {
  Positive: { color: 'hsl(var(--chart-2))' },
  Negative: { color: 'hsl(var(--chart-5))' },
  Neutral: { color: 'hsl(var(--chart-4))' },
};

export default function BatchComparisonCharts({ results }: BatchComparisonChartsProps) {
  const sentimentDistribution = useMemo(() => {
    const counts = results.reduce(
      (acc, result) => {
        acc[result.category] = (acc[result.category] || 0) + 1;
        return acc;
      },
      {} as Record<AnalysisResult['category'], number>
    );

    return Object.entries(counts).map(([name, value]) => ({
      name: name as AnalysisResult['category'],
      value,
      fill: sentimentConfig[name as AnalysisResult['category']].color,
    }));
  }, [results]);

  const confidenceData = useMemo(
    () =>
      results.map((result, index) => ({
        name: `Text ${index + 1}`,
        confidence: result.confidence * 100,
        fill: sentimentConfig[result.category].color,
        tooltip: result.inputText,
      })),
    [results]
  );
  
  const chartConfig = {
    confidence: {
      label: 'Confidence',
    },
    ...results.reduce((acc, result, index) => {
      acc[`Text ${index + 1}`] = {
        label: `Text ${index + 1}`,
        color: sentimentConfig[result.category].color,
      };
      return acc;
    }, {} as any)
  };


  return (
    <Card className="w-full animate-in fade-in-50 duration-500 shadow-xl rounded-2xl border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-3xl font-headline tracking-tighter text-center">
          Comparative Analysis
        </CardTitle>
        <CardDescription className="text-center">
          Here is a visual breakdown of your batch analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-center font-headline">Sentiment Distribution</h3>
          <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={sentimentDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <LabelList
                  dataKey="value"
                  className="fill-background font-bold"
                  stroke="none"
                  fontSize={12}
                />
                {sentimentDistribution.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-center font-headline">Confidence Scores</h3>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
             <BarChart 
                accessibilityLayer 
                data={confidenceData} 
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
             >
              <CartesianGrid vertical={false} />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <XAxis dataKey="name" tick={false}/>
              <ChartTooltip content={
                <ChartTooltipContent 
                    formatter={(value, name, props) => (
                        <div className="flex flex-col">
                            <span className="font-bold">{props.payload.tooltip}</span>
                            <span>Confidence: {Number(value).toFixed(1)}%</span>
                        </div>
                    )}
                />
              } />
              <Bar dataKey="confidence" radius={4}>
                 {confidenceData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
