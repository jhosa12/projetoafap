

import { UseFormLeadProps } from "./modalItem";
import { CidadesProps } from "@/types/cidades";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { CepMaskInput } from "@/components/CepMaskInput";
import { Phone } from "lucide-react";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
interface TabDadosPessoaisProps extends UseFormLeadProps{cidades:Array<CidadesProps>}


export function TabDadosPessoais({control,register,setValue,trigger,watch,cidades}:TabDadosPessoaisProps) {

    return(
        <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2 w-full flex flex-col">
                <Label className="text-xs">Nome</Label>
                <Input  {...register('nome',{required:'Nome é Obrigatório'})} type="text" placeholder="Nome" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Endereço</Label> 
                <Input {...register('endereco',{required:'Endereço é Obrigatório'})} type="text" placeholder="Endereço" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Bairro</Label>
               
                <Input {...register('bairro',{required:'Bairro é Obrigatório'})} type="text" placeholder="Bairro" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Complemento</Label>
                
                <Input {...register('numero')} type="number" placeholder="Número" />
            </div>
             <div className="w-full flex flex-col">
                <Label className="text-xs">Cidade</Label>

                <Controller
                name="cidade"
                rules={{required:'Cidade é Obrigatório'}}
                control={control}
                render={({ field }) => (
                    
                               <Combobox
                               items={cidades?.map((cidade) => ({ value: cidade.cidade, label: cidade.cidade })) || []}
                               onChange={field.onChange}
                               value={field.value}
                             />
                )}
                
                />      
            </div>

            <div className="w-full flex flex-col">
                <Label className="text-xs" >CEP</Label>
                
             <CepMaskInput  controlName={'cep'} register={register} />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Guia de Rua</Label>
                
                <Input {...register('guia_rua')} type="text" placeholder="Guia de Rua" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Celular1</Label>
                
              <PhoneMaskInput controlName={'celular1'} register={register} />
               
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Celular2</Label>
                
                <PhoneMaskInput controlName={'celular2'} register={register} />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Data de Nascimento</Label>
                
                  <Controller 
                    name="data_nasc"
                    control={control}
                    render={({ field:{onChange,value} }) => (
                     <DatePickerInput className="h-9" value={value} onChange={onChange} />
                    )}
                  />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">RG</Label>
                <Input {...register('rg')} type="text" placeholder="RG" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">CPF</Label>
               <CPFInput controlName={'cpfcnpj'} register={register} />
            </div>
        </div>
    )
}