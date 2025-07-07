import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface VendasProps {
  id_consultor: number | null;
  consultor: string;
  _sum: { valor_mensalidade: number };
  _count: { dt_adesao: number };
  situacao: string;
}

interface SalesTableProps {
  dados: VendasProps[];
  meta: number;
  onConsultorClick: (vendedor: VendasProps) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  dados,
  meta,
  onConsultorClick
}) => {
  const getProgressColor = (value: number, meta: number) => {
    const percentage = (value / meta) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (value: number, meta: number) => {
    const percentage = (value / meta) * 100;
    if (percentage >= 100) return { color: 'green', text: 'Meta Atingida' };
    if (percentage >= 75) return { color: 'blue', text: 'Próximo da Meta' };
    if (percentage >= 50) return { color: 'yellow', text: 'Em Progresso' };
    return { color: 'red', text: 'Abaixo da Meta' };
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Performance dos Consultores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {dados.map((vendedor, index) => {
            const percentage = (vendedor._sum.valor_mensalidade / meta) * 100;
            const status = getStatusBadge(vendedor._sum.valor_mensalidade, meta);
            
            return (
              <div
                key={vendedor.id_consultor || index}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onConsultorClick(vendedor)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                      {vendedor.consultor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{vendedor.consultor}</h3>
                      <p className="text-sm text-gray-500">{vendedor._count.dt_adesao} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {vendedor._sum.valor_mensalidade.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                    <Badge variant={status.color as any} className="text-xs">
                      {status.text}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Meta: {meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full transition-all duration-500", getProgressColor(vendedor._sum.valor_mensalidade, meta))}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
