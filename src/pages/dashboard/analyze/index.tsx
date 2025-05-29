import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { addDays } from "date-fns";
import { DatePickerWithRange } from '@/components/dashboard/DatePickerWithRange';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DefaultChart } from '@/components/dashboard/DefaultChart';
import { AdhesionCancellationChart } from '@/components/dashboard/AdhesionCancellationChart';

const Index = () => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

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
        <MetricsCards dateRange={dateRange} />

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
              <RevenueChart dateRange={dateRange} />
            </CardContent>
          </Card>

          {/* Default Chart */}
          <Card>
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
            <AdhesionCancellationChart dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;