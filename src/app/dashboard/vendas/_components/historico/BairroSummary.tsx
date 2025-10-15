"use client";

import { useMemo } from "react";
import { LeadProps } from "@/types/vendas";
import { Badge } from "@/components/ui/badge";

interface BairroSummaryProps {
  data: LeadProps[];
}

export const BairroSummary = ({ data }: BairroSummaryProps) => {
  const summary = useMemo(() => {
    const bairrosUnicos = new Set(
      data.map((item) => item.bairro || "Sem Bairro")
    );

    const totalPorStatus = {
      leads: data.filter((item) => item.status === "LEAD").length,
      prospeccao: data.filter((item) => item.status === "PROSPECCAO").length,
      preVenda: data.filter((item) => item.status === "PRE VENDA").length,
      venda: data.filter((item) => item.status === "VENDA").length,
    };

    return {
      totalBairros: bairrosUnicos.size,
      totalRegistros: data.length,
      ...totalPorStatus,
    };
  }, [data]);

  if (summary.totalRegistros === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">Total:</span>
        <Badge variant="secondary">{summary.totalRegistros}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">Bairros:</span>
        <Badge variant="secondary">{summary.totalBairros}</Badge>
      </div>
      {summary.leads > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-600">Leads:</span>
          <Badge className="bg-blue-600">{summary.leads}</Badge>
        </div>
      )}
      {summary.prospeccao > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-yellow-600">Prospecção:</span>
          <Badge className="bg-yellow-600">{summary.prospeccao}</Badge>
        </div>
      )}
      {summary.preVenda > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-orange-600">Pré-Venda:</span>
          <Badge className="bg-orange-600">{summary.preVenda}</Badge>
        </div>
      )}
      {summary.venda > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-green-600">Vendas:</span>
          <Badge className="bg-green-600">{summary.venda}</Badge>
        </div>
      )}
    </div>
  );
};
