import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/app/dashboard/admcontrato/_components/DatePickerWithRange';

export interface SetorProps {
  id_grupo: number;
  descricao: string;
}

interface FilterModalProps {
  show: boolean;
  setFiltro: (show: boolean) => void;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  filtrar: () => void;
  loading: boolean;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  show,
  setFiltro,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  filtrar,
  loading
}) => {
  const handleFilter = () => {
    filtrar();
    setFiltro(false);
  };

  return (
    <Dialog open={show} onOpenChange={setFiltro}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filtros de Vendas</DialogTitle>
        </DialogHeader>

      
          <DatePickerWithRange

            dateRange={{ from: startDate, to: endDate }}
            onDateRangeChange={(dateRange) => {
              setStartDate(dateRange?.from || startDate);
              setEndDate(dateRange?.to || endDate);
            }}
          />

         

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setFiltro(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFilter}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Aplicando...' : 'Aplicar Filtros'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
