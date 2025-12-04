'use client';

import type { HistoryItem } from '@/lib/types';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subDays, startOfDay } from 'date-fns';

interface SummaryDashboardProps {
  data: HistoryItem[];
}

const sentimentConfig = {
  Positive: { color: 'hsl(var(--chart-2))' },
  Negative: { color: 'hsl(var(--chart-5))' },
  Neutral: { color: 'hsl(var(--chart-4))' },
};

export default function SummaryDashboard({ data }: SummaryDashboardProps) {
  const { total, averageConfidence, sentimentDistribution, trendData } = useMemo(() => {
    if (data.length === 0) {
      return { total: 0, averageConfidence: 0, sentimentDistribution: [], trendData: [] };
    }

    const total = data.length;
    const totalConfidence = data.reduce((sum, item) => sum + item.confidence, 0);
    const averageConfidence = (totalConfidence / total) * 100;

    const counts = data.reduce(
      (acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<HistoryItem['sentiment'], number>
    );

    const sentimentDistribution = Object.entries(counts).map(([name, value]) => ({
      name: name as HistoryItem['sentiment'],
      value,
      fill: sentimentConfig[name as HistoryItem['sentiment']].color,
    }));

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), i);
      return {
        date: format(d, 'MMM d'),
        Positive: 0,
        Negative: 0,
        Neutral: 0,
      };
    }).reverse();
    
    const dateMap = new Map(last7Days.map(d => [d.date, d]));

    data.forEach(item => {
        const itemDate = startOfDay(new Date(item.timestamp));
        if (itemDate >= subDays(new Date(), 7)) {
            const dateStr = format(itemDate, 'MMM d');
            const dayData = dateMap.get(dateStr);
            if(dayData) {
                dayData[item.sentiment]++;
            }
        }
    });

    return { total, averageConfidence, sentimentDistribution, trendData: Array.from(dateMap.values()) };
  }, [data]);
  
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card">
        <h3 className="text-xl font-semibold">No Data for Summary</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Perform some analyses to see a summary here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in-50 duration-500">
        <Card>
            <CardHeader>
                <CardTitle>Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{total}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Avg. Confidence</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{averageConfidence.toFixed(1)}%</p>
            </CardContent>
        </Card>
        <Card className="sm:col-span-2">
            <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[120px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <PieChart layout="vertical" margin={{left: 50, right: 50}}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={sentimentDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                        >
                        {sentimentDistribution.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Sentiment Trend (Last 7 Days)</CardTitle>
                <CardDescription>
                    Volume of analyses by sentiment over the past week.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <BarChart data={trendData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="Positive" stackId="a" fill={sentimentConfig.Positive.color} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Neutral" stackId="a" fill={sentimentConfig.Neutral.color} />
                        <Bar dataKey="Negative" stackId="a" fill={sentimentConfig.Negative.color} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
