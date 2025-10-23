

import { UseFormLeadProps } from "./modalItem";
import { CidadesProps } from "@/types/cidades";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { CepMaskInput } from "@/components/CepMaskInput";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { SelectBairroEmpresa } from "@/components/selectBairrosEmpresa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface TabDadosPessoaisProps extends UseFormLeadProps{cidades:Array<CidadesProps>}


export function TabDadosPessoais({control,register,cidades,watch}:TabDadosPessoaisProps) {

    return(
        <div className="grid grid-cols-4 gap-3">
           {!watch('id_lead') && <div className="col-span-4">
                <Controller
                name="status"
                rules={{required:'Status é Obrigatório'}}
                control={control}
                render={({ field }) => (
                   <Select value={field.value} onValueChange={field.onChange}>
                   <SelectTrigger >
                     <SelectValue placeholder="Status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="LEAD">LEAD</SelectItem>
                     <SelectItem value="PRE VENDA">PRE VENDA</SelectItem>
                     <SelectItem value="PROSPECCAO">PROSPECCAO</SelectItem>
                     <SelectItem value="VENDA">VENDA</SelectItem>
                   </SelectContent>
                 </Select>
                )}
                />
            </div>}
            <div className="col-span-2 w-full flex flex-col">
                <Label className="text-xs">Nome</Label>
                <Input  {...register('nome',{required:'Nome é Obrigatório'})} type="text" placeholder="Nome" />
            </div>
            <div className="w-full flex flex-col">
                <Label className="text-xs">Endereço</Label> 
                <Input {...register('endereco',{required:'Endereço é Obrigatório'})} type="text" placeholder="Endereço" />
            </div>
           
            
            <div className="w-full flex flex-col">
                <Label className="text-xs">Bairro Plano</Label>
                <Controller
                name="bairro"
                rules={{required:'Bairro Plano é Obrigatório'}}
                control={control}
                render={({ field }) => (
                    <SelectBairroEmpresa value={field.value?? null} onChange={field.onChange} />
                )}
                /> 
            </div>

            <div className="w-full flex flex-col">
                <Label className="text-xs">Numero</Label>
                <Input {...register('numero',{valueAsNumber:true})} type="number" placeholder="Número" />
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
                               classNameInput="h-9"
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