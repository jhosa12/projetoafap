import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, CreditCard, AlertTriangle, UserX } from "lucide-react";

interface DateRange {
  from: Date;
  to: Date;
}

interface MetricsCardsProps {
  dateRange: DateRange;
}

export function MetricsCards({ dateRange }: MetricsCardsProps) {
  // Dados simulados - substitua pela sua API
  const metrics = [
    {
      title: "Receita Total",
      value: "R$ 45.231,89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: CreditCard,
    },
    {
      title: "Total de Mensalidades",
      value: "1.234",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Taxa de Inadimplência",
      value: "12.5%",
      change: "-2.4%",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Novos Clientes",
      value: "89",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Cancelamentos",
      value: "23",
      change: "-12.1%",
      changeType: "negative" as const,
      icon: UserX,
    },
    {
      title: "Taxa de Conversão",
      value: "79.4%",
      change: "+3.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs flex items-center ${
              metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.changeType === 'positive' ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {metric.change} vs mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}