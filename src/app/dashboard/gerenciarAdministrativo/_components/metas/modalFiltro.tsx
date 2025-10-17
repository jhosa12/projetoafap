
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SetorProps } from "../../../vendas/_components/sales/FilterModal";
import { ChevronDownIcon, Eraser } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { anosFiltro, mesesFiltro } from "@/hooks/useConstsData";
import { useFiltroDatas } from "@/hooks/useFiltroDatas";

interface DataProps {
  show: boolean,
  setFiltro: (open: boolean) => void,
  startDate: Date | undefined,
  setStartDate: (start: Date | undefined) => void
  endDate: Date | undefined,
  setEndDate: (end: Date | undefined) => void
  filtrar: () => Promise<void>
  loading: boolean,
  arraySetores: Array<SetorProps>,
  idGrupo: number | undefined
  setIdGrupo: (id: number | undefined) => void
  anoSelecionado: number | undefined
  setAnoSelecionado: (ano: number | undefined) => void
  mesSelecionado: number | undefined
  setMesSelecionado: (mes: number | undefined) => void
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
  startDate,
  idGrupo,
  setIdGrupo,
  anoSelecionado,
  setAnoSelecionado,
  mesSelecionado,
  setMesSelecionado
}: DataProps) {

  const [tab, setTab] = useState<"ano" | "mes" | "periodo">("ano");

  const { handleAnoChange, handleMesChange } = useFiltroDatas(
    setStartDate,
    setEndDate,
    anoSelecionado,
    setAnoSelecionado,
    mesSelecionado,
    setMesSelecionado
  );

  useEffect(() => {

    if (!show) return;
    if (tab === "ano" && anoSelecionado !== undefined) {
      setStartDate(startOfYear(new Date(anoSelecionado, 0, 1)));
      setEndDate(endOfYear(new Date(anoSelecionado, 0, 1)));
    }
    if (tab === "mes" && anoSelecionado !== undefined && mesSelecionado !== undefined) {
      setStartDate(startOfMonth(new Date(anoSelecionado, mesSelecionado, 1)));
      setEndDate(endOfMonth(new Date(anoSelecionado, mesSelecionado, 1)));
    }

  }, [show, tab, anoSelecionado, mesSelecionado]);

  return (
    <Dialog open={show} onOpenChange={setFiltro}>
      <DialogContent className="w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>Filtro</DialogTitle>
          <DialogDescription>
            Use os filtros para encontrar metas específicas.
          </DialogDescription>
        </DialogHeader>

        {/* Select Setor */}
        <div className="mb-4">
          <Label className="mb-1 block">Setor</Label>
          <Select
            value={typeof idGrupo === "number" ? String(idGrupo) : undefined}
            onValueChange={valor => setIdGrupo(valor ? Number(valor) : undefined)}>
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

        {/* Tabs horizontais */}
        <Tabs value={tab} onValueChange={valor => setTab(valor as "ano" | "mes" | "periodo")}>
          <TabsList className="mb-4">
            <TabsTrigger value="ano">Ano</TabsTrigger>
            <TabsTrigger value="mes">Mês</TabsTrigger>
            <TabsTrigger value="periodo">Período</TabsTrigger>
          </TabsList>
          <div className="space-y-3">
            {tab === "ano" && (
              <div>
                <Label className="mb-1 block">Ano</Label>
                <Select
                  value={anoSelecionado !== undefined ? String(anoSelecionado) : undefined}
                  onValueChange={valor => handleAnoChange(valor ? Number(valor) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {anosFiltro.map(ano => (
                      <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {tab === "mes" && (
              <>
                <div>
                  <Label className="mb-1 block">Ano</Label>
                  <Select
                    value={anoSelecionado !== undefined ? String(anoSelecionado) : undefined}
                    onValueChange={valor => {
                      const ano = valor ? Number(valor) : undefined;
                      setAnoSelecionado(ano);
                      if (ano !== undefined && mesSelecionado !== undefined) {
                        setStartDate(startOfMonth(new Date(ano, mesSelecionado, 1)));
                        setEndDate(endOfMonth(new Date(ano, mesSelecionado, 1)));
                      } else {
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {anosFiltro.map(ano => (
                        <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Mês</Label>
                  <Select
                    value={mesSelecionado !== undefined ? String(mesSelecionado) : undefined}
                    onValueChange={valor => handleMesChange(valor ? Number(valor) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {mesesFiltro.map(mes => (
                        <SelectItem key={mes.valor} value={String(mes.valor)}>{mes.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {tab === "periodo" && (
              <div className="flex flex-col gap-2">
                <div>
                  <Label className="mb-1 block">Data início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex w-full justify-between text-left font-normal px-2 py-1"
                      >
                        {startDate
                          ? format(startDate, "dd/MM/yyyy", { locale: ptBR })
                          : <span className="text-muted-foreground">Selecione a data</span>
                        }
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0 min-w-[220px] max-w-xs">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        captionLayout="dropdown"
                        initialFocus
                        className="w-full max-w-xs"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="mb-1 block">Data Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex w-full justify-between text-left font-normal px-2 py-1"
                      >
                        {endDate
                          ? format(endDate, "dd/MM/yyyy", { locale: ptBR })
                          : <span className="text-muted-foreground">Selecione a data</span>
                        }
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0 min-w-[220px] max-w-xs">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        captionLayout="dropdown"
                        initialFocus
                        className="w-full max-w-xs"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </Tabs>

        {/* Botão aplicar filtro */}

        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto hover:bg-red-600 hover:text-white"
            onClick={() => {
              setIdGrupo(undefined)
              setStartDate(undefined)
              setEndDate(undefined)
              setAnoSelecionado(undefined)
              setMesSelecionado(undefined)
            }}
          >
            <Eraser /> Limpar
          </Button>
          <Button
            className="w-full sm:w-auto cursor-pointer text-sm"
            onClick={() => {
              filtrar()
              setFiltro(false)
            }}
            disabled={loading}
          >
            {loading ? "Aplicando..." : "Aplicar Filtro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )

}