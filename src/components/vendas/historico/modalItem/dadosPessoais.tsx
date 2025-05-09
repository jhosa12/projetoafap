
import { Label, Select, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { CidadesProps } from "@/types/cidades";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { PlanosProps } from "@/types/planos";
import { CepMaskInput } from "@/components/CepMaskInput";
import { Phone } from "lucide-react";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
interface TabDadosPessoaisProps extends UseFormLeadProps{cidades:Array<CidadesProps>}


export function TabDadosPessoais({control,register,setValue,trigger,watch,cidades}:TabDadosPessoaisProps) {

    return(
        <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2 w-full flex flex-col">
                <Label className="text-xs" value="Nome" />
                <TextInput sizing={'sm'} {...register('nome',{required:'Nome é Obrigatório'})} type="text" placeholder="Nome" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Endereço" />
                <TextInput sizing={'sm'} {...register('endereco',{required:'Endereço é Obrigatório'})} type="text" placeholder="Endereço" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Bairro" />
                <TextInput sizing={'sm'} {...register('bairro',{required:'Bairro é Obrigatório'})} type="text" placeholder="Bairro" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Número" />
                <TextInput sizing={'sm'} {...register('numero')} type="number" placeholder="Número" />
            </div>
             <div className="w-full flex flex-col">
                <Label className="text-xs" value="Cidade" />

                <Select sizing="sm" {...register('cidade')}>
                    <option value=""></option>
                    {cidades?.filter((cid) => cid.uf === 'CE')?.map((cidade) => (
                        <option key={cidade.id_cidade} value={cidade.cidade}>{cidade.cidade}</option>
                    ))}
                </Select>
               
            </div>

            <div className="w-full flex flex-col">
                <Label className="text-xs" value="CEP" />
             <CepMaskInput controlName={'cep'} register={register} />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Guia de Rua" />
                <TextInput sizing={'sm'} {...register('guia_rua')} type="text" placeholder="Guia de Rua" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Celular1" />
              <PhoneMaskInput controlName={'celular1'} register={register} />
               
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Celular2" />
                <PhoneMaskInput controlName={'celular2'} register={register} />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="Data de Nascimento" />
                  <Controller 
                    name="data_nasc"
                    control={control}
                    render={({ field:{onChange,value} }) => (
                      <DatePicker selected={value}  onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt}  className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    )}
                  />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="RG" />
                <TextInput sizing={'sm'} {...register('rg')} type="text" placeholder="RG" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs" value="CPF" />
               <CPFInput controlName={'cpfcnpj'} register={register} />
            </div>
        </div>
    )
}