"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ObitoProps } from "../../../../_types/obito"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { OSDadosGerais } from "./dados-gerais"
import { OSDadosFalecido } from "./dados-falecido"
import { OSDadosEndereco } from "./dados-endereco"
import { OSDadosDeclarante } from "./dados-declarante"
import { OSDadosServicos } from "./dados-servicos"
import { ErrorIndicator } from "@/components/errorIndicator"
import { OSDadosFinanceiros } from "./dados-financeiros"
import { useEffect } from "react"




interface ObitoFormProps {
  obito?: ObitoProps | null
  onSave: (data: Partial<ObitoProps>) => void
  onCancel: () => void
}

export function ObitoForm({ obito, onSave, onCancel }: ObitoFormProps) {

const form = useForm<ObitoProps>()


  useEffect(() => {
    if (obito) {
      form.reset(obito)
    }
  }, [obito])

  

 

  const handleOnSubmit:SubmitHandler<ObitoProps> = (data) => {

    onSave(data)
  }

  return (
    <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
      <Tabs defaultValue="dados-gerais" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
          <TabsTrigger value="falecido">Falecido</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="responsavel">Responsável</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="dados-gerais" className="space-y-4">
        <OSDadosGerais/>
        </TabsContent>

        <TabsContent value="falecido" className="space-y-4">
     <OSDadosFalecido/>
        </TabsContent>

        <TabsContent value="endereco" className="space-y-4">
      <OSDadosEndereco/>
        </TabsContent>

        <TabsContent value="responsavel" className="space-y-4">
         <OSDadosDeclarante/>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-4">
         <OSDadosServicos/>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
         <OSDadosFinanceiros/>
        </TabsContent>
      </Tabs>

      <Separator />
      <ErrorIndicator errors={form.formState.errors}/>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{obito ? "Atualizar" : "Salvar"} Óbito</Button>
      </div>
    </form>
    </FormProvider>
  )
}
