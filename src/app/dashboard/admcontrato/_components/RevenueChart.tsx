import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/axios/apiClient";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { RevenueData } from "../../analyze/page";


interface DateRange {
  from: Date;
  to: Date;
}

interface RevenueChartProps {
  data: RevenueData[];
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

export function RevenueChart({ data }: RevenueChartProps) {
 


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
