import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import InputMask from 'react-input-mask';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { UseFormAssociadoProps } from "../../../../modals/admContrato/dadosAssociado/modalEditarDados";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Controller } from "react-hook-form";
import { arrayUF } from "@/types/associado";

export function TabTitular({ register, setValue, watch, control }: UseFormAssociadoProps) {
  const { cidades } = useContext(AuthContext);

  return (
    <div className="grid grid-cols-5 gap-2">

      {/* Nome */}
      <div className="col-span-2">
        <Label className="text-xs">Nome</Label>
        <Input  className="text-xs" {...register('nome',{required:'Nome é Obrigatório'})} placeholder="Nome" />
      </div>

      {/* Nascimento */}
      <div className="col-span-1">
        <Label className="text-xs">Nascimento</Label>
        <Controller
          name="data_nasc"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value}
              onChange={e => e && onChange(e)}
              dateFormat={"dd/MM/yyyy"}
              locale={pt}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Sexo */}
      <div className="col-span-1">
        <Label className="text-xs">Sexo</Label>
        <Controller
          control={control}
          name="sexo"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">MASCULINO</SelectItem>
                <SelectItem value="F">FEMININO</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* CEP */}
      <div className="col-span-1">
        <Label className="text-xs">CEP</Label>
        <Controller
          name="cep"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask="99999-999"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Endereço */}
      <div className="col-span-2">
        <Label className="text-xs">Endereço</Label>
        <Input className="text-xs" {...register('endereco',{required:'Endereço é Obrigatório'})} placeholder="Endereço" />
      </div>

      {/* Número */}
      <div className="col-span-1">
        <Label className="text-xs">Número</Label>
        <Input className="text-xs" {...register('numero')} type="number" placeholder="Número" />
      </div>

      {/* Bairro */}
      <div className="col-span-2">
        <Label className="text-xs">Bairro</Label>
        <Input className="text-xs" {...register('bairro',{required:'Bairro é obrigatório'})} placeholder="Bairro" />
      </div>

      {/* Referência */}
      <div className="col-span-2">
        <Label className="text-xs">Ponto ref</Label>
        <Input className="text-xs" {...register('guia_rua')} placeholder="Referência" />
      </div>

      {/* UF */}
      <div className="col-span-1">
        <Label className="text-xs">UF</Label>
        <Controller
          control={control}
          name="uf"
          rules={{required:'UF é obrigatório'}}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {arrayUF.map(uf => (
                  <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Cidade */}
      <div className="col-span-1">
        <Label className="text-xs">Cidade</Label>
        <Controller
          control={control}
          name="cidade"
          rules={{required:'Cidade é obrigatório'}}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {cidades?.filter(c => c.uf === watch("uf")).map(c => (
                  <SelectItem key={c.id_cidade} value={c.cidade}>
                    {c.cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* RG */}
      <div className="col-span-1">
        <Label className="text-xs">RG</Label>
        <Input className="text-xs" {...register('rg')} type="number" />
      </div>

      {/* CPF */}
      <div className="col-span-1">
        <Label className="text-xs">CPF</Label>
        <Controller
          name="cpfcnpj"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask="999.999.999-99"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Naturalidade */}
      <div className="col-span-1">
        <Label className="text-xs">Naturalidade</Label>
        <Input className="text-xs" {...register('naturalidade')} />
      </div>

      {/* Celular1 */}
      <div className="col-span-1">
        <Label className="text-xs">Celular1</Label>
        <Controller
          name="celular1"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask="(99) 9 9999-9999"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Celular2 */}
      <div className="col-span-1">
        <Label className="text-xs">Celular2</Label>
        <Controller
          name="celular2"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask="(99) 9 9999-9999"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Telefone */}
      <div className="col-span-1">
        <Label className="text-xs">Telefone</Label>
        <Controller
          name="telefone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask="(99) 9 9999-9999"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="h-9 w-full rounded-md shadow-sm px-2 border text-sm border-gray-200 "
            />
          )}
        />
      </div>

      {/* Email */}
      <div className="col-span-2">
        <Label className="text-xs">E-mail</Label>
        <Input className="text-xs" {...register('email')} />
      </div>
    </div>
  );
}
