"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { agruparMensalidadesPorMes } from "../tabs/financeiro/grafico/screen"

type MensalidadeProps = {
  data: Date
  id_empresa: string
  _sum: { valor: number }
  _count: { data: number }
}

interface Props {
  mensalidades: MensalidadeProps[]
}

// Configuração das cores e labels
const chartConfig = {
  quantidade: {
    label: "Quantidade",
    color: "hsl(var(--chart-1))",
  },
  valorTotal: {
    label: "Valor Total",
    color: "hsl(var(--chart-2))",
  },
} satisfies Record<string, { label: string; color: string }>

export function GraficoMensalidades({ mensalidades }: Props) {
  const dados = agruparMensalidadesPorMes(mensalidades)

  return (
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="50%" >
          <BarChart data={dados}>
            <XAxis
              dataKey="mesAno"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
             
            />
            <YAxis
              
              tickLine={false}
              axisLine={false}
            />
         
            <Bar
              dataKey="valorTotal"
              stackId="a"
              fill="var(--color-valorTotal)"
              radius={[0, 0, 0, 0]}
            />

               <Bar
              dataKey="quantidade"
              stackId="a"
              fill="var(--color-quantidade)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
   
  )
}
