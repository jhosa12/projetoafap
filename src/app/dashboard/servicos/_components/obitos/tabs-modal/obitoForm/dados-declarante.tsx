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
import { parentescos } from "@/utils/arrayParentesco";
import { Combobox } from "@/components/ui/combobox";

export const OSDadosDeclarante =()=>{
const {register,control} = useFormContext<ObitoProps>()


    return(

        <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Declarante</CardTitle>
          <CardDescription className="text-gray-600">Informações do declarante</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
              <Combobox
                items={parentescos}
                onChange={onChange}
                value={value}
                modal={true}
              />
            //   <Select value={value} onValueChange={onChange}>
            //   <SelectTrigger  >
            //     <SelectValue  placeholder="Parentesco"/>
            //   </SelectTrigger>

            //   <SelectContent>
            //     {parentescos.map(item=>(
            //       <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            //     ))}
            //   </SelectContent>

            // </Select>

            )}
            
            />
           
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="rd_endereco">Endereço</Label>
            <Input
              id="rd_endereco"
             {...register('rd_endereco')}
              placeholder="Endereço completo do responsável"
            />
          </div>
            <div className="space-y-2 ">
            <Label htmlFor="rd_numero">Numero</Label>
            <Input
              id="rd_numero"
             {...register('rd_numero')}
              placeholder="Endereço completo do responsável"
            />
          </div>
    <div className="space-y-2 ">
            <Label htmlFor="rd_bairro">Bairro</Label>
            <Input
              id="rd_bairro"
             {...register('rd_bairro')}
              placeholder="Bairro"
            />
          </div>
              <div className="space-y-2 ">
            <Label htmlFor="rd_cidade">Cidade</Label>
            <Input
              id="rd_cidade"
             {...register('rd_cidade')}
              placeholder="Cidade"
            />
          </div>

            <div className="space-y-2 ">
            <Label htmlFor="rd_complemento">Complemento</Label>
            <Input
              id="rd_complemento"
             {...register('rd_complemento')}
              placeholder="Endereço completo do responsável"
            />
          </div>



           <div className="space-y-2">
            <Label htmlFor="cpf_cnpj">CPF</Label>
            <Input
              id="cpf_cnpj"
              {...register('cpf_cnpj')}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rd_rg"
              {...register('rd_rg')}
              placeholder="000.000.000-00"
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