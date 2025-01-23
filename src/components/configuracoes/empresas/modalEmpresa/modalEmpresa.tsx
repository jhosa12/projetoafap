import { Button, Modal, Tabs } from "flowbite-react"
import { TabInformacoes } from "./tabInformacoes"
import { roboto_Mono } from "@/fonts/fonts"
import { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { EmpresaProps } from "@/types/empresa"


export interface FormEmpresaProps{
    register:UseFormRegister<EmpresaProps>,
    watch:UseFormWatch<EmpresaProps>
    control:Control<EmpresaProps,any>
    setValue:UseFormSetValue<EmpresaProps>
}

interface DataProps{
    open:boolean
    onClose:Function
}

export function ModalEmpresa({open,onClose}:DataProps) {
    return (
        <Modal className={roboto_Mono.className} show={open} size="7xl" onClose={() => onClose()} >
            <Modal.Header/>
            <Modal.Body>
            <form>
            <Tabs  theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-300 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
                                        <Tabs.Item active title="Informações da Empresa" >
                                            <TabInformacoes/>
                                        </Tabs.Item>
                                      
                                        <Tabs.Item title="Configurações" >
                                   
                                        </Tabs.Item>
            
                                        <Tabs.Item   title="Imagens" >
                                        
                                        </Tabs.Item>
            
                            
                                      </Tabs> 


                                      <Button className="ml-auto" type="submit" color="light">Salvar</Button>
            </form>
            </Modal.Body>
           

        </Modal>
    )


}