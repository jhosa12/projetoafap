import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { ObitoProps } from "@/app/dashboard/servicos/_types/obito";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parentescos } from "@/utils/arrayParentesco";

export const OSDadosDeclarante =()=>{
const {register,control} = useFormContext<ObitoProps>()


    return(

        <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Declarante</CardTitle>
          <CardDescription className="text-gray-600">Informações do declarante</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <Label htmlFor="rd_nome">Nome do Responsável</Label>
            <Input
              id="rd_nome"
             {...register('rd_nome')}
              placeholder="Nome completo do responsável"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rd_parentesco">Parentesco</Label>
            <Controller
            control={control}
            name="rd_parentesco"
            render={({field:{value,onChange}})=>(
              <Select value={value} onValueChange={onChange}>
              <SelectTrigger  >
                <SelectValue placeholder="Parentesco"/>
              </SelectTrigger>

              <SelectContent>
                {parentescos.map(item=>(
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>

            </Select>

            )}
            
            />
           
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="rd_endereco">Endereço</Label>
            <Input
              id="rd_endereco"
             {...register('rd_endereco')}
              placeholder="Endereço completo do responsável"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rd_telefone">Telefone</Label>
            <Input
              id="rd_telefone"
              {...register('rd_telefone')}
              placeholder="(11) 1234-5678"
            />
          </div>
        </CardContent>
      </Card>
    )
}