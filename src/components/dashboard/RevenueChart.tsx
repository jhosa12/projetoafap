import React from 'react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";

interface DateRange {
  from: Date;
  to: Date;
}

interface RevenueChartProps {
  dateRange: DateRange;
}

const chartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "hsl(var(--chart-1))",
  },
  quantity: {
    label: "Quantidade",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueChart({ dateRange }: RevenueChartProps) {
  // Dados simulados - substitua pela sua API
  const data = [
    { month: "Jan", revenue: 12000, quantity: 45 },
    { month: "Fev", revenue: 15000, quantity: 52 },
    { month: "Mar", revenue: 18000, quantity: 61 },
    { month: "Abr", revenue: 22000, quantity: 73 },
    { month: "Mai", revenue: 19000, quantity: 65 },
    { month: "Jun", revenue: 25000, quantity: 84 },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="quantity" 
            stroke="var(--color-quantity)" 
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}