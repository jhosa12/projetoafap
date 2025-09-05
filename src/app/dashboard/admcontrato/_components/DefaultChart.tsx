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
import { DefaultData } from '@/pages/dashboard/analyze';


interface DefaultChartProps {
 
  data: DefaultData[];
}




const chartConfig = {
  defaultRate: {
    label: "Taxa de Inadimplência (%)",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function DefaultChart({ data }: DefaultChartProps) {
  // Dados simulados - substitua pela sua API


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