

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis,LabelList, Pie, PieChart } from "recharts"


type MensalidadeProps = {
    data: Date;
    id_empresa: string,
    _sum: { valor: number };
    _count: { data: number };
  };
  interface ContratosProps {
    dt_adesao: Date,
    dt_cancelamento: Date
    _count: {
      dt_adesao: number,
      dt_cancelamento: number
    }
  }

  interface ApiProps {
    startDate: string|undefined,
    endDate: string|undefined,
    id_empresa:string
  }




  




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
import useApiGet from "@/hooks/useApiGet"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { ajustarData } from "@/utils/ajusteData";
import useApiPost from "@/hooks/useApiPost";

const chartConfig = {
  y: {
    label: "Valor",
    color: "hsl(var(--chart-1))",
  },
  z: {
    label: "Quantidade",
    color: "hsl(var(--chart-1))",
  }
  
} satisfies ChartConfig



const chartDataPie = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfigPie = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig




export default function Component() {
    const {selectEmp} = useContext(AuthContext)
    const { data,  loading, postData } = useApiPost<Array<MensalidadeProps>, ApiProps>('/testeGrafico')
      const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1));
      const [endDate, setEndDate] = useState(new Date(new Date(new Date().getFullYear(), new Date().getMonth()+12, 29)));
      const [chartData, setChartData] = useState<Array<{ x: string; y: number,z: number }>>([])
    

    const filtroMensalidade = async () => {
        const {dataFim,dataIni} = ajustarData(startDate, endDate)
        
        try {
         await postData({
            endDate:dataFim,
            startDate:dataIni,
            id_empresa:selectEmp
          })
        } catch (error) {
          console.log(error)
        }
      }


      useEffect(()=>{
        filtroMensalidade()
      },[])



      const CriarArrayGeral = (data: Array<MensalidadeProps>) => {
        const novo = data?.reduce((acc, at) => {
          const itemExistente = acc.find(exists => exists.x === new Date(at.data)?.toLocaleDateString('pt-BR', { timeZone: 'UTC',day: 'numeric',  month: '2-digit'})?.toUpperCase())
  
          if (itemExistente) {
            itemExistente.y = Number(itemExistente.y) + Number(at._sum.valor)
            itemExistente.z = Number(itemExistente.z) + Number(at._count.data)
          } else {
            acc.push({ x: new Date(at.data)?.toLocaleDateString('pt-BR', { timeZone: 'UTC', day:'numeric',month: '2-digit'})?.toUpperCase(), y: at._sum.valor,z: at._count.data })
          }
  
          return acc
  
        }, [] as Array<{ x: string, y: number,z: number }>)

        console.log(novo)
  
        setChartData(novo)
      }

      useEffect(()=>{
        CriarArrayGeral(data??[])
      },[data])



    
  return (
    <div className="inline-flex w-full">
    <Card className="flex flex-col w-1/2">
      <CardHeader>
        <CardTitle>Mensalidades</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  indicator="dashed" />}
            />
            <Bar stackId={"a"} dataKey="y" fill="#3498db" radius={[0,0,4,4]} />
            <Bar stackId={"a"} dataKey="z" fill="#ed8435" scale={'point'} radius={[4,4,0,0]} />
           
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>




    <Card className="flex flex-col w-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Vendas</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfigPie}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartDataPie} dataKey="visitors"  label nameKey="browser">
              <LabelList
                dataKey="browser"
                className="fill-background "
                stroke="none"
                color="#000"
                fontSize={12}
                formatter={(value: keyof typeof chartConfigPie) =>
                  chartConfigPie[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
   
    </Card>








    </div> 
  )
}
