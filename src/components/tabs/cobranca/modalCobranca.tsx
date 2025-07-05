
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import {  Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { Controller, SubmitHandler, useForm} from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { FormProps } from "./cobranca/cobranca";
import { MultiSelect } from "../../ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";




interface DataProps {
  show: boolean,
  empresa:string,
  setFiltro: (open: boolean) => void,
  loading: boolean,
  listarCobranca: SubmitHandler<FormProps>,
  selectCobrador: Array<ConsultoresProps>
  arrayBairros: Array<Partial<{ bairro: string, check: boolean,id_empresa:string,cidade:string }>>
 // setArrayBairros: (array: Array<Partial<{ bairro: string, check: boolean,id_empresa:string }>>) => void,
  inad:boolean,
  cidades : Array<string|undefined>
}

export function ModalFiltroCobranca({ loading, setFiltro, show, listarCobranca, selectCobrador, arrayBairros, empresa,inad,cidades }: DataProps) {
  const { register, watch, handleSubmit, control, setValue } = useForm<FormProps>({
    defaultValues: {
      status:'A,R',
     // cobrador:selectCobrador,
      id_empresa: empresa,
      startDate:new Date(),
      endDate:new Date(), 
      
     
    }
  })
 const bairrosSelecionados = watch('bairros')
 const cidadeSelecionada = watch('cidade')

 




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


  const bairrosFilter = arrayBairros.filter(item=>item.cidade===watch('cidade'))
 




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
            <MultiSelect
            options={bairrosFilter.map(item => ({
              label: item.bairro ?? '',
              value: item.bairro ?? ''
            }))}
            value={field.value}
            onValueChange={field.onChange}
            placeholder="Selecione o bairro"
            maxCount={3}
            
         
            />
          )}
        />

        <Controller
          control={control}
          name="cobrador"
          render={({ field }) => (
            <MultiSelect
              options={selectCobrador?.map((item) => ({
                label: item.nome ?? '',
                value: item.nome ?? '',
              })) ?? []}
              onValueChange={field.onChange}
             // defaultValue={field.value}
              placeholder="Selecione o Cobrador"
              maxCount={3}
              value={field.value}
            />
          )}
        />

        <div className="flex flex-col gap-2">
          <Label className="text-xs">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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

        <div className="flex gap-4">
          <div className="flex flex-col w-full">
            <Label className="text-xs">Data início</Label>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormat="dd/MM/yyyy"
                  locale={pt}
                  className="w-full text-xs border rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400"
                />
              )}
            />
          </div>

          <div className="flex flex-col w-full">
            <Label className="text-xs">Data fim</Label>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormat="dd/MM/yyyy"
                  locale={pt}
                  className="w-full text-xs border rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400"
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="periodo"
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