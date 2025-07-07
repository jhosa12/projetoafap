import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/dashboard/DatePickerWithRange';

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
  arraySetores: SetorProps[];
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
  arraySetores,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
       <DatePickerWithRange
       
        dateRange={{from:startDate,to:endDate}}
       onDateRangeChange={(dateRange) => {
         setStartDate(dateRange?.from || startDate);
         setEndDate(dateRange?.to || endDate);
       }}
       />
          
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-700">Setor</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {arraySetores.map((setor) => (
                  <SelectItem key={setor.id_grupo} value={setor.id_grupo.toString()}>
                    {setor.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
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
