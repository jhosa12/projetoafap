import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PeriodSelectorProps {
  period: { start: Date | null; end: Date | null };
  onChange: (period: { start: Date | null; end: Date | null }) => void;
}

const PeriodSelector = ({ period, onChange }: PeriodSelectorProps) => {
  const setToday = () => {
    const today = new Date();
    onChange({ start: today, end: today });
  };

  const setWeek = () => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 6);
    onChange({ start: today, end: endOfWeek });
  };

  const setMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    onChange({ start: startOfMonth, end: endOfMonth });
  };

  const setAllPeriod = () => {
    onChange({ start: null, end: new Date() });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1">
        {/* <Button onClick={setToday} variant="outline" size="sm" className="text-xs">
          Hoje
        </Button> */}
        {/* <Button onClick={setWeek} variant="outline" size="sm" className="text-xs">
          Esta Semana
        </Button> */}
          <Button type="button" onClick={setAllPeriod} variant="outline" size="sm" className="text-xs">
          Todo Periodo
        </Button>
        <Button type="button" onClick={setMonth} variant="outline" size="sm" className="text-xs">
          Este Mês
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs justify-start">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {period?.start ? format(period?.start, "dd/MM", { locale: ptBR }) : "Início"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={period?.start || undefined}
              onSelect={(date) => onChange({ ...period, start: date || null })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs justify-start">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {period?.end ? format(period?.end, "dd/MM", { locale: ptBR }) : "Fim"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={period?.end || undefined}
              onSelect={(date) => onChange({ ...period, end: date || null })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PeriodSelector;