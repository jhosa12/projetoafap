import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormLeadProps } from "./modalItem";
import { PlanosProps } from "@/types/planos";
import { Controller } from "react-hook-form";
import { DatePickerInput } from "@/components/DatePickerInput";
interface TabPlanoProps extends UseFormLeadProps {
  planos: Array<PlanosProps>;
}

export function TabPlano({
  control,
  register,
  setValue,
  trigger,
  watch,
  planos,
}: TabPlanoProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="">
        <Label className="text-xs">Categoria de Plano</Label>
        <Controller
          name="id_plano"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                onChange(value);
                const plano = planos.find(
                  (plano) => plano.id_plano === Number(value)
                );
                if (plano) {
                  setValue("plano", plano.descricao);
                  setValue("valor_mensalidade", plano.valor);
                }
              }}
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {planos.map((plano) => (
                  <SelectItem
                    key={plano.id_plano}
                    value={plano?.id_plano?.toString()}
                  >
                    {plano?.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Origem de Plano</Label>
        <Controller
          name="origem"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANO NOVO">PLANO NOVO</SelectItem>
                <SelectItem value="TRANSFERENCIA SEM CA">
                  TRANSFERENCIA
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Valor Mensalidade</Label>
        <Controller
          name="valor_mensalidade"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              type="text"
              placeholder="Valor"
              className="w-full"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Vencimento Plano</Label>
        <Controller
          name="vencimento"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePickerInput
              value={value}
              onChange={onChange}
              className="h-9"
            />
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Numero de Parcelas</Label>
        <Controller
          name="n_parcelas"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              type="number"
              placeholder="Parcelas"
              className="w-full"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Forma de Pagamento</Label>
        <Controller
          name="form_pag"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOLETO">BOLETO</SelectItem>
                <SelectItem value="CARTAO">CARTÃO</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="">
        <Label className="text-xs">Data de Adesão</Label>
        <Controller
          name="adesao"
          control={control}
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
  );
}
