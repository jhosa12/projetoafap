
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { FormProps } from "./cobranca/cobranca";
import { MultiSelect } from "../../ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react"
import { endOfMonth } from "date-fns";
import { DatePickerInput } from "@/components/DatePickerInput";
import { MultiSelects } from "@/components/ui/multiSelect";



interface DataProps {
  show: boolean,
  empresa: string,
  setFiltro: (open: boolean) => void,
  loading: boolean,
  listarCobranca: SubmitHandler<FormProps>,
  selectCobrador: Array<ConsultoresProps>
  arrayBairros: Array<Partial<{ bairro: string, check: boolean, id_empresa: string, cidade: string }>>
  // setArrayBairros: (array: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>) => void,
  inad: boolean,
  cidades: Array<string | undefined>
}

export function ModalFiltroCobranca({ loading, setFiltro, show, listarCobranca, selectCobrador, arrayBairros, empresa, inad, cidades }: DataProps) {
  const { register, watch, handleSubmit, control, setValue } = useForm<FormProps>({
    defaultValues: {
      status: 'A,R',
      // cobrador:selectCobrador,
      id_empresa: empresa,
      startDate: new Date(),
      endDate: new Date(),
      statusReagendamento: '',
    }
  })
  const bairrosSelecionados = watch('bairros')
  const cidadeSelecionada = watch('cidade')
  


  const handleStatusSelect = (status: string | undefined) => {
    if (!status) return

    const start = new Date()
    if (status === "RAV"|| status === 'AAV' || status === 'A/RAV') {

      const end = endOfMonth(new Date())
      setValue('startDate', start)
      setValue('endDate', end)
      setValue('periodo', false)

    }

    if (status === 'RV' || status ==='AV' || status === 'A/RV') {
      setValue('endDate', start)
      setValue('periodo', false)
    }

    setValue('statusReagendamento', status)
  }

  const isStatusVencido =  (watch('statusReagendamento') !== 'RV' && watch('statusReagendamento') !== 'AV' && watch('statusReagendamento') !== 'A/RV')
  const isStatusAVencer = (watch('statusReagendamento')==='RAV' || watch('statusReagendamento')==='AAV' || watch('statusReagendamento')==='A/RAV' )

  const handleCidadeChange = (value: string) => {
    setValue('cidade', value);
    setValue('bairros', [])
  };

  useEffect(() => {
    const bairrosDaCidade = arrayBairros
      .filter(b => b.cidade === cidadeSelecionada)
      .map(b => b.bairro)

    const bairrosValidos = bairrosSelecionados?.filter(b => bairrosDaCidade.includes(b))

    // Se houver bairros inválidos, limpa ou corrige
    if (bairrosSelecionados?.length !== bairrosValidos?.length) {
      setValue("bairros", bairrosValidos)
    }
  }, [cidadeSelecionada])


  const bairrosFilter = arrayBairros.filter(item => item.cidade === watch('cidade'))



  return (
    <Dialog open={show} onOpenChange={setFiltro}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="inline-flex items-center gap-2">
              <HiFilter size={24} />
              Filtro
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(listarCobranca)} className="flex flex-col space-y-4 w-full">

          <Controller
            control={control}
            name="cidade"
            render={({ field }) => (
              <Select value={field.value} onValueChange={handleCidadeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cidades?.map((cidade, index) => (
                    <SelectItem key={index} value={cidade ?? ''}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="bairros"
            render={({ field }) => (
              <MultiSelects
                options={bairrosFilter.map(item => ({
                  label: item.bairro ?? '',
                  value: item.bairro ?? ''
                }))}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Selecione o bairro"
                maxDisplayItems={3}


              />
            )}
          />

          <Controller
            control={control}
            name="cobrador"
            render={({ field }) => (
              <MultiSelects
                options={selectCobrador?.map((item) => ({
                  label: item.nome ?? '',
                  value: item.nome ?? '',
                })) ?? []}
                onChange={field.onChange}
                // defaultValue={field.value}
                placeholder="Selecione o Cobrador"
                maxDisplayItems={3}
                selected={field.value}
              />
            )}
          />

          <div className="flex flex-col gap-2">
            <Label className="text-xs">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select required value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A,R">ABERTO/REAGENDADO</SelectItem>
                    <SelectItem value="A">ABERTO</SelectItem>
                    <SelectItem value="R">REAGENDADO</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>


          <div className="flex flex-col gap-2">
            <Label className="text-xs">Status Reagendamento</Label>
            <Controller
              name="statusReagendamento"
              control={control}
              render={({ field }) => (
                <Select required value={field.value} onValueChange={e => handleStatusSelect(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Reagendamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R">REAGENDADOS</SelectItem>
                    <SelectItem value="RAV">REAGENDADOS A VENCER (RAV)</SelectItem>
                    <SelectItem value="RV">REAGENDADOS VENCIDOS (RV)</SelectItem>
                    <SelectItem value="A/B">ABERTOS E REAGENDADOS</SelectItem>
                    <SelectItem value="A">ABERTOS</SelectItem>
                    <SelectItem value="AV">ABERTOS VENCIDOS</SelectItem>
                    <SelectItem value="AAV">ABERTOS A VENCER</SelectItem>
                    <SelectItem value="A/RV">ABERTOS E REAGENDADOS VENCIDOS</SelectItem>
                    <SelectItem value="A/RAV">ABERTOS E REAGENDADOS A VENCER</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-4">
            { isStatusVencido && <div className="flex flex-col w-full">
              <Label className="text-xs">Data início</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    disable={isStatusAVencer}
                    value={value}
                    onChange={onChange}
                    className="h-9"

                  />

                )}
              />
            </div>}

            <div className="flex flex-col w-full">
              <Label className="text-xs">{!isStatusVencido ? 'A partir de' : 'Data fim'}</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    value={value}
                    onChange={onChange}
                    className="h-9"

                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="periodo"
              disabled={isStatusAVencer||isStatusVencido}
              checked={watch("periodo")}
              onChange={() => setValue("periodo", !watch("periodo"))}
            />
            <Label htmlFor="periodo" className="text-sm">Todo Período</Label>
          </div>

          {inad && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Número de parcelas</Label>
              <div className="flex gap-4">
                <Controller
                  name="param_nparcela"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Operador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="=">Igual a</SelectItem>
                        <SelectItem value=">">Maior que</SelectItem>
                        <SelectItem value="<">Menor que</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <input
                  type="number"
                  placeholder="Número de parcelas"
                  {...register("numeroParcelas")}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="outline" size="sm">
              Aplicar Filtro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  )

}