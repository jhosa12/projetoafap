'use client'
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { TabDadosPessoais } from "./dadosPessoais";
import { TabFormulario } from "./formulario";
import { TabPlano } from "./dadosPlano";
import { TabDependentes } from "./dependentes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { ErrorIndicator } from "@/components/errorIndicator";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { DialogTitle } from "@radix-ui/react-dialog";
import { LeadProps } from "../../../_types/types";
import { removerFusoDate } from "@/utils/removerFusoDate";


interface DataProps {
  open: boolean,
  onClose: Function,
  item: Partial<LeadProps>,
  handleLoadLeads: () => void,
  handleGerarContrato: SubmitHandler<LeadProps>
}



export interface UseFormLeadProps {
  register: UseFormRegister<LeadProps>
  watch: UseFormWatch<LeadProps>
  trigger: UseFormTrigger<LeadProps>
  setValue: UseFormSetValue<LeadProps>
  control: Control<LeadProps, any>
}


export function ModalItem({ onClose, open, item, handleLoadLeads, handleGerarContrato }: DataProps) {

  const { cidades, planos, consultores,infoEmpresa } = useContext(AuthContext)
  const [planoExistente, setPlanoExistente] = useState()
  const cobradores = consultores.filter(item => item.funcao === 'COBRADOR (RDA)').map(item => item.nome)
  const { register, control, setValue, handleSubmit, trigger, watch, reset, formState: { errors }, getValues } = useForm<LeadProps>(
    {
      defaultValues: { ...item, adesao: item.dataVenda }
    }
  )


  const cidadeCE = cidades.filter(item => item.uf === 'CE')



    const handleOnSubmit: SubmitHandler<LeadProps> = async (data) => {
      data.id_lead ? handleEdit(data):handleCadastro(data)
    }






      const handleCadastro = async (data:LeadProps) => {
        const {newDate} =  removerFusoDate(new Date())
    toast.promise(
      api.post("/lead/novoLead", { ...data,id_empresa:infoEmpresa?.id,data:newDate }),
      {
        loading: "Cadastrando Lead",
        success: async() => {
          handleLoadLeads()
          onClose()

          return "Lead Cadastrado com sucesso"
        },
        error: "Erro ao cadastrar lead"
      }
    )


  }




  const handleEdit = async (data:LeadProps) => {


    toast.promise(
      api.put("/lead/editarLead", { lead: data }),
      {
        loading: "Editando Lead",
        success: async() => {
          handleLoadLeads()
          onClose()

          return "Lead editado com sucesso"
        },
        error: "Erro ao editar lead"
      }
    )


  }

  useEffect(() => {
    VerificarExistenciaPlano()
  }, [item.id_lead,watch('cpfcnpj')])


  const VerificarExistenciaPlano = async() => {

  const cpf = watch('cpfcnpj').replace(/\D/g, '');
 
  // Verifica se tem 11 dígitos
   if (cpf.length !== 11) return;
      try {

        const response = await api.post("/associado/verificarExistencia", {
        id_empresa: infoEmpresa?.id,
        cpfcnpj:watch('cpfcnpj')
        })
        setPlanoExistente(undefined)
      } catch (error: any) {
        setPlanoExistente(error.response.data.error)
        toast.error(error.response.data.error)
      }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>


      <DialogContent className="sm:max-w-5xl ">
        <DialogHeader>
          <DialogTitle>Administrar Cadastro</DialogTitle>
          <DialogDescription>Altere dados ou gere um novo plano de assocciado</DialogDescription>
        </DialogHeader>
        
        {planoExistente && (
          <div className="bg-red-50 border-l-4 border-red-500 p-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {planoExistente}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Tabs aria-modal defaultValue="dados-pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="formulario">Formulário</TabsTrigger>
              <TabsTrigger value="plano">Plano</TabsTrigger>
              <TabsTrigger value="dependentes">Dependentes</TabsTrigger>
            </TabsList>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col" value="dados-pessoais">
              <TabDadosPessoais
                cidades={cidadeCE}
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col" value="formulario">
              <TabFormulario
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col" value="plano">
              <TabPlano
                cobradores={cobradores}
                planos={planos}
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>

            <TabsContent forceMount className="hidden data-[state=active]:flex flex-col" value="dependentes">
              <TabDependentes
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-row w-full justify-between mt-4">
            <ErrorIndicator errors={errors} />
            <div className="ml-auto flex gap-3">
              {item.status === 'VENDA' && <Button
                type="button"
                size="default"
                variant="outline"
                onClick={() => handleGerarContrato(watch())}
              >
                <FileText />
                Gerar Contrato
              </Button>}

              <Button
                type="submit"
                size="default"
              >
                <Save />
                Salvar
              </Button>

            </div>
          </div>
        </form>

      </DialogContent>


    </Dialog>
  )
}