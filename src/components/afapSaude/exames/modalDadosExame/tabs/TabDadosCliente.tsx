import { TabsFormExameProps } from "./TabsExame";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { DatePickerInput } from "@/components/DatePickerInput";
import { Controller } from "react-hook-form";
import { PhoneMaskInput } from "@/components/PhoneMaskInput";
import { CPFInput } from "@/components/CpfMaskInput";
import { parentescos } from "@/utils/arrayParentesco";


export default function TabDadosClienteExame({control,register,watch}:TabsFormExameProps){
    return(
        <div className="grid grid-cols-4 gap-2 ">
            <div className="col-span-2">
              <Label className="text-xs" htmlFor="nome">
                Nome Paciente
              </Label>
              <Input
                id="nome"
                placeholder="Nome"
                required
                {...register("nome")}
              />
            </div>

            <div className="col-span-1 flex flex-col justify-end gap-1">
              <Label className="text-xs" htmlFor="nome">
                Nascimento
              </Label>
              <Controller
                control={control}
                name="data_nasc"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput dateFormat="dd/MM/yyyy" className="h-9" value={value} onChange={onChange} />
                )}
              />
           
            </div>
            
            <div>
              <Label className="text-xs" htmlFor="celular">
                Celular
              </Label>
           
                  <PhoneMaskInput controlName="celular" register={register} />
                
            
            </div>
            <div>
              <Label className="text-xs" htmlFor="cpf">
                CPF
              </Label>
              
                  <CPFInput  register={register} controlName="cpf" />
                
              
            </div>
            <div className="col-span-1">
              <Label className="text-xs" htmlFor="endereco">
                Endereço
              </Label>
              <Input
                id="endereco"
                required={watch("coleta") === "DOMICILIO"}
                placeholder="Endereço"
                {...register("endereco")}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs" htmlFor="numero">
                Número
              </Label>
              <Input
                id="numero"
                type="number"
                placeholder="Numero"
                {...register("numero", { valueAsNumber: true })}
              />
            </div>

            <div className="col-span-1">
              <Label className="text-xs" htmlFor="bairro">
                Bairro
              </Label>
              <Input
                id="bairro"
                placeholder="Bairro"
                {...register("bairro")}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs" htmlFor="responsavel">
                Nome Responsável (se for menor)
              </Label>
              <Input
                id="responsavel"
                placeholder="Responsável, caso paciente seja menor de idade"
                {...register("nome_responsavel")}
              />
            </div>
            <div>
              <Label className="text-xs" htmlFor="parentesco">
                Parentesco
              </Label>
              <Controller
                control={control}
                name="parentesco"
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="parentesco">
                      <SelectValue placeholder="PARENTESCO" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {parentescos.map((parentesco) => (
                        <SelectItem className='text-xs' key={parentesco.value} value={parentesco.value}>
                          {parentesco.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>


        </div>
    )
}