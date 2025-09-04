import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { UseFormAssociadoProps } from "../../../../../../components/modals/admContrato/dadosAssociado/modalEditarDados";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Controller } from "react-hook-form";
import { arrayUF } from "../../../_types/array-uf";
import { CepMaskInput } from "@/components/CepMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { Combobox } from "@/components/ui/combobox";
import { SelectBairroEmpresa } from "@/components/selectBairrosEmpresa";

export function TabTitular({ register, setValue, watch, control }: UseFormAssociadoProps) {
  const { cidades } = useContext(AuthContext);


  const cidadesFiltered = cidades?.filter((cid) => cid.uf === watch('uf'))

  return (
    <div className="grid grid-cols-5 gap-2">

      {/* Nome */}
      <div className="col-span-2">
        <Label className="text-xs">Nome</Label>
        <Input className="text-xs" {...register('nome', { required: 'Nome é Obrigatório' })} placeholder="Nome" />
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

        <CepMaskInput register={register} controlName="cep" />

      </div>

      {/* Endereço */}
      <div className="col-span-2">
        <Label className="text-xs">Endereço</Label>
        <Input className="text-xs" {...register('endereco', { required: 'Endereço é Obrigatório' })} placeholder="Endereço" />
      </div>

      {/* Número */}
      <div className="col-span-1">
        <Label className="text-xs">Número</Label>
        <Input className="text-xs" {...register('numero')} type="number" placeholder="Número" />
      </div>

      {/* Bairro */}
      <div className="col-span-2">
        <Label className="text-xs">Bairro</Label>
        <Controller
          control={control}
          name="bairro"
          rules={{ required: 'Bairro é obrigatório' }}
          render={({ field }) => (
            <SelectBairroEmpresa value={field.value} onChange={field.onChange} />
          )}
        />
        {/* <Input className="text-xs" {...register('bairro',{required:'Bairro é obrigatório'})} placeholder="Bairro" /> */}
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
          rules={{ required: 'UF é obrigatório' }}
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
          rules={{ required: 'Cidade é obrigatório' }}
          render={({ field }) => (
            <Combobox
              items={cidadesFiltered?.map((cidade) => ({ value: cidade.cidade, label: cidade.cidade })) || []}
              onChange={field.onChange}
              value={field.value}
              classNameInput="h-9"
            />
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

        <CPFInput required register={register} controlName="cpfcnpj" />

      </div>

      {/* Naturalidade */}
      <div className="col-span-1">
        <Label className="text-xs">Naturalidade</Label>
        <Input className="text-xs" {...register('naturalidade')} />
      </div>

      {/* Celular1 */}
      <div className="col-span-1">
        <Label className="text-xs">Celular1</Label>

        <PhoneMaskInput register={register} controlName="celular1" />

      </div>

      {/* Celular2 */}
      <div className="col-span-1">
        <Label className="text-xs">Celular2</Label>

        <PhoneMaskInput register={register} controlName="celular2" />

      </div>

      {/* Telefone */}
      <div className="col-span-1">
        <Label className="text-xs">Telefone</Label>

        <PhoneMaskInput register={register} controlName="telefone" />

      </div>

      {/* Email */}
      <div className="col-span-2">
        <Label className="text-xs">E-mail</Label>
        <Input className="text-xs" {...register('email')} />
      </div>
    </div>
  );
}
