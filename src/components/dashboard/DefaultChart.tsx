import React from 'react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";

interface DateRange {
  from: Date;
  to: Date;
}

interface DefaultChartProps {
  dateRange: DateRange;
}

const chartConfig = {
  defaultRate: {
    label: "Taxa de Inadimplência (%)",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function DefaultChart({ dateRange }: DefaultChartProps) {
  // Dados simulados - substitua pela sua API
  const data = [
    { month: "Jan", defaultRate: 15.2 },
    { month: "Fev", defaultRate: 13.8 },
    { month: "Mar", defaultRate: 16.5 },
    { month: "Abr", defaultRate: 12.1 },
    { month: "Mai", defaultRate: 14.3 },
    { month: "Jun", defaultRate: 11.7 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="defaultRate" 
            stroke="var(--color-defaultRate)" 
            fill="var(--color-defaultRate)" 
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}