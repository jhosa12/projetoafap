import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import FiltersCard from "./FiltersCard";

interface ExamesChartProps {
  examesPorStatus: Record<string, number>;
  tendenciaMensal: Array<{ mes: string; consultas: number; exames: number; receita: number }>;
  onFiltersChange: (filters: any) => void;
  filters: any;
}

const COLORS = {
  'ORÇAMENTO': '#f59e0b',
  'RECEBIDO': '#10b981'
};

const ExamesChart = ({ examesPorStatus, tendenciaMensal, onFiltersChange, filters }: ExamesChartProps) => {
  const totalExames = Object.values(examesPorStatus).reduce((sum, count) => sum + count, 0);
  
  const statusData = Object.entries(examesPorStatus).map(([status, count]) => ({
    status,
    count,
    percentage: ((count / totalExames) * 100).toFixed(1),
    color: COLORS[status as keyof typeof COLORS] || '#6b7280'
  }));

  const handlePeriodChange = (period: { from: Date | undefined; to: Date | undefined }) => {
    console.log('Período alterado:', period);
    onFiltersChange({ ...filters, period });
  };

  const handleMedicoChange = (medico: string) => {
    console.log('Médico selecionado:', medico);
    onFiltersChange({ ...filters, medico });
  };

  const renderLabel = (entry: any) => {
    return `${entry.status}: ${entry.percentage}%`;
  };

  return (
    <div className="space-y-6">
      <FiltersCard 
        onPeriodChange={handlePeriodChange}
        onMedicoChange={handleMedicoChange}
        showEspecialidades={false}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exames por Status (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} (${statusData.find(item => item.status === name)?.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legenda com porcentagens */}
            <div className="mt-4 space-y-2">
              {statusData.map((entry) => (
                <div key={entry.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.status}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {entry.count} ({entry.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal de Exames</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciaMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="exames" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamesChart;
