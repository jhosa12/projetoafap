


import { Label, Select, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { PlanosProps } from "@/types/planos";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Controller } from "react-hook-form";
interface TabPlanoProps extends UseFormLeadProps{planos:Array<PlanosProps>}



export function TabPlano({control,register,setValue,trigger,watch,planos}:TabPlanoProps) {


    return(
        <div className="grid grid-cols-4 gap-2">
            <div className="">
                <Label className="text-xs" value="Categoria de Plano" />
               <Select sizing={'sm'} onChange={(e) => {
                const plano = planos.find((plano) => plano.id_plano === Number(e.target.value));

                if(plano) {
                setValue('id_plano', Number(e.target.value))
                setValue('plano', plano.descricao)
                setValue('valor_mensalidade', plano.valor)
                }
                }}>
                {planos.map((plano) => (
                    <option key={plano.id_plano} value={plano.id_plano}>{plano.descricao}</option>
                ))}
               </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Origem de Plano" />
                <Select sizing={'sm'} {...register('origem')}>
                    <option value=""></option>
                    <option value='PLANO NOVO'>PLANO NOVO</option>
                    <option value='TRANSFERENCIA'>TRANSFERENCIA</option>
                </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Valor Mensalidade" />
                <TextInput sizing={'sm'} {...register('valor_mensalidade')} type="text" placeholder="Valor" />
            </div>
            <div className="">
                <Label className="text-xs" value="Vencimento Plano" />
                <Controller 
                    name="vencimento"
                    control={control}
                    render={({ field:{onChange,value} }) => (
                      <DatePicker selected={value}  onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt}  className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                    )}
                  />
            </div>
        
        </div>
    )
}