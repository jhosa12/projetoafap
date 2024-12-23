import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { Button, Modal,  Tabs } from "flowbite-react";
import { TabTitular } from "./tabTitular";
import { TabContrato } from "./tabContrato";
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { AssociadoProps } from "@/types/associado";

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
  const [modalInativar,setmodalInat]= useState<boolean>(false)
  const {register,handleSubmit,watch,setValue,trigger,control} = useForm<AssociadoProps>({
    defaultValues:{...dataForm,contrato:{...dataForm?.contrato,dt_adesao:dataForm.contrato?.dt_adesao ? new Date(new Date(dataForm.contrato?.dt_adesao).getUTCFullYear(),new Date(dataForm.contrato?.dt_adesao).getUTCMonth(),new Date(dataForm.contrato?.dt_adesao).getUTCDate(),new Date(dataForm.contrato?.dt_adesao).getUTCHours()) : undefined,
      data_vencimento:dataForm.contrato?.data_vencimento ? new Date(new Date(dataForm.contrato?.data_vencimento).getUTCFullYear(),new Date(dataForm.contrato?.data_vencimento).getUTCMonth(),new Date(dataForm.contrato?.data_vencimento).getUTCDate(),new Date(dataForm.contrato?.data_vencimento).getUTCHours()) : undefined,

      dt_carencia:dataForm.contrato?.dt_carencia ? new Date(new Date(dataForm.contrato?.dt_carencia).getUTCFullYear(),new Date(dataForm.contrato?.dt_carencia).getUTCMonth(),new Date(dataForm.contrato?.dt_carencia).getUTCDate(),new Date(dataForm.contrato?.dt_carencia).getUTCHours()) : undefined,


    },
  }
  })




  



  const handleAtualizarDados:SubmitHandler<AssociadoProps> = async(data)=>{
    try {
        const response = await toast.promise(
            api.put('/atualizarAssociado',{
              ...data,
              data_cadastro:undefined,
              cad_dh: undefined,
              edi_usu:usuario?.nome,
              edi_dh: new Date(),

            }),
            {
              error: 'Erro ao Atualizar Dados',
              pending: 'Realizando Alteração....',
              success: 'Alteração realizada com sucesso'
            }
        )
        setarDadosAssociado({...dadosassociado,...response.data})
    } catch (error) {
      
    }
  }




  return (


    

       <Modal dismissible size={'4xl'} show onClose={()=>setModalEdit(false)}  popup>
        <Modal.Header/>
        
        <Modal.Body>
          
           <form onSubmit={handleSubmit(handleAtualizarDados)}>
        <Tabs  theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-100 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
        <Tabs.Item active title="Dados Titular" >

          <TabTitular control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/>
          
        </Tabs.Item>
        <Tabs.Item title="Dados Contrato" >

       <TabContrato control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/> 
       
        </Tabs.Item>
    
      
      
      </Tabs>
  
              
          <div className="inline-flex w-full justify-end p-2 gap-4">
        
         
            <Button type="submit" disabled={!permissoes.includes('ADM1.1.1')} >Salvar</Button>

          </div>
          </form>
          </Modal.Body>


       
          </Modal>

  )
}