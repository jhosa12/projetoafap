import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
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
import { DatePickerInput } from "@/components/DatePickerInput";

export const OSDadosFalecido = ()=>{
    const {control,register} = useFormContext<ObitoProps>()

    return(
        <Card className="bg-white border-gray-200 shadow-none ">
        <CardHeader>
          <CardTitle className="text-gray-900">Dados do Falecido</CardTitle>
          <CardDescription className="text-gray-600">Informações pessoais do falecido</CardDescription>
        </CardHeader>


        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="nome_falecido">Nome Completo *</Label>
            <Input
              id="nome_falecido"
             {...register('nome_falecido')}
              placeholder="Nome completo do falecido"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Controller
            control={control}
            name="data_nascimento"
            render={({field})=>(
          <DatePickerInput
          onChange={field.onChange}
          value={field.value}
          className="h-9"
          />
            )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Controller
            control={control}
            name="sexo"
            render={({field})=>
                <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
            }
            />
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado_civil">Estado Civil</Label>
            <Controller
            control={control}
            name="estado_civil"
            render={({field})=>
                <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="Casado">Casado(a)</SelectItem>
                <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
              </SelectContent>
            </Select>
            }
            />
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              id="profissao"
             {...register('profissao')}
              placeholder="Profissão do falecido"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              {...register('rg')}
              placeholder="00.000.000-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="religiao">Religião</Label>
            <Input
              id="religiao"
              {...register('religiao')}
              placeholder="Religião do falecido"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="naturalidade">Naturalidade</Label>
            <Input
              id="naturalidade"
              {...register('naturalidade')}
              placeholder="Cidade de nascimento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uf_naturalidade">UF Naturalidade</Label>
            <Input
              id="uf_naturalidade"
            {...register('uf_naturalidade')}
              placeholder="SP"
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome_pai">Nome do Pai</Label>
            <Input
              id="nome_pai"
             {...register('nome_pai')}
              placeholder="Nome completo do pai"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome_mae">Nome da Mãe</Label>
            <Input
              id="nome_mae"
             {...register('nome_mae')}
              placeholder="Nome completo da mãe"
            />
          </div>
        </CardContent>
      </Card>
    )
}