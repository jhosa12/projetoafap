import { useContext, useState } from "react"
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TabTitular } from "../../../tabs/admContrato/dadosAssociado/tabs/tabTitular";
import { TabContrato } from "../../../tabs/admContrato/dadosAssociado/tabs/tabContrato";
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { AssociadoProps } from "@/types/associado";
import { toast } from "sonner";
import { ErrorIndicator } from "@/components/errorIndicator";

interface ModalProps {
  openEdit: boolean
  setModalEdit: (open: boolean) => void
  dataForm:Partial<AssociadoProps>
}

export interface UseFormAssociadoProps{
  register:UseFormRegister<AssociadoProps>
  watch:UseFormWatch<AssociadoProps>
  trigger:UseFormTrigger<AssociadoProps>
  setValue:UseFormSetValue<AssociadoProps>
  control:Control<AssociadoProps,any>
}

export function ModalEditarDados({ openEdit,setModalEdit,dataForm }: ModalProps) {


  const { usuario,setarDadosAssociado,permissoes,dadosassociado} = useContext(AuthContext)
  const {register,handleSubmit,watch,setValue,trigger,control,formState:{errors}} = useForm<AssociadoProps>({
    defaultValues:{...dataForm,contrato:{...dataForm?.contrato,dt_adesao:dataForm.contrato?.dt_adesao ? new Date(new Date(dataForm.contrato?.dt_adesao).getUTCFullYear(),new Date(dataForm.contrato?.dt_adesao).getUTCMonth(),new Date(dataForm.contrato?.dt_adesao).getUTCDate(),new Date(dataForm.contrato?.dt_adesao).getUTCHours()) : undefined,
      data_vencimento:dataForm.contrato?.data_vencimento ? new Date(new Date(dataForm.contrato?.data_vencimento).getUTCFullYear(),new Date(dataForm.contrato?.data_vencimento).getUTCMonth(),new Date(dataForm.contrato?.data_vencimento).getUTCDate(),new Date(dataForm.contrato?.data_vencimento).getUTCHours()) : undefined,

      dt_carencia:dataForm.contrato?.dt_carencia ? new Date(new Date(dataForm.contrato?.dt_carencia).getUTCFullYear(),new Date(dataForm.contrato?.dt_carencia).getUTCMonth(),new Date(dataForm.contrato?.dt_carencia).getUTCDate(),new Date(dataForm.contrato?.dt_carencia).getUTCHours()) : undefined,


    },
  }
  })


  const handleAtualizarDados:SubmitHandler<AssociadoProps> = async(data)=>{
   
      const dataAtual = new Date();
      dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000);
         toast.promise(
            api.post('/atualizarAssociado',{
              id_global: data.id_global,
              nome: data.nome,
              cep: data.cep,
              cpfcnpj: data.cpfcnpj,
              endereco: data.endereco,
              bairro: data.bairro,
              numero:data.numero?Number(data.numero):undefined,
              cidade: data.cidade,
              uf: data.uf,
              guia_rua: data.guia_rua,
              email: data.email,
              data_nasc: data.data_nasc,
              celular1: data.celular1,
              celular2:data.celular2,
              telefone: data.telefone,
              edi_usu:usuario?.nome,
              edi_dh: dataAtual,
              profissao: data.profissao,
              sexo: data.sexo,
              contrato: data.contrato
            }),
            {
              error: 'Erro ao atualizar dados',
             loading: 'Realizando Alteração....',
              success:(response)=>{
                setarDadosAssociado({...dadosassociado,...response.data})
                return 'Alteração realizada com sucesso'}
            }
        )
     
 
  }


  return (
    <Dialog  open={openEdit} onOpenChange={setModalEdit}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Editar Dados</DialogTitle>
          <DialogDescription>
            Atualize as informações do titular e contrato.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAtualizarDados)} >
          <Tabs aria-modal defaultValue="titular" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="titular">Dados Titular</TabsTrigger>
              <TabsTrigger value="contrato">Dados Contrato</TabsTrigger>
            </TabsList>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="titular">
              <TabTitular
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="contrato">
              <TabContrato
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>
          </Tabs>

          <div className="flex w-full justify-end gap-4 mt-6">
            <ErrorIndicator errors={errors}/>
            <Button
              type="submit"
              disabled={!permissoes.includes("ADM1.1.1")}
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}