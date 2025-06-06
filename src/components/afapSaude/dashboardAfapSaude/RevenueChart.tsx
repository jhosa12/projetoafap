import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface RevenueChartProps {
  tendenciaMensal: Array<{ mes: string; consultas: number; exames: number; receita: number }>;
}

const RevenueChart = ({ tendenciaMensal }: RevenueChartProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Evolução da Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={tendenciaMensal}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis 
              tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Receita']}
            />
            <Area 
              type="monotone" 
              dataKey="receita" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorReceita)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;