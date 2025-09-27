import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Checkbox } from "@/components/ui/checkbox";
import useActionsObito from "@/app/dashboard/servicos/_hooks/useActionsObito";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TabelaCompleta } from "../../../convalescentes/data-table";
import { columns } from "../../../convalescentes/colunas-listagem";
import React, { useContext, useEffect, useState } from "react";
import { getColumns } from "../../../convalescentes/colunas-dependentes";
import { Dependente, getColumnsDepObito } from "../../colunas-dependentes-obitos";
import { AuthContext } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

export const OSDadosFalecido = () => {
  const { control, register } = useFormContext<ObitoProps>()
  const [modalDependente, setModalDependente] = useState(false);
  const { dadosassociado } = useContext(AuthContext)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [open, setOpen] = React.useState(false)
  
  const {

    isDependenteSelecionado,
    usarDadosTitular,
    handleCheckboxTitularChange,
    handleConfirmarSelecaoDependente,
    setIsModalOpen,
    setDependenteSelecionado,
    isModalOpen,
    setarCampoAssociado,
    rowSelection,
    setRowSelection,
    listaAssociado,
    setUsarDadosTitular

  } = useActionsObito()

  const columnsDep = React.useMemo(
    () => getColumnsDepObito({ setarCampoAssociado, setModalDependente }),
    [setarCampoAssociado, setModalDependente]

  )

  const dependentesVisiveis = React.useMemo(
    () => dadosassociado?.dependentes?.filter((d) => d.excluido !== true) || [],
    [dadosassociado]
  )

  useEffect(() => {

    if (listaAssociado?.id_associado) {
      if (listaAssociado.dependentes !== null) {
        setDependenteSelecionado(true);
        setUsarDadosTitular(false);
      } else {
        setDependenteSelecionado(false);
        setUsarDadosTitular(true);
      }
    }
  }, [listaAssociado]);


  return (
    <Card className="bg-white border-gray-200 shadow-none ">
      <CardHeader>
        <CardTitle className="text-gray-900">Dados do Falecido</CardTitle>
        <CardDescription className="text-gray-600">Informações pessoais do falecido</CardDescription>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <form>
            <div className="flex justify-start w-full gap-10 text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="titular"
                  disabled={isDependenteSelecionado}
                  checked={usarDadosTitular}
                  onCheckedChange={handleCheckboxTitularChange}
                />
                <Label htmlFor="titular">TITULAR</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dependente"
                  checked={isDependenteSelecionado}
                  onCheckedChange={(checked) => {

                    if (checked) {
                      setIsModalOpen(true)
                    } else {
                      setDependenteSelecionado(false)
                    }
                  }}
                  disabled={usarDadosTitular}
                />
                <Label htmlFor="dependente">DEPENDENTES</Label>

              </div>
            </div>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Selecione o Dependente</DialogTitle>
                <DialogDescription>
                  Selecione o dependente desejado na lista abaixo.
                  Clique em 'Salvar Mudanças' para finalizar a seleção.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <TabelaCompleta
                  columns={columnsDep}
                  data={dependentesVisiveis}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleConfirmarSelecaoDependente}
                >Salvar Mudanças</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="nome_falecido">Nome Completo *</Label>
          <Input
            id="nome_falecido"
            {...register('nome_falecido')}
            placeholder="Nome completo do falecido"
            value={listaAssociado.nome ?? ''}
            onChange={(e: any) => setarCampoAssociado({ nome: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2 ">
          <Label htmlFor="tabs-demo-username">Data de Nascimento</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="lg:col-span-1 justify-between font-normal text-gray-500"
              >
                {listaAssociado.data_nasc ? new Date(listaAssociado.data_nasc).toLocaleDateString('pt-BR') : 'Data não definida'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={listaAssociado.data_nasc ?? undefined}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date) {

                    setarCampoAssociado({ data_nasc: date });

                    setDate(date);
                  }
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo</Label>
          <Controller
            control={control}
            name="sexo"
            render={({ field }) =>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            }
          />

        </div>
        <div className="space-y-2">
          <Label htmlFor="estado_civil">Estado Civil</Label>
          <Controller
            control={control}
            name="estado_civil"
            render={({ field }) =>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="Casado">Casado(a)</SelectItem>
                  <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                  <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                </SelectContent>
              </Select>
            }
          />

        </div>
        <div className="space-y-2">
          <Label htmlFor="profissao">Profissão</Label>
          <Input
            id="profissao"
            {...register('profissao')}
            placeholder="Profissão do falecido"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            {...register('rg')}
            placeholder="00.000.000-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            {...register('cpf')}
            placeholder="000.000.000-00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="religiao">Religião</Label>
          <Input
            id="religiao"
            {...register('religiao')}
            placeholder="Religião do falecido"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="naturalidade">Naturalidade</Label>
          <Input
            id="naturalidade"
            {...register('naturalidade')}
            placeholder="Cidade de nascimento"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="uf_naturalidade">UF Naturalidade</Label>
          <Input
            id="uf_naturalidade"
            {...register('uf_naturalidade')}
            placeholder="SP"
            maxLength={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome_pai">Nome do Pai</Label>
          <Input
            id="nome_pai"
            {...register('nome_pai')}
            placeholder="Nome completo do pai"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome_mae">Nome da Mãe</Label>
          <Input
            id="nome_mae"
            {...register('nome_mae')}
            placeholder="Nome completo da mãe"
          />
        </div>
      </CardContent>
    </Card>
  )
}