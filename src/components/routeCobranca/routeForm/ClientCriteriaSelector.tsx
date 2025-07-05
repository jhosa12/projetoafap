import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { RouteProps } from "@/types/cobranca";

interface ClientCriteriaSelectorProps {
  control:Control<RouteProps>
  watch:UseFormWatch<RouteProps>
  // overdueMonths: number;
  // onChange: (months: number) => void;
}

const operators = [
  // { value: ">=", label: ">= (maior ou igual)" },
  { value: ">", label: "> (maior que)" },
  { value: "=", label: "= (igual a)" },
  // { value: "<=", label: "<= (menor ou igual)" },
   { value: "<", label: "< (menor que)" }
];

const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ClientCriteriaSelector = ({control,watch}: ClientCriteriaSelectorProps) => {
  // Assuming the format is "operator:value" for simplicity, defaulting to ">=" for display
  const currentOperator = ">="; // This could be extracted from a more complex data structure
 // const currentValue = overdueMonths;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-gray-700 mb-2">Mensalidades vencidas:</p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Operador:</label>
            <Controller
              control={control}
              name="parametros.criterio.operator"
              render={({field}) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
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
        
          </div>
          
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Valor:</label>
            <Controller
              control={control}
              name="parametros.criterio.value"
              render={({field}) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
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
      </div>

      <div className="p-2 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          Critério selecionado:
        </p>
        <Badge variant="secondary" className="text-xs mt-1">
          {watch("parametros.criterio.operator")} {watch("parametros.criterio.value")} mensalidade{watch("parametros.criterio.value") > 1 ? 's' : ''} vencida{watch("parametros.criterio.value") > 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  );
};

export default ClientCriteriaSelector;
