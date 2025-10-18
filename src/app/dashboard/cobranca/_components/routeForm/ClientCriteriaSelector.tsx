
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import SelectStatusCobranca from "../selectStatusCobranca";
import { ConsultoresProps } from "@/types/consultores";

import { RouteProps } from "../../types/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelects } from "@/components/ui/multiSelect";

interface Props{
  consultores:ConsultoresProps[]
}
const operators = [
  // { value: ">=", label: ">= (maior ou igual)" },
  { value: ">", label: "> (maior que)" },
  { value: "=", label: "= (igual a)" },
  // { value: "<=", label: "<= (menor ou igual)" },
   { value: "<", label: "< (menor que)" }
];

const monthOptions = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ClientCriteriaSelector = ({consultores}:Props) => {
  // Assuming the format is "operator:value" for simplicity, defaulting to ">=" for display

 // const currentValue = overdueMonths;
 const cobradores =  consultores.filter((item)=>item.funcao==='COBRADOR (RDA)')
 const {control} = useFormContext<RouteProps>()

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700">Listar por:</p>
        <Controller
          control={control}
          name="parametros.listar_por_cobranca"
          render={({ field }) => (
            <RadioGroup
              defaultValue={field.value ? "cobranca" : "vencimento"}
              onValueChange={(value) => field.onChange(value === "cobranca")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cobranca" id="cobranca" />
                <Label htmlFor="cobranca" className="text-xs font-normal">
                  Cobrança
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vencimento" id="vencimento" />
                <Label htmlFor="vencimento" className="text-xs font-normal">
                  Vencimento
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-700 mb-2">Mensalidades vencidas:</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          
            <Controller
              control={control}
              name="parametros.criterio.operator"
              render={({field}) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators?.map(op => (
                      <SelectItem key={op.value} value={op.value} className="text-xs">
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            
            
            />
        
          
            <Controller
              control={control}
              name="parametros.criterio.value"
              render={({field}) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Valor" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions?.map(months => (
                      <SelectItem key={months} value={months.toString()} className="text-xs">
                        {months} mês{months > 1 ? 'es' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
        
          
        </div>
      </div>


      <Controller
      control={control}
      name="parametros.statusReagendamento"
      render={({field}) => (
        <SelectStatusCobranca label={false} className="h-8 text-xs" value={field.value} onChange={field.onChange}/>
      )}
      />

     <Controller
            control={control}
            name="parametros.cobrador"
            render={({ field }) => (
              <MultiSelects  
              
                options={cobradores?.map((item) => ({
                  label: item.nome ?? '',
                  value: item.nome ?? '',
                })) ?? []}
                onChange={field.onChange}
                placeholder="Selecione a classificação"
                maxDisplayItems={3}
                selected={field.value??[]}
                className="min-h-8"
              />
            )}
          />
      {/* <div className="p-2 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          Critério selecionado:
        </p>
        <Badge variant="secondary" className="text-xs mt-1">
          {watch("parametros.criterio.operator")} {watch("parametros.criterio.value")} mensalidade{watch("parametros.criterio.value") > 1 ? 's' : ''} vencida{watch("parametros.criterio.value") > 1 ? 's' : ''}
        </Badge>
      </div> */}
    </div>
  );
};

export default ClientCriteriaSelector;
