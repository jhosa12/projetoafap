import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, CreditCard, AlertTriangle, UserX,HeartHandshake } from "lucide-react";

interface MetricsCardsProps {
  
  revenueValue: number;
  revenueQuantity: number;
  adhesionCount: number;
  inadimplenceRate?: number;
  newClientsCount?: number;
  cancellationsCount: number;
  assets?:number
}

export function MetricsCards({ adhesionCount,cancellationsCount,revenueValue,inadimplenceRate,newClientsCount,revenueQuantity,assets }: MetricsCardsProps) {
  // Dados simulados - substitua pela sua API
  const metrics = [
    {
      title: "Receita Total",
      value: Number(revenueValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      change: "+20.1%",
      changeType: "positive" as const,
      icon: CreditCard,
      disabled: false
    },
    {
      title: "Total de Mensalidades",
      value: revenueQuantity?.toString()??'0',
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
       disabled: false
    },
    {
      title: "Total de Ativos Atualmente",
      value: assets?.toString()??'0',
      change: "-2.4%",
      changeType: "negative" as const,
      icon: HeartHandshake,
       disabled: false
    },
    {
      title: "Novos Clientes",
      value: adhesionCount?.toString()??'0',
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
       disabled: false
    },
    {
      title: "Cancelamentos",
      value: cancellationsCount?.toString()??'0',
      change: "-12.1%",
      changeType: "negative" as const,
      icon: UserX,
       disabled: false
    },
    {
      title: "Taxa de Conversão",
      value: "79.4%",
      change: "+3.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
       disabled: true
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card className={`${metric.disabled ? ' opacity-30' : 'white'}`} key={index}>
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