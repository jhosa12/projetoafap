import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VendasProps {
  id_consultor: number | null;
  consultor: string;
  _sum: { valor_mensalidade: number };
  _count: { dt_adesao: number };
  situacao: string;
}

interface SalesDataTableProps {
  dados: VendasProps[] ;
  meta: number;
  onConsultorClick: (vendedor: VendasProps) => void;
}

export const SalesDataTable: React.FC<SalesDataTableProps> = ({
  dados,
  meta,
  onConsultorClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = dados.filter(vendedor =>
    vendedor?.consultor?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (value: number, meta: number) => {
    const percentage = (value / meta) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (value: number, meta: number) => {
    const percentage = (value / meta) * 100;
    if (percentage >= 100) return { variant: 'default', text: 'Meta OK', class: 'bg-green-500' };
    if (percentage >= 75) return { variant: 'secondary', text: 'Próximo', class: 'bg-blue-500' };
    if (percentage >= 50) return { variant: 'outline', text: 'Progresso', class: 'bg-yellow-500' };
    return { variant: 'destructive', text: 'Baixo', class: 'bg-red-500' };
  };

  return (
    <Card >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Performance</CardTitle>
          <div className="relative w-48">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Buscar consultor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-[calc(100vh-350px)] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="h-8">Consultor</TableHead>
                <TableHead className="h-8 text-right">Valor</TableHead>
                <TableHead className="h-8 text-right">Vendas</TableHead>
                <TableHead className="h-8 text-right">%</TableHead>
                <TableHead className="h-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((vendedor, index) => {
                const percentage = (vendedor._sum.valor_mensalidade / meta) * 100;
                const status = getStatusBadge(vendedor._sum.valor_mensalidade, meta);
                
                return (
                  <TableRow
                    key={vendedor.id_consultor || index}
                    className="cursor-pointer hover:bg-muted/50 text-xs"
                    onClick={() => onConsultorClick(vendedor)}
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                          {vendedor.consultor.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{vendedor.consultor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-2 font-medium">
                      {Number(vendedor._sum.valor_mensalidade).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      {vendedor._count.dt_adesao}
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium">{percentage.toFixed(1)}%</span>
                        <div className="w-8 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={cn("h-1.5 rounded-full", getProgressColor(vendedor._sum.valor_mensalidade, meta))}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant={status.variant as any} className="text-xs px-2 py-0">
                        {status.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Nenhum consultor encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
