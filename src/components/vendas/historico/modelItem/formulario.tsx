
import { Label, Select, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";



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
                <TextInput sizing={'sm'} {...register('servicosUsados')} type="text" placeholder="Serviços usados na outra empresa" required/>
            </div>
            <div className="">
                <Label className="text-xs" value="Motivo de saida da outra empresa" />
                <TextInput sizing={'sm'} {...register('motivo')} type="text" placeholder="Motivo" required/>
            </div>
            <div className="">
                <Label className="text-xs" value="Possui Plano de Saude" />
                
                <Select sizing={'sm'} {...register('planodesaude')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NÃO">NÃO</option>
                </Select>
            </div>
             <div className="">
                <Label className="text-xs" value="Indicação" />
                <TextInput sizing={'sm'} {...register('indicacao')} type="text" placeholder="Indicação" required/>
            </div>

            <div className="">
                <Label className="text-xs" value="Possui Pet ?" />
                <Select sizing={'sm'} {...register('possuiPet')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NÃO">NÃO</option>
                </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Faria um plano pet ?" />
                <Select sizing={'sm'} {...register('planoPet')} >
                    <option value=""></option>
                    <option value="SIM">SIM</option>
                    <option value="NÃO">NÃO</option>
                </Select>
            </div>
            <div className="">
                <Label className="text-xs" value="Previsão de Visita" />
                <TextInput sizing={'sm'} {...register('visita')} type="text" placeholder="Previsão de Visita" required/>
            </div>
           
        
        </div>
    )
}