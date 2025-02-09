
import { Label, Select, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';


export function TabFormulario({control,register,setValue,trigger,watch}:UseFormLeadProps) {
    return(
        <div className="grid grid-cols-4 gap-2">
            <div className="">
                <Label className="text-xs" value="Empresa Atual" />
                <Select sizing={'sm'} {...register('empresaAtual')} >
                    <option value=""></option>
                    <option value="AFAP PARAISO">AFAP PARAISO</option>
                    <option value="ANJO DA GUARDA">ANJO DA GUARDA</option>
                    <option value="PADRE CICERO">PADRE CICERO</option>
                    <option value="AMOR CELESTIAL">AMOR CELESTIAL</option>
                    <option value="NÃO POSSUI">NÃO POSSUI</option>
                    <option value="OUTRA">OUTRA</option>
                </Select>
            </div>
            <div className="col-span-2">
                <Label className="text-xs" value="Serviços usados na outra empresa" />
                <TextInput sizing={'sm'} {...register('servicosUsados')} type="text" placeholder="Serviços usados na outra empresa"/>
            </div>
            <div className="">
                <Label className="text-xs" value="Motivo de saida da outra empresa" />
                <TextInput sizing={'sm'} {...register('motivo')} type="text" placeholder="Motivo" />
            </div>
            <div className="">
                <Label className="text-xs" value="Possui Plano de Saude" />
                
                <Select sizing={'sm'} {...register('planodesaude')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                </Select>
            </div>
             <div className="col-span-2">
                <Label className="text-xs" value="Indicação" />
                <TextInput sizing={'sm'} {...register('indicacao')} type="text" placeholder="Indicação" />
            </div>

            <div className="">
                <Label className="text-xs" value="Possui Pet ?" />
                <Select sizing={'sm'} {...register('possuiPet')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Faria um plano pet ?" />
                <Select sizing={'sm'} {...register('planoPet')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NAO">NÃO</option>
                </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Previsão de Visita" />
                <Controller 
                    name="visita"
                    control={control}
                    render={({ field:{onChange,value} }) => (
                      <DatePicker selected={value}  onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt}  className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    )}
                  />
            </div>
           
        
        </div>
    )
}