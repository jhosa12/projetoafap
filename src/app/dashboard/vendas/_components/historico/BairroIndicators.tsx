"use client";

import { useMemo } from "react";
import { LeadProps } from "@/types/vendas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BairroIndicatorsProps {
  data: LeadProps[];
}

interface BairroStats {
  bairro: string;
  total: number;
  leads: number;
  prospeccao: number;
  preVenda: number;
  venda: number;
}

export const BairroIndicators = ({ data }: BairroIndicatorsProps) => {
  const bairroStats = useMemo(() => {
    const statsMap = new Map<string, BairroStats>();

    data.forEach((item) => {
      const bairro = item.bairro || "Sem Bairro";
      
      if (!statsMap.has(bairro)) {
        statsMap.set(bairro, {
          bairro,
          total: 0,
          leads: 0,
          prospeccao: 0,
          preVenda: 0,
          venda: 0,
        });
      }

      const stats = statsMap.get(bairro)!;
      stats.total++;

      switch (item.status) {
        case "LEAD":
          stats.leads++;
          break;
        case "PROSPECCAO":
          stats.prospeccao++;
          break;
        case "PRE VENDA":
          stats.preVenda++;
          break;
        case "VENDA":
          stats.venda++;
          break;
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => b.total - a.total);
  }, [data]);

  if (bairroStats.length === 0) {
    return null;
  }

  return (
   
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {bairroStats.map((stats) => (
            <div
              key={stats.bairro}
              className="border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm truncate" title={stats.bairro}>
                  {stats.bairro}
                </h3>
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {stats.leads > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">Leads:</span>
                    <span className="font-semibold">{stats.leads}</span>
                  </div>
                )}
                {stats.prospeccao > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600">Prospecção:</span>
                    <span className="font-semibold">{stats.prospeccao}</span>
                  </div>
                )}
                {stats.preVenda > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600">Pré-Venda:</span>
                    <span className="font-semibold">{stats.preVenda}</span>
                  </div>
                )}
                {stats.venda > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">Vendas:</span>
                    <span className="font-semibold">{stats.venda}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    
  );
};
