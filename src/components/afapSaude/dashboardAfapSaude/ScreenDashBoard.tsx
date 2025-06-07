import { BarChart, CalendarCheck, FileText } from "lucide-react";
import { LineChart} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { mockDashboardStats } from "@/utils/mockData";
import StatsCard from "./StatsCard";
import ConsultasChart from "./ConsultsChart";
import ExamesChart from "./ExamesChart";
import RevenueChart from "./RevenueChart";

const Dashboard = ({id_empresa}:{id_empresa:string}) => {
  const stats = mockDashboardStats;

  
  // Estados independentes para filtros de consultas
  const [consultasFilters, setConsultasFilters] = useState({
    period: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    medico: '',
    especialidade: ''
  });
  
  // Estados independentes para filtros de exames
  const [examesFilters, setExamesFilters] = useState({
    period: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    medico: ''
  });

  // Dados filtrados para consultas
  const getConsultasStats = () => {
    // Aqui você aplicaria os filtros reais aos dados
    // Por enquanto retornando os dados mock
    return {
      total: stats.totalConsultas,
      hoje: stats.consultasHoje,
      receita: stats.receitaMensal,
      porStatus: stats.consultasPorStatus
    };
  };

  // Dados filtrados para exames
  const getExamesStats = () => {
    // Aqui você aplicaria os filtros reais aos dados
    // Por enquanto retornando os dados mock
    return {
      total: stats.totalExames,
      hoje: stats.examesHoje,
      porStatus: stats.examesPorStatus
    };
  };

  const consultasStats = getConsultasStats();
  const examesStats = getExamesStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Médico</h1>
          <p className="text-gray-600 mt-2">Acompanhe consultas, exames e receita da clínica</p>
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="consultas" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="exames">Exames</TabsTrigger>
            <TabsTrigger value="receita">Receita</TabsTrigger>
          </TabsList>

          <TabsContent value="consultas" className="space-y-6">
            {/* Cards de Estatísticas - Consultas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total de Consultas"
                value={consultasStats.total.toLocaleString()}
                change="+8.2% vs mês anterior"
                changeType="positive"
                icon={CalendarCheck}
                description="Consultas realizadas no período"
              />
              <StatsCard
                title="Consultas Hoje"
                value={consultasStats.hoje}
                change="Agendadas para hoje"
                changeType="neutral"
                icon={LineChart}
                description="Atendimentos programados"
              />
              <StatsCard
                title="Receita das Consultas"
                value={`R$ ${consultasStats.receita.toLocaleString()}`}
                change="+15.3% vs mês anterior"
                changeType="positive"
                icon={BarChart}
                description="Faturamento das consultas"
              />
              <StatsCard
                title="Pendentes"
                value={consultasStats.porStatus['AGENDADO'] + consultasStats.porStatus['CONFIRMADO']}
                change={`${consultasStats.porStatus['CANCELADO']} canceladas`}
                changeType="neutral"
                icon={CalendarCheck}
                description="Consultas pendentes"
              />
            </div>

            <ConsultasChart 
            empresa={id_empresa}
             // consultasPorStatus={consultasStats.porStatus}
            //  tendenciaMensal={stats.tendenciaMensal}
              onFiltersChange={setConsultasFilters}
              filters={consultasFilters}
            />
          </TabsContent>

          <TabsContent value="exames" className="space-y-6">
            {/* Cards de Estatísticas - Exames */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total de Exames"
                value={examesStats.total.toLocaleString()}
                change="+12.5% vs mês anterior"
                changeType="positive"
                icon={FileText}
                description="Exames realizados no período"
              />
              <StatsCard
                title="Exames Hoje"
                value={examesStats.hoje}
                change="Programados para hoje"
                changeType="neutral"
                icon={LineChart}
                description="Exames do dia"
              />
              <StatsCard
                title="Recebidos"
                value={examesStats.porStatus['RECEBIDO']}
                change={`${((examesStats.porStatus['RECEBIDO'] / examesStats.total) * 100).toFixed(1)}% do total`}
                changeType="positive"
                icon={FileText}
                description="Exames já recebidos"
              />
              <StatsCard
                title="Orçamentos"
                value={examesStats.porStatus['ORÇAMENTO']}
                change={`${((examesStats.porStatus['ORÇAMENTO'] / examesStats.total) * 100).toFixed(1)}% do total`}
                changeType="neutral"
                icon={BarChart}
                description="Aguardando aprovação"
              />
            </div>

            <ExamesChart 
              examesPorStatus={examesStats.porStatus}
              tendenciaMensal={stats.tendenciaMensal}
              onFiltersChange={setExamesFilters}
              filters={examesFilters}
            />
          </TabsContent>

          <TabsContent value="receita" className="space-y-6">
            {/* Cards de Estatísticas - Receita */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Receita Total"
                value={`R$ ${stats.receitaMensal.toLocaleString()}`}
                change="+15.3% vs mês anterior"
                changeType="positive"
                icon={BarChart}
                description="Faturamento total do mês"
              />
              <StatsCard
                title="Receita Consultas"
                value={`R$ ${(stats.receitaMensal * 0.65).toLocaleString()}`}
                change="65% da receita total"
                changeType="neutral"
                icon={CalendarCheck}
                description="Faturamento das consultas"
              />
              <StatsCard
                title="Receita Exames"
                value={`R$ ${(stats.receitaMensal * 0.35).toLocaleString()}`}
                change="35% da receita total"
                changeType="neutral"
                icon={FileText}
                description="Faturamento dos exames"
              />
              <StatsCard
                title="Ticket Médio"
                value={`R$ ${(stats.receitaMensal / (stats.totalConsultas + stats.totalExames)).toLocaleString()}`}
                change="+8.7% vs mês anterior"
                changeType="positive"
                icon={LineChart}
                description="Valor médio por atendimento"
              />
            </div>

            <RevenueChart tendenciaMensal={stats.tendenciaMensal} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
