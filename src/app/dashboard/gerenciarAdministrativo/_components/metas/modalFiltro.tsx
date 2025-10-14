
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { } from "flowbite-react";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SetorProps } from "../../../vendas/_components/sales/FilterModal";
interface DataProps {
  show: boolean,
  setFiltro: (open: boolean) => void,
  startDate: Date,
  setStartDate: (start: Date) => void
  endDate: Date,
  setEndDate: (end: Date) => void
  filtrar: () => Promise<void>
  loading: boolean,
  arraySetores: Array<SetorProps>,
}

export function ModalFiltroMetas({
  arraySetores,
  filtrar,
  endDate,
  loading,
  setEndDate,
  setFiltro,
  setStartDate,
  show,
  startDate
}: DataProps) {

  return (
    <Dialog open={show} onOpenChange={setFiltro}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>

            Filtro

          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Select Setor */}
          <div>
            <Label className="mb-1 block">Setor</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(arraySetores) && arraySetores.map((item, index) =>
                  <SelectItem key={index} value={String(item.id_grupo)}>
                    {item.descricao}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

          </div>

          {/* Data de início e fim */}
          <div className="inline-flex gap-2">
            <div>
              <Label className="mb-1 block">Data início</Label>
              <DatePicker
                selected={startDate}
                onChange={(e) => {
                  e && setStartDate(e);
                }}
                dateFormat={"dd/MM/yyyy"}
                locale={pt}
                required
                className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200"
              />
            </div>

            <div>
              <Label className="mb-1 block">Data Fim</Label>
              <DatePicker
                selected={endDate}
                onChange={(e) => {
                  e && setEndDate(e);
                }}
                dateFormat={"dd/MM/yyyy"}
                locale={pt}
                required
                className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200"
              />
            </div>
          </div>

          {/* Botão aplicar filtro */}
          <Button
            className="cursor-pointer text-sm"
            onClick={() => filtrar()}
            disabled={loading}
          >
            {loading ? "Aplicando..." : "Aplicar Filtro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )

}