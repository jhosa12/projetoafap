import { Button,Modal, Tabs } from "flowbite-react";
import { LeadProps } from "../historico";
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { TabDadosPessoais } from "./dadosPessoais";
import { TabFormulario } from "./formulario";
import { TabPlano } from "./dadosPlano";
import { TabDependentes } from "./dependentes";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";


interface DataProps{
    open:boolean,
    onClose:Function,
    item:Partial<LeadProps>
}

export interface UseFormLeadProps{
  register:UseFormRegister<LeadProps>
  watch:UseFormWatch<LeadProps>
  trigger:UseFormTrigger<LeadProps>
  setValue:UseFormSetValue<LeadProps>
  control:Control<LeadProps,any>
}


export function ModalItem({onClose,open,item}:DataProps) {

    const {cidades,planos} = useContext(AuthContext)

    const {register,control,setValue,handleSubmit,trigger,watch,reset} = useForm<LeadProps>(
        {
            defaultValues:item
        }
    )

    useEffect(()=>{
        reset(item)
    },[item])

    const handleOnSubmit:SubmitHandler<LeadProps> = async(data) =>{

   
            try {
                const res = await toast.promise(
                    api.put("/lead/editarLead",{lead:data}),
                    {
                        pending:"Editando Lead",
                        success:"Lead editado com sucesso",
                        error:"Erro ao editar lead"
                    }
                )
            } catch (error) {
                console.log(error)
            }
    }



    return(
        <Modal size="5xl" popup show={open} onClose={()=>onClose()}>
          <Modal.Header />
            <Modal.Body>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                      <Tabs  theme={{tablist:{tabitem:{base:"flex z-0 items-center justify-center rounded-t-lg p-2 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 ",variant:{fullWidth:{active:{off:'bg-gray-50',on:'bg-gray-300 text-black'}}}}}}} aria-label="Full width tabs" variant="fullWidth">
                            <Tabs.Item active title="Dados Pessoais" >
                    
                              <TabDadosPessoais cidades={cidades} control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/>
                              
                            </Tabs.Item>
                          
                            <Tabs.Item title="Formulário" >
                            <TabFormulario control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/>
                            </Tabs.Item>

                            <Tabs.Item   title="Plano" >
                            <TabPlano planos={planos} control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/>
                            </Tabs.Item>

                            <Tabs.Item title="Dependentes" >
                                <TabDependentes control={control} register={register} setValue={setValue} watch={watch} trigger={trigger}/>
                            </Tabs.Item>
                        
                          
                          
                          </Tabs> 


                          <div className= "inline-flex w-full gap-2 items-end">

                          <Button className="ml-auto" >SALVAR</Button>

                        <Button type="submit" >SALVAR</Button>


                            </div> 
                          
                </form>
            </Modal.Body>
        </Modal>
    )
}