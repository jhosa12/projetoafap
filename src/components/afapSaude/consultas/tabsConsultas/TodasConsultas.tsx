
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarClock, User, Phone, Search } from 'lucide-react';
import { ConsultaProps,ConsultaStatus } from '@/types/afapSaude';

interface TodasConsultasProps {
  consultas: ConsultaProps[];
}

export const TodasConsultas: React.FC<TodasConsultasProps> = ({ consultas }) => {
  const [filtroStatus, setFiltroStatus] = useState<ConsultaStatus | 'todos'>('todos');
  const [busca, setBusca] = useState('');

  const consultasFiltradas = consultas.filter(consulta => {
    const matchStatus = filtroStatus === 'todos' || consulta.status === filtroStatus;
    const matchBusca = busca === '' || 
      consulta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      consulta.medico_nome.toLowerCase().includes(busca.toLowerCase()) ||
      consulta.celular?.includes(busca);
    
    return matchStatus && matchBusca;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Atendido': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Aguardando Data': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Recebido': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatarData = (data?: Date) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor?: number) => {
    if (!valor) return '-';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Todas as Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, médico ou telefone..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as ConsultaStatus | 'todos')}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Aguardando Data">Aguardando Data</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Agendado">Agendado</SelectItem>
                <SelectItem value="Atendido">Atendido</SelectItem>
                <SelectItem value="Recebido">Recebido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma consulta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  consultasFiltradas.map((consulta) => (
                    <TableRow key={consulta.id_consulta}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consulta.nome}</div>
                          {consulta.idade && (
                            <div className="text-sm text-muted-foreground">{consulta.idade} anos</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consulta.medico_nome}</div>
                          <div className="text-sm text-muted-foreground">{consulta.medico_espec}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatarData(consulta.data)}</div>
                          {consulta.hora_prev && (
                            <div className="text-sm text-muted-foreground">{ new Date(consulta.hora_prev).toLocaleTimeString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(consulta.status)}>
                          {consulta.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatarValor(10)}</TableCell>
                      <TableCell>
                        {consulta.celular && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {consulta.celular}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Estatísticas da busca */}
          {busca && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {consultasFiltradas.length} de {consultas.length} consultas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};