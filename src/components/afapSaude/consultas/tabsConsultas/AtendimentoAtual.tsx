import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CalendarClock, User, Phone } from 'lucide-react';
import { ConsultaProps } from '@/types/afapSaude';
import { PatientTable } from './PatientTable';
import { QueuePanel } from './QueuePanel';
import { QueueDisplay } from './QuenueDisplay';
import { FilterPanel } from './FilterPanel';

interface AtendimentoAtualProps {
  consultas: ConsultaProps[];
}

interface QueueItem {
  id: string;
  name: string;
  queueNumber: number;
  estimatedTime: string;
  priority: 'normal' | 'priority' | 'urgent';
}



const mockQueueData: Record<string, QueueItem[]> = {
  cardiology: [
    {
      id: "235",
      name: "Jorge Luiz da Silva",
      queueNumber: 1,
      estimatedTime: "5 min",
      priority: "normal" as const
    },
    {
      id: "100",
      name: "Luiz Antonio da Silva", 
      queueNumber: 2,
      estimatedTime: "10 min",
      priority: "priority" as const
    },
    {
      id: "110",
      name: "Maria Santos",
      queueNumber: 3,
      estimatedTime: "15 min",
      priority: "urgent" as const
    }
  ],
  ophthalmology: [
    {
      id: "200",
      name: "Ana Costa",
      queueNumber: 1,
      estimatedTime: "5 min",
      priority: "normal" as const
    },
    {
      id: "524",
      name: "Pedro Oliveira",
      queueNumber: 2,
      estimatedTime: "10 min",
      priority: "normal" as const
    }
  ],
  neurology: [
    {
      id: "300",
      name: "Carlos Silva",
      queueNumber: 1,
      estimatedTime: "5 min",
      priority: "priority" as const
    }
  ],
  general: [
    {
      id: "400",
      name: "Fernanda Lima",
      queueNumber: 1,
      estimatedTime: "5 min",
      priority: "normal" as const
    },
    {
      id: "401",
      name: "Roberto Santos",
      queueNumber: 2,
      estimatedTime: "10 min",
      priority: "normal" as const
    },
    {
      id: "402",
      name: "Julia Costa",
      queueNumber: 3,
      estimatedTime: "15 min",
      priority: "urgent" as const
    },
    {
      id: "403",
      name: "Marcos Oliveira",
      queueNumber: 4,
      estimatedTime: "20 min",
      priority: "priority" as const
    }
  ]
};

export const AtendimentoAtual: React.FC<AtendimentoAtualProps> = ({ consultas }) => {
   const consultasHoje = consultas.filter(consulta => {
     if (!consulta.data) return false;
    const hoje = new Date();
     const dataConsulta = new Date(consulta.data);
    return (
       dataConsulta.toDateString() === hoje.toDateString() &&
      (consulta.status === 'Agendado' || consulta.status === 'Confirmado' || consulta.status === 'Atendido')
     );
  }).sort((a, b) => {
     if (!a.hora_prev || !b.hora_prev) return 0;
    return 100;
   });

const proximaConsulta:any = consultasHoje.find(c => c.status === 'Agendado' || c.status === 'Confirmado');
const consultasAtendidas:any =consultasHoje.filter(c => c.status === 'Atendido');

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

  return (
    <div className="space-y-2">
   
    <FilterPanel/>
      {/* Lista de consultas do dia */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Consultas agendadas para hoje */}
        <Card className=" overflow-y-scroll max-h-[calc(100vh-205px)] rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs">
              <Clock className="h-5 w-5" />
              Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
          <PatientTable searchTerm={""} onPatientSelect={() => {}} selectedPatient={null}/>
          </CardContent>
        </Card>

        {/* Consultas já atendidas hoje */}
        <Card className=" overflow-y-scroll max-h-[calc(100vh-205px)] rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Atendimentos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
         <QueuePanel onCallNext={() => {}} currentNumber={null} queueLength={0}/>
          <QueueDisplay queueItems={mockQueueData.cardiology} currentNumber={null}/>  
          </CardContent>
        </Card>
      </div>
    </div>
  );
};