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

export const OSDadosDeclarante =()=>{
const {register,control} = useFormContext<ObitoProps>()


    return(

        <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Responsável</CardTitle>
          <CardDescription className="text-gray-600">Informações do responsável pelo óbito</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Input
              id="rd_parentesco"
              {...register('rd_parentesco')}
              placeholder="Filho, cônjuge, etc."
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