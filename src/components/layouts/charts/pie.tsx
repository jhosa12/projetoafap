import { LabelList, Pie, PieChart } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { ChatProps } from "@/app/dashboard/vendas/_components/sales/SalesChart"

/*const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]*/





export const PieChartInfo = ({ chartData, chartConfig }: { chartData: Array<ChatProps>, chartConfig: ChartConfig }) => {
  let config: ChartConfig





  return (

    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Vendas</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart >
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="y" nameKey="x">
              <LabelList
                dataKey="x"
                className="fill-background "
                stroke="none"
                color="#000"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

    </Card>


  )
}