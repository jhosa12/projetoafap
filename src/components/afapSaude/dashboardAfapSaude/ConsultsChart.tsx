import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import FiltersCard from "./FiltersCard";


interface ConsultasChartProps {
  consultasPorStatus: Record<string, number>;
  tendenciaMensal: Array<{ mes: string; consultas: number; exames: number; receita: number }>;
  onFiltersChange: (filters: any) => void;
  filters: any;
}

const COLORS = {
  'AGENDADO': '#3b82f6',
  'CONFIRMADO': '#10b981',
  'AGUARDANDO DATA': '#f59e0b',
  'CANCELADO': '#ef4444',
  'RECEBIDO': '#8b5cf6'
};

const ConsultasChart = ({ consultasPorStatus, tendenciaMensal, onFiltersChange, filters }: ConsultasChartProps) => {
  const statusData = Object.entries(consultasPorStatus).map(([status, count]) => ({
    status,
    count,
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

  const handleEspecialidadeChange = (especialidade: string) => {
    console.log('Especialidade selecionada:', especialidade);
    onFiltersChange({ ...filters, especialidade });
  };

  return (
    <div className="space-y-6">
      <FiltersCard 
        onPeriodChange={handlePeriodChange}
        onMedicoChange={handleMedicoChange}
        onEspecialidadeChange={handleEspecialidadeChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tendenciaMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultasChart;
