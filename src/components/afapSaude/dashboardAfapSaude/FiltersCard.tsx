import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerWithRange";

interface FiltersCardProps {
  onPeriodChange?: (period: { from: Date | undefined; to: Date | undefined }) => void;
  onMedicoChange?: (medico: string) => void;
  onEspecialidadeChange?: (especialidade: string) => void;
  showMedicos?: boolean;
  showEspecialidades?: boolean;
  dateRange: DateRange | undefined
  setDateRange: (dateRange: DateRange | undefined) => void
}

const FiltersCard = ({ 
  onPeriodChange, 
  onMedicoChange, 
  onEspecialidadeChange, 
  showMedicos = true, 
  showEspecialidades = true,
  dateRange,
  setDateRange
}: FiltersCardProps) => {
 

  const medicos = [
    "Todos os Médicos",
    "Dr. João Silva",
    "Dra. Maria Santos", 
    "Dr. Pedro Oliveira",
    "Dra. Ana Costa"
  ];

  const especialidades = [
    "Todas as Especialidades",
    "Cardiologia",
    "Ortopedia",
    "Dermatologia",
    "Neurologia",
    "Ginecologia"
  ];



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <DatePickerWithRange
                       dateRange={dateRange}
                       onDateRangeChange={setDateRange}
                       
                     />
          </div>

          {/* Filtro de Médicos */}
          {showMedicos && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Médico</label>
              <Select onValueChange={onMedicoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico} value={medico}>
                      {medico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filtro de Especialidades */}
          {showEspecialidades && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Especialidade</label>
              <Select onValueChange={onEspecialidadeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((especialidade) => (
                    <SelectItem key={especialidade} value={especialidade}>
                      {especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersCard;