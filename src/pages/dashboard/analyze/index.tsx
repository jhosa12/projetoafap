import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { addDays } from "date-fns";
import { DatePickerWithRange } from '@/components/dashboard/DatePickerWithRange';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DefaultChart } from '@/components/dashboard/DefaultChart';
import { AdhesionCancellationChart } from '@/components/dashboard/AdhesionCancellationChart';
import { removerFusoDate } from '@/utils/removerFusoDate';
import { api } from '@/lib/axios/apiClient';
import { ajustarData } from '@/utils/ajusteData';


export interface RevenueData {
  month: string;
  revenue: number;
  quantity: number;
}

interface AdhesionData {
  month: string;
  adhesions: number;
  cancellations: number;
}





const Index = () => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });


const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [adhesionData, setAdhesionData] = useState<AdhesionData[]>([]);

  useEffect(() => {

    const {dataIni,dataFim} = ajustarData(dateRange.from, dateRange.to)
     
    
    const fetchData = async () => {
      try {
        const [revenueRes, adhesionRes] = await Promise.all([
           await api.post(`/dashboard/mensalidades?from=${dataIni}&to=${dataFim}`),
         await api.get(
                   `/dashboard/adhesionsCancellations?from=${dataIni}&to=${dataFim}`
                 )
        ]);

        

        setRevenueData(revenueRes.data);
        setAdhesionData(adhesionRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [dateRange]);

  // Totais para os cards
  const totalRevenueValue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalQuantity = revenueData.reduce((sum, item) => sum + item.quantity, 0);
  const totalAdhesions = adhesionData.reduce((sum, item) => sum + item.adhesions, 0);
  const totalCancellations = adhesionData.reduce((sum, item) => sum + item.cancellations, 0);


  return (
    <div className="min-h-screen max-h-[calc(100vh-8rem)] overflow-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Análise completa do seu sistema</p>
          </div>
          <DatePickerWithRange 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>

        {/* Metrics Cards */}
        <MetricsCards
          revenueValue={totalRevenueValue}
          revenueQuantity={totalQuantity}
          adhesionCount={totalAdhesions}
          cancellationsCount={totalCancellations}
        dateRange={dateRange} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Receita por Mensalidade</CardTitle>
              <CardDescription>
                Valor total e quantidade de mensalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={revenueData} />
            </CardContent>
          </Card>

          {/* Default Chart */}
          <Card className='opacity-50'>
            <CardHeader>
              <CardTitle>Taxa de Inadimplência</CardTitle>
              <CardDescription>
                Porcentagem de inadimplência por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        {/* Adhesion/Cancellation Chart - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Adesões vs Cancelamentos</CardTitle>
            <CardDescription>
              Comparativo entre novos clientes e cancelamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdhesionCancellationChart data={adhesionData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;