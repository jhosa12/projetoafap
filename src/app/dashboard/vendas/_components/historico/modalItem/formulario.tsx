

import { UseFormLeadProps } from "./modalItem";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";


export function TabFormulario({control,register,setValue,trigger,watch}:UseFormLeadProps) {
    return(
  <div className="grid grid-cols-4 gap-2">
  {/* Empresa Atual */}
  <div>
    <Label className="text-xs" htmlFor="empresaAtual">Empresa Atual</Label>
    <Controller
      control={control}
      name="empresaAtual"
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className=" h-9">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AFAP PARAISO">AFAP PARAISO</SelectItem>
            <SelectItem value="ANJO DA GUARDA">ANJO DA GUARDA</SelectItem>
            <SelectItem value="PADRE CICERO">PADRE CICERO</SelectItem>
            <SelectItem value="AMOR CELESTIAL">AMOR CELESTIAL</SelectItem>
            <SelectItem value="NÃO POSSUI">NÃO POSSUI</SelectItem>
            <SelectItem value="OUTRA">OUTRA</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  </div>

  {/* Serviços usados na outra empresa */}
  <div className="col-span-2">
    <Label className="text-xs" htmlFor="servicosUsados">Serviços usados na outra empresa</Label>
    <Input
      id="servicosUsados"
      className="text-xs h-9"
      placeholder="Serviços usados na outra empresa"
      {...register("servicosUsados")}
    />
  </div>

  {/* Motivo de saída */}
  <div>
    <Label className="text-xs" htmlFor="motivo">Motivo de saída da outra empresa</Label>
    <Input
      id="motivo"
      className="text-xs h-9"
      placeholder="Motivo"
      {...register("motivo")}
    />
  </div>

  {/* Possui Plano de Saúde */}
  <div>
    <Label className="text-xs" htmlFor="planodesaude">Possui Plano de Saúde</Label>
    <Controller
      control={control}
      name="planodesaude"
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className=" h-9">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIM">SIM</SelectItem>
            <SelectItem value="NAO">NÃO</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  </div>

  {/* Indicação */}
  <div className="col-span-2">
    <Label className="text-xs" htmlFor="indicacao">Indicação</Label>
    <Input
      id="indicacao"
      className="text-xs h-9"
      placeholder="Indicação"
      {...register("indicacao")}
    />
  </div>

  {/* Possui Pet */}
  <div>
    <Label className="text-xs" htmlFor="possuiPet">Possui Pet?</Label>
    <Controller
      control={control}
      name="possuiPet"
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className=" h-9">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIM">SIM</SelectItem>
            <SelectItem value="NAO">NÃO</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  </div>

  {/* Faria um plano pet? */}
  <div>
    <Label className="text-xs" htmlFor="planoPet">Faria um plano pet?</Label>
    <Controller
      control={control}
      name="planoPet"
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className=" h-9">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIM">SIM</SelectItem>
            <SelectItem value="NAO">NÃO</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  </div>

  {/* Previsão de Visita */}
  <div>
    <Label className="text-xs" htmlFor="visita">Previsão de Visita</Label>
    <Controller
      name="visita"
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePickerInput
          value={value}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className="h-9"
        />
      )}
    />
  </div>
</div>
    )
}