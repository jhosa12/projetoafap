


import { Label, Select, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { PlanosProps } from "@/types/planos";

interface TabPlanoProps extends UseFormLeadProps{planos:Array<PlanosProps>}



export function TabPlano({control,register,setValue,trigger,watch,planos}:TabPlanoProps) {


    return(
        <div className="grid grid-cols-4 gap-2">
            <div className="">
                <Label className="text-xs" value="Categoria de Plano" />
               <Select sizing={'sm'} {...register('plano')}>
                {planos.map((plano) => (
                    <option key={plano.id_plano} value={plano.id_plano}>{plano.descricao}</option>
                ))}
               </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Origem de Plano" />
                <TextInput sizing={'sm'} {...register('origem')} type="text" placeholder="Origem" required/>
            </div>
            <div className="">
                <Label className="text-xs" value="Valor Mensalidade" />
                <TextInput sizing={'sm'} {...register('motivo')} type="text" placeholder="Motivo" required/>
            </div>
            <div className="">
                <Label className="text-xs" value="Vencimento Plano" />
                <TextInput sizing={'sm'} {...register('vencimento')} type="text" placeholder="Vencimento" required/>
            </div>
        
        </div>
    )
}