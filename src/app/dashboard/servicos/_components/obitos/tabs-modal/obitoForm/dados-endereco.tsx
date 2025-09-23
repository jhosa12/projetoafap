
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



export const OSDadosEndereco = ()=>{
const {register,control} = useFormContext<ObitoProps>()



    return(
        <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Endereço e Contato</CardTitle>
          <CardDescription className="text-gray-600">Dados de endereço e contato</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <Label htmlFor="end_rua">Rua/Logradouro</Label>
            <Input
              id="end_rua"
              {...register('end_rua')}
              placeholder="Nome da rua"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_numero">Número</Label>
            <Input
              id="end_numero"
              {...register('end_numero')}
              placeholder="123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_bairro">Bairro</Label>
            <Input
              id="end_bairro"
             {...register('end_bairro')}
              placeholder="Nome do bairro"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_cidade">Cidade</Label>
            <Input
              id="end_cidade"
              {...register('end_cidade')}
              placeholder="Nome da cidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_uf">UF</Label>
            <Input
              id="end_uf"
            {...register('end_uf')}
              placeholder="SP"
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_telefone">Telefone</Label>
            <Input
              id="end_telefone"
              {...register('end_telefone')}
              placeholder="(11) 1234-5678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_celular">Celular</Label>
            <Input
              id="end_celular"
             {...register('end_celular')}
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>
    )
}