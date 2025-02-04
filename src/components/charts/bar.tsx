




import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"


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
import { ChatProps } from "../vendas/acompanhamento"


  /*const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ]*/
  
 

  

export const BarChartInfo = ({ chartData,chartConfig,periodo }: {chartData:Array<ChatProps>,chartConfig:ChartConfig, periodo?:{start?:string,end?:string}} ) => {
    let config:ChartConfig


   


    return (
    
        <Card className="flex flex-col w-full">
        <CardHeader>
         
          <CardDescription  className="text-xs">{periodo?.start ? new Date(periodo?.start).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : ''} - {periodo?.end && new Date(periodo?.end).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="x"
                tickLine={false}
                tickMargin={5}
                fontSize={11}
                color="#000"
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent  indicator="dashed" />}
              />
              <Bar  dataKey="y" fill="#3498db" radius={4} />
        
             
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
            
        
    )
}