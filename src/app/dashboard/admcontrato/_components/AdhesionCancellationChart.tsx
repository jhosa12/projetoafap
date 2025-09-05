import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/axios/apiClient";
import { removerFusoDate } from "@/utils/removerFusoDate";

interface DateRange {
  from: Date;
  to: Date;
}

interface AdhesionCancellationChartProps {
 
  data: ChartData[];
}

interface ChartData {
  month: string;
  adhesions: number;
  cancellations: number;
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

export function AdhesionCancellationChart({
  data
}: AdhesionCancellationChartProps) {
 


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
