import { Modal, Tabs } from "flowbite-react"
import { TabInformacoes } from "./tabInformacoes"
import { roboto_Mono } from "@/fonts/fonts"
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { EmpresaProps } from "@/types/empresa"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"
import { api } from "@/services/apiClient"
import { toast } from "react-toastify"


export interface FormEmpresaProps{
    register:UseFormRegister<EmpresaProps>,
    watch:UseFormWatch<EmpresaProps>
    control:Control<EmpresaProps,any>
    setValue:UseFormSetValue<EmpresaProps>
}

interface DataProps{
    open:boolean
    onClose:Function
    empresa:Partial<EmpresaProps>
}

export function ModalEmpresa({open,onClose,empresa}:DataProps) {
    const {register,watch,control,setValue,handleSubmit} = useForm<EmpresaProps>({
        defaultValues:empresa
    })


    const handleEditarEmpresa:SubmitHandler<EmpresaProps> = async(data)=>{
        console.log(data)
        const formData = new FormData();
        formData.append('id',data.id);
        formData.append('nome',data.nome);
        formData.append('cnpj',data.cnpj);
        formData.append('celular',data.celular);
        formData.append('email',data.email);
        formData.append('endereco',data.endereco);
        formData.append('celular2',data.celular2);
        formData.append('site',data.site);
        formData.append('fantasia',data.fantasia);
        formData.append('fone',data.fone);
        formData.append('local_pagamento',data.local_pagamento);
        formData.append('cidade_uf',data.cidade_uf);
        formData.append('dias_carencia',String(data.dias_carencia));
        formData.append('email_come',data.email_come);
        formData.append('ins_estadual',data.ins_estadual);
        formData.append('validade_carteira',String(data.validade_carteira));
        formData.append('instrucoes_carne',data.instrucoes_carne);

        if(data.logo){
            formData.append('file',data.logo);
        }

        try {

            console.log(formData)
            const handleedit = await toast.promise(
                api.post('/empresa/editarEmpresa',formData),
                {
                    pending:'Editando Empresa',
                    success:'Empresa Editada com sucesso',
                    error:'Erro ao Editar Empresa'
                }
            )
        } catch (error) {
            console.log(error)
            toast.error('Erro ao Editar Empresa')
        }
   

    }





    return (
        <Modal  show={open} size="7xl" onClose={() => onClose()} >
      
            <Modal.Body>
            <form onSubmit={handleSubmit(handleEditarEmpresa)}>
            <Tabs  theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-300 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
                                        <Tabs.Item active title="Informações da Empresa" >
                                            <TabInformacoes watch={watch} control={control} register={register} setValue={setValue} empresa={empresa}/>
                                        </Tabs.Item>
                                      
                                        <Tabs.Item title="Configurações" >
                                   
                                        </Tabs.Item>
            
                                        <Tabs.Item   title="Imagens" >
                                        
                                        </Tabs.Item>
            
                            
                                      </Tabs> 

                                    <div className="flex w-full justify-end gap-4">
                                    <Button variant={'outline'} type="submit" >Salvar</Button>
                                    <Button onClick={()=>onClose()} variant={'outline'} type="button" >Fechar</Button>
                                    </div>
                                    
            </form>
            </Modal.Body>
           

        </Modal>
    )


}