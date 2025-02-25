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
  const {register,handleSubmit,watch,setValue,trigger,control} = useForm<AssociadoProps>({
    defaultValues:{...dataForm,contrato:{...dataForm?.contrato,dt_adesao:dataForm.contrato?.dt_adesao ? new Date(new Date(dataForm.contrato?.dt_adesao).getUTCFullYear(),new Date(dataForm.contrato?.dt_adesao).getUTCMonth(),new Date(dataForm.contrato?.dt_adesao).getUTCDate(),new Date(dataForm.contrato?.dt_adesao).getUTCHours()) : undefined,
      data_vencimento:dataForm.contrato?.data_vencimento ? new Date(new Date(dataForm.contrato?.data_vencimento).getUTCFullYear(),new Date(dataForm.contrato?.data_vencimento).getUTCMonth(),new Date(dataForm.contrato?.data_vencimento).getUTCDate(),new Date(dataForm.contrato?.data_vencimento).getUTCHours()) : undefined,

      dt_carencia:dataForm.contrato?.dt_carencia ? new Date(new Date(dataForm.contrato?.dt_carencia).getUTCFullYear(),new Date(dataForm.contrato?.dt_carencia).getUTCMonth(),new Date(dataForm.contrato?.dt_carencia).getUTCDate(),new Date(dataForm.contrato?.dt_carencia).getUTCHours()) : undefined,


    },
  }
  })




  



  const handleAtualizarDados:SubmitHandler<AssociadoProps> = async(data)=>{
    try {
      const dataAtual = new Date();
      dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000);
        const response = await toast.promise(
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
              pending: 'Realizando Alteração....',
              success: 'Alteração realizada com sucesso'
            }
        )
        setarDadosAssociado({...dadosassociado,...response.data})
    } catch (error) {
      console.log(error)
    }
  }




  return (


    

       <Modal dismissible size={'5xl'} show={openEdit} onClose={()=>setModalEdit(false)}  popup>
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