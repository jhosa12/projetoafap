"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addDays, endOfMonth, startOfMonth } from "date-fns";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerWithRange";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DefaultChart } from "@/components/dashboard/DefaultChart";
import { AdhesionCancellationChart } from "@/components/dashboard/AdhesionCancellationChart";
import { api } from "@/lib/axios/apiClient";
import { ajustarData } from "@/utils/ajusteData";
import { DateRange } from "react-day-picker";

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

export interface DefaultData {
  month: string;
  default: number;
}

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [adhesionData, setAdhesionData] = useState<AdhesionData[]>([]);
  const [defaultData, setDefaultData] = useState<DefaultData[]>([]);
  const [assets, setAssets] = useState<number | undefined>(undefined);

  useEffect(() => {
    console.log(dateRange);
    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    const { dataIni, dataFim } = ajustarData(dateRange?.from, dateRange?.to);

    const fetchData = async () => {
      try {
        const [revenueRes, adhesionRes, defaultRes, assetsRes] =
          await Promise.all([
            await api.get(
              `/dashboard/mensalidades?from=${dataIni}&to=${dataFim}`
            ),
            await api.get(
              `/dashboard/adhesionsCancellations?from=${dataIni}&to=${dataFim}`
            ),
            await api.get(`/dashboard/default?from=${dataIni}&to=${dataFim}`),

            await api.get("/dashboard/assets"),
          ]);

        setRevenueData(revenueRes.data ?? []);
        setAdhesionData(adhesionRes.data);
        setDefaultData(defaultRes.data);
        setAssets(assetsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [dateRange]);

  // Totais para os cards
  const totalRevenueValue = revenueData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalQuantity = revenueData.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAdhesions = adhesionData.reduce(
    (sum, item) => sum + item.adhesions,
    0
  );
  const totalCancellations = adhesionData.reduce(
    (sum, item) => sum + item.cancellations,
    0
  );

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-auto bg-gray-50 p-6">
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
          assets={assets}
        />

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
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Inadimplência</CardTitle>
              <CardDescription>
                Porcentagem de inadimplência por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefaultChart data={defaultData} />
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
