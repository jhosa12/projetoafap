import { AuthContext } from '@/store/AuthContext';
import { useContext } from 'react';



import { Controller } from "react-hook-form";
import { ChildrenProps } from "@/app/dashboard/admcontrato/_components/cadastro/modalCadastro";

import {
  Label,
} from "@/components/ui/label";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePickerInput } from '@/components/DatePickerInput';


export function DadosPlano({ control, setValue }: ChildrenProps) {
  const { consultores, planos } = useContext(AuthContext);


  const handlePlanoChange = (selectedPlanoId: number) => {
    const selectedPlan = planos?.find(plan => plan.id_plano === selectedPlanoId);
    if (selectedPlan) {
      setValue('contrato.id_plano', selectedPlan.id_plano);
      setValue('contrato.plano', selectedPlan.descricao);
      setValue('contrato.valor_mensalidade', Number(selectedPlan?.valor));
    }
  };
  return (
    <div className="grid gap-2 grid-flow-c-dense w-full md:grid-cols-4">

      {/* Origem */}
      <div className="col-span-1">
        <Label className="text-xs">Origem</Label>
        <Controller
          control={control}
          name="contrato.origem"
          render={({ field }) => (
            <Select required onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-9">
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

      {/* Plano */}
      <div className="col-span-1">
        <Label className="text-xs">Plano</Label>
        <Controller
          control={control}
          name="contrato.id_plano"
          render={({ field: { onChange, value } }) => (
            <Select
              required
              value={String(value)}
              onValueChange={(val) => {
                handlePlanoChange(Number(val));
                //onChange(val);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {planos?.map((item) => (
                  <SelectItem key={item.id_plano} value={String(item.id_plano)}>
                    {item.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Valor */}
      <div className="col-span-1">
        <Label className="text-xs">Valor</Label>
        <Controller
          control={control}
          name="contrato.valor_mensalidade"
          render={({ field }) => (
            <Input required className="h-9" type="number" {...field} />
          )}
        />
      </div>

      {/* Cobrador */}
      <div className="col-span-1">
        <Label className="text-xs">Cobrador</Label>
        <Controller
          control={control}
          name="contrato.cobrador"
          render={({ field }) => (
            <Select required onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {consultores
                  ?.filter(item => item.funcao === "COBRADOR (RDA)")
                  .map(item => (
                    <SelectItem key={item.id_consultor} value={item.nome}>
                      {item.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Consultor */}
      <div className="col-span-1">
        <Label className="text-xs">Consultor</Label>
        <Controller
          control={control}
          name="contrato.consultor"
          rules={{ required: 'Consultor é obrigatório' }}
          render={({ field }) => (
            <Select required onValueChange={field.onChange} value={field.value}>
              <SelectTrigger aria-required className="h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {consultores
                  ?.filter(item => item.funcao === "PROMOTOR(A) DE VENDAS")
                  .map(item => (
                    <SelectItem className='text-xs' key={item.id_consultor} value={item.nome}>
                      {item.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Supervisor */}
      <div className="col-span-1">
        <Label className="text-xs">Supervisor</Label>
        <Controller
          control={control}
          name="contrato.supervisor"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger className="h-9">
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

      {/* Número de Parcelas */}
      <div className="col-span-1">
        <Label className="text-xs">Número de Parcelas</Label>
        <Controller
          control={control}
          name="contrato.n_parcelas"
          render={({ field }) => (
            <Input required className="h-9" type="number" {...field} />
          )}
        />
      </div>

      {/* Vencimento 1ª Parcela */}
      <div className="col-span-1">
        <Label className="text-xs">Venc. 1° Parcela</Label>
        <Controller
          control={control}
          name="contrato.data_vencimento"
          render={({ field }) => (
            <DatePickerInput
              required
              onChange={field.onChange}
              value={field.value}
              className='h-9'
            />
          )}
        />
      </div>

      {/* Data de adesão */}
      <div className="col-span-1">
        <Label className="text-xs">Data de adesão</Label>
        <Controller
          control={control}
          name="contrato.dt_adesao"
          render={({ field }) => (
            <DatePickerInput
              required
              onChange={field.onChange}
              value={field.value}
              className='h-9'
            />
          )}
        />
      </div>

      {/* Fim da carência */}
      <div className="col-span-1">
        <Label className="text-xs">Fim da carência</Label>
        <Controller
          control={control}
          name="contrato.dt_carencia"
          render={({ field }) => (
            <DatePickerInput
              required
              onChange={field.onChange}
              value={field.value}
              className='h-9'
            />
          )}
        />
      </div>
    </div>
  );
}
