// components/ConsultasChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import FiltersCard from "./FiltersCard";
import { api } from '@/lib/axios/apiClient';

const COLORS = {
  'agendado': '#3b82f6',
  'confirmado': '#10b981',
  'aguardando_data': '#f59e0b',
  'cancelado': '#ef4444',
  'recebido': '#8b5cf6',
  'atendido':'#22c55e'
};

const ConsultasChart = ({ onFiltersChange, filters, empresa }: { onFiltersChange: any, filters: any, empresa: any }) => {
  const [consultasPorStatus, setConsultasPorStatus] = useState<Record<string, number>>({});
  const [tendenciaMensal, setTendenciaMensal] = useState<any[]>([]);
  const [loading, setLoading] = useState({ status: true, tendencia: true });

  // Buscar dados quando os filtros mudarem
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Montar query params baseado nos filtros
        const params = new URLSearchParams();
        if (filters.period?.from) params.append('periodFrom', filters.period.from.toISOString());
        if (filters.period?.to) params.append('periodTo', filters.period.to.toISOString());
        if (filters.medico) params.append('medico', filters.medico);
        if (filters.especialidade) params.append('especialidade', filters.especialidade);
        params.append('empresa', empresa);

        // Buscar consultas por status
        const tendenciaRes = await api.get(`/afapSaude/dashboard/tendencia?${params}`);
        console.log(tendenciaRes.data)
        setTendenciaMensal(tendenciaRes.data);
        setLoading(prev => ({ ...prev, status: false }));

        // Buscar tendência mensal
         const statusRes = await api.get(`/afapSaude/dashboard/totais?${params}`);

         const filteredStatus = Object.entries(statusRes.data.consultas as Record<string, number>).filter(([status, count]) => count > 0);  
        // const tendenciaData = await tendenciaRes.json();
        setConsultasPorStatus(Object.fromEntries(filteredStatus));
        setLoading(prev => ({ ...prev, tendencia: false }));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [filters,empresa]);

  const statusData = Object.entries(consultasPorStatus).map(([status, count]) => ({
    status,
    count,
    color: COLORS[status as keyof typeof COLORS] || '#6b7280'
  }));

  const handlePeriodChange = (period: { from: Date | undefined; to: Date | undefined }) => {
    onFiltersChange({ ...filters, period });
  };

  const handleMedicoChange = (medico: string) => {
    onFiltersChange({ ...filters, medico });
  };

  const handleEspecialidadeChange = (especialidade: string) => {
    onFiltersChange({ ...filters, especialidade });
  };

   if (loading.status || loading.tendencia) {
     return <div>Carregando gráficos...</div>;
  }

  return (
    <div className="space-y-6">
      <FiltersCard 
        dateRange={filters.period}
        setDateRange={(dateRange) => onFiltersChange({ ...filters, period: dateRange })}
        onPeriodChange={handlePeriodChange}
        onMedicoChange={handleMedicoChange}
        onEspecialidadeChange={handleEspecialidadeChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Consultas por Status */}
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

        {/* Gráfico de Barras - Tendência Mensal */}
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
                <Bar dataKey="consultas" fill="#3b82f6" name="Consultas" />
                <Bar dataKey="receita" fill="#8b5cf6" name="Receita (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultasChart;