"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


interface ChartProps{
    data:Array<{x:string,y:number,z:number}>
}
export function BarChartMensalidade({data}:ChartProps) {
  return (
  
    <Card className="flex flex-col w-full max-w-3xl min-h-[300px] p-4"> {/* 🔹 Ajuste de tamanho */}
    <CardHeader>
      <CardTitle>Bar Chart - Label</CardTitle>
      <CardDescription>January - June 2024</CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center items-center"> {/* 🔹 Centraliza o gráfico */}
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart
            accessibilityLayer
          data={data}
          margin={{ top: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 10)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="y" fill="var(--color-desktop)" stackId="a"  radius={[0, 0, 4, 4]}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
          <Bar dataKey="z" fill="#3498db" stackId="a"  radius={[4, 4, 0, 0]}>
          
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
   
  )
}
