import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
registerLocale('pt', pt)

import { UseFormAssociadoProps } from "../../../../modals/admContrato/dadosAssociado/modalEditarDados";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Controller } from "react-hook-form";

export function TabContrato({ register,watch, control }: UseFormAssociadoProps) {
  const { consultores } = useContext(AuthContext)

  return (
    <div className="grid gap-2 pl-2 pr-2 w-full grid-cols-4">

      <div className="col-span-1">
        <Label className="text-xs">Contrato</Label>
        <Input disabled className="text-xs" {...register('contrato.id_contrato',{required:'Contrato é obrigatório'})} type="number" />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Vencimento</Label>
        <Controller
          name="contrato.data_vencimento"
          control={control}
          rules={{required:'Vencimento é obrigatório'}}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              disabled
              selected={value??null}
              onChange={e => e && onChange(e)}
              dateFormat="dd/MM/yyyy"
              locale="pt"
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Adesão</Label>
        <Controller
          name="contrato.dt_adesao"
          control={control}
          rules={{required:'Adesão é obrigatório'}}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value}
              onChange={e => e && onChange(e)}
              dateFormat="dd/MM/yyyy"
              locale="pt"
             className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Carência</Label>
        <Controller
          name="contrato.dt_carencia"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value}
              onChange={e => e && onChange(e)}
              dateFormat="dd/MM/yyyy"
              locale={pt}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Origem</Label>

        <Controller 
        name="contrato.origem"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PLANO NOVO">PLANO NOVO</SelectItem>
            <SelectItem value="TRANSFERENCIA SEM CA">TRANSFERÊNCIA</SelectItem>
          </SelectContent>
        </Select>
        )}
        />
       
      </div>

      <div className="col-span-2">
        <Label className="text-xs">Plano</Label>
        <Input disabled className="text-xs" {...register("contrato.plano")}  />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Valor</Label>
        <Input disabled className="text-xs" {...register("contrato.valor_mensalidade")} type="number" />
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Cobrador</Label>
        <Controller
          name="contrato.cobrador"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {consultores?.filter(item => item.funcao === 'COBRADOR (RDA)').map(item => (
                <SelectItem key={item.id_consultor} value={item.nome}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          )}
        />
       
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Consultor</Label>
        <Controller
          name="contrato.consultor"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {consultores?.filter(item => item.funcao === 'PROMOTOR(A) DE VENDAS').map((item, index) => (
                <SelectItem key={index} value={item.nome}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          )}
        />
        
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Supervisor</Label>
        <Controller
          name="contrato.supervisor"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JACKSON">JACKSON</SelectItem>
              <SelectItem value="SAMUEL">SAMUEL</SelectItem>
            </SelectContent>
          </Select>
          )}
          />
       
      </div>

      <div className="col-span-1">
        <Label className="text-xs">Parcelas</Label>
        <Input disabled className="text-xs" value={watch('contrato.n_parcelas')} type="number" />
      </div>

    </div>
  )
}
