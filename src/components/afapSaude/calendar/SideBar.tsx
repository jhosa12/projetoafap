import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  CalendarDays, 
  CalendarRange, 
  Calendar as CalendarIcon, 
  PlusCircle 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SidebarProps } from "@/types/afapSaude";
import { Select, SelectContent, SelectTrigger, SelectValue,SelectItem  } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import useVerifyPermission from "@/hooks/useVerifyPermission";


const Sidebar: React.FC<SidebarProps> = ({ 
  view, 
  setView, 
  date, 
  onNavigate, 
  onAddEvent,
  hideControls = false,
  selectedDoctor,
  setSelectedDoctor,
  medicos,
}) => {

  const {verify} = useVerifyPermission()
  return (
    <div className="w-full md:w-80 px-4 py-2 bg-white border-r animate-slide-in max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium  text-gray-800">Calendário</h2>
          <p className="text-sm text-gray-500">{format(date, "MMMM yyyy", { locale: ptBR })}</p>
        </div>

        <div className="space-y-2">
        

           <Combobox
                          items={medicos.map(item => ({ value: String(item.id_med), label: `${item.nome}-${item.espec}` }))}
                          onChange={value=>setSelectedDoctor(medicos.find(item => item.id_med === Number(value))?.id_med)}
                          value={String(selectedDoctor)??null}
                          placeholder="Selecione o especialista"
                          className="w-9/12 border shadow-md"
                          
                          />
          <Button 
            disabled={verify('AFS1.1')}
            onClick={()=>onAddEvent()} 
            className="w-full bg-calendar-primary hover:bg-calendar-secondary text-white flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo Evento</span>
          </Button>
        </div>

        {/*!hideControls && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Visualizações</h3>
            <div className="flex flex-col space-y-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                className={view === "month" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
                onClick={() => setView("month")}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Mês
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                className={view === "week" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
                onClick={() => setView("week")}
              >
                <CalendarRange className="h-4 w-4 mr-2" />
                Semana
              </Button>
              <Button
                variant={view === "day" ? "default" : "outline"}
                className={view === "day" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
                onClick={() => setView("day")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Dia
              </Button>
              <Button
                variant={view === "agenda" ? "default" : "outline"}
                className={view === "agenda" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
                onClick={() => setView("agenda")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Agenda
              </Button>
            </div>
          </div>
        )*/}

        <Card className="border shadow-sm">
          <CardContent className="p-0 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate: Date|undefined) => newDate && onNavigate(newDate)}
              className="border-none "
              classNames={{
                day_selected: "bg-calendar-primary text-[9px] text-primary-foreground",
                day_today: "bg-calendar-soft-purple text-[9px] text-accent-foreground",
              }}
            />
          </CardContent>
        </Card>

      { /* <div className="pt-4 pb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categorias</h3>
          <div className="space-y-3 bg-white rounded-md p-2 border">
            <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md">
              <div className="w-4 h-4 rounded-full bg-calendar-primary"></div>
              <span className="text-xs font-medium">ABERTO</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md">
              <div className="w-4 h-4 rounded-full bg-calendar-soft-peach"></div>
              <span className="text-xs font-medium">FINALIZADO</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md">
              <div className="w-4 h-4 rounded-full bg-calendar-soft-yellow"></div>
              <span className="text-xs font-medium">CANCELADO</span>
            </div>
          
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Sidebar;