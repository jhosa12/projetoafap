"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ObitoProps } from "../../../../_types/obito";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OSDadosFalecido } from "./dados-falecido";
import { OSDadosEndereco } from "./dados-endereco";
import { OSDadosDeclarante } from "./dados-declarante";
import { OSDadosServicos } from "./dados-servicos";
import { ErrorIndicator } from "@/components/errorIndicator";
import { OSDadosFinanceiros } from "./dados-financeiros";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { HeadAssociado } from "../head-associado";
import { ProdutosProps } from "@/types/produtos";

interface ObitoFormProps {
  obito?: ObitoProps | null;
  onSave: SubmitHandler<ObitoProps>;
  onCancel: () => void;
  produtos:Array<ProdutosProps>
}

export function ObitoForm({ obito, onSave, onCancel,produtos }: ObitoFormProps) {
  const form = useForm<ObitoProps>({
    defaultValues: {
      nome_falecido: '',
      data_nascimento: undefined,
      falecido: '',
    }
  });
  const { dadosassociado, limparDados } = useContext(AuthContext)
  const isEditing = !!obito

  useEffect(() => {
    if (obito) {
     
      form.reset(obito);
      limparDados()
    }
  }, [obito]);


  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        {dadosassociado.id_global && (
          <HeadAssociado
            associado={dadosassociado.nome}
            convalescencia={dadosassociado.contrato?.convalescencia}
            id_contrato={dadosassociado.contrato?.id_contrato}
            plano={dadosassociado.contrato?.plano}
            situacao={dadosassociado.contrato?.situacao}
          />
        )}
        <Tabs defaultValue="responsavel" >
          <TabsList >
            {/* <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger> */}
            <TabsTrigger value="responsavel">Responsável</TabsTrigger>
            <TabsTrigger value="falecido">Falecido</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="dados-gerais" className="space-y-4">
            <OSDadosGerais />
          </TabsContent> */}
          <TabsContent value="responsavel" >
            <OSDadosDeclarante />
          </TabsContent>
          <TabsContent
            value="falecido">
            <OSDadosFalecido
              isEditing={isEditing} />
          </TabsContent>

          <TabsContent value="endereco" >
            <OSDadosEndereco />
          </TabsContent>

          <TabsContent value="servicos" >
            <OSDadosServicos />
          </TabsContent>

          <TabsContent value="financeiro" >
            <OSDadosFinanceiros produtos={produtos} />
          </TabsContent>
        </Tabs>

        <Separator />
        <ErrorIndicator errors={form.formState.errors} />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{obito?.id_obitos ? "Atualizar" : "Salvar"} Óbito</Button>
        </div>
      </form>
    </FormProvider>
  );
}
