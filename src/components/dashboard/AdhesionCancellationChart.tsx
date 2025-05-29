import React from 'react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";

interface DateRange {
  from: Date;
  to: Date;
}

interface AdhesionCancellationChartProps {
  dateRange: DateRange;
}

const chartConfig = {
  adhesions: {
    label: "Adesões",
    color: "hsl(var(--chart-1))",
  },
  cancellations: {
    label: "Cancelamentos",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function AdhesionCancellationChart({ dateRange }: AdhesionCancellationChartProps) {
  // Dados simulados - substitua pela sua API
  const data = [
    { month: "Jan", adhesions: 89, cancellations: 23 },
    { month: "Fev", adhesions: 95, cancellations: 18 },
    { month: "Mar", adhesions: 102, cancellations: 31 },
    { month: "Abr", adhesions: 87, cancellations: 15 },
    { month: "Mai", adhesions: 134, cancellations: 42 },
    { month: "Jun", adhesions: 116, cancellations: 28 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="adhesions" fill="var(--color-adhesions)" />
          <Bar dataKey="cancellations" fill="var(--color-cancellations)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}