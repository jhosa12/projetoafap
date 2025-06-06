import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface FiltersCardProps {
  onPeriodChange?: (period: { from: Date | undefined; to: Date | undefined }) => void;
  onMedicoChange?: (medico: string) => void;
  onEspecialidadeChange?: (especialidade: string) => void;
  showMedicos?: boolean;
  showEspecialidades?: boolean;
}

const FiltersCard = ({ 
  onPeriodChange, 
  onMedicoChange, 
  onEspecialidadeChange, 
  showMedicos = true, 
  showEspecialidades = true 
}: FiltersCardProps) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

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

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onPeriodChange?.({ from: date, to: dateTo });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onPeriodChange?.({ from: dateFrom, to: date });
  };

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
          {/* Filtro de Data Inicial */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={handleDateFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Filtro de Data Final */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={handleDateToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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