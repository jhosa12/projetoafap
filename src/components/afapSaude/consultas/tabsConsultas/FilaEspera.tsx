import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, CalendarClock, User, Phone, AlertCircle } from 'lucide-react';
import { ConsultaProps } from '@/types/afapSaude';

interface FilaEsperaProps {
  consultas: ConsultaProps[];
}

export const FilaEspera: React.FC<FilaEsperaProps> = ({ consultas }) => {
  const consultasAguardando = consultas.filter(c => c.status === 'Aguardando Data');
  const consultasConfirmadas = consultas.filter(c => c.status === 'Confirmado');
  const consultasAgendadas = consultas.filter(c => c.status === 'Agendado');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'Aguardando Data': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatarData = (data?: Date) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const ConsultaCard = ({ consulta }: { consulta: ConsultaProps }) => (
    <div className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{consulta.nome}</span>
          </div>
          {consulta.idade && (
            <div className="text-sm text-muted-foreground ml-6">{consulta.idade} anos</div>
          )}
        </div>
        <Badge className={getStatusColor(consulta.status)}>
          {consulta.status}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <strong>Médico:</strong> {consulta.medico_nome}
        </div>
        {consulta.medico_espec && (
          <div className="text-muted-foreground ml-12">
            {consulta.medico_espec}
          </div>
        )}
        
        {consulta.data && consulta.hora_prev && (
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <span>{formatarData(consulta.data)} às { new Date(consulta.hora_prev).toLocaleTimeString()}</span>
          </div>
        )}

        {consulta.celular && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{consulta.celular}</span>
          </div>
        )}

        {consulta.observacao && (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{consulta.observacao}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {consulta.vl_consulta && (
            <span>Valor: {consulta.vl_consulta.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          {consulta.status === 'Aguardando Data' && (
            <Button size="sm">
              Agendar
            </Button>
          )}
          {consulta.status === 'Confirmado' && (
            <Button size="sm">
              Marcar como Agendado
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Consultas aguardando data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Aguardando Data ({consultasAguardando.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultasAguardando.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhuma consulta aguardando data</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {consultasAguardando.map((consulta) => (
                <ConsultaCard key={consulta.id_consulta} consulta={consulta} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultas confirmadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-green-600" />
            Confirmadas ({consultasConfirmadas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultasConfirmadas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhuma consulta confirmada aguardando agendamento</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {consultasConfirmadas.map((consulta) => (
                <ConsultaCard key={consulta.id_consulta} consulta={consulta} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultas agendadas (próximas) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-600" />
            Próximas Consultas Agendadas ({consultasAgendadas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultasAgendadas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhuma consulta agendada</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {consultasAgendadas
                .sort((a, b) => {
                  if (!a.data || !b.data) return 0;
                  return new Date(a.data).getTime() - new Date(b.data).getTime();
                })
                .map((consulta) => (
                  <ConsultaCard key={consulta.id_consulta} consulta={consulta} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
