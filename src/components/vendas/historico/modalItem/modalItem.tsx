import { Modal, Tabs } from "flowbite-react";
import { LeadProps } from "../historico";
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { TabDadosPessoais } from "./dadosPessoais";
import { TabFormulario } from "./formulario";
import { TabPlano } from "./dadosPlano";
import { TabDependentes } from "./dependentes";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import { Button } from "@/components/ui/button";
import useApiPost from "@/hooks/useApiPost";
import { AssociadoProps, ContratoProps, DependentesProps } from "@/types/associado";
import {  ParcelaData } from "@/utils/gerarArrayMensal";
import { toast } from "sonner";
import { ErrorIndicator } from "@/components/errorIndicator";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";



interface DataProps{
    open:boolean,
    onClose:Function,
    item:Partial<LeadProps>,
    handleLoadLeads:()=>void
}

interface CadastroRequest {
    id_empresa:string,
    nome: string;
    cpfcnpj: string;
    rg:string;
    cep: string;
    endereco: string;
    bairro: string;
    numero: number;
    cidade: string;
    uf: string;
    guia_rua: string;
    email: string;
    data_nasc: Date;
    data_cadastro: Date;
    celular1: string;
    celular2: string;
    telefone: string;
    cad_usu: string;
    cad_dh: Date;
    edi_usu: string;
    edi_dh: Date;
    profissao: string;
    sexo: string;
    situacao:string;
    contrato: Partial<ContratoProps>;
    dependentes:Array<Partial<DependentesProps>>;
    mensalidades: Array<Partial<ParcelaData>>;
    empresa:string
}

export interface UseFormLeadProps{
  register:UseFormRegister<LeadProps>
  watch:UseFormWatch<LeadProps>
  trigger:UseFormTrigger<LeadProps>
  setValue:UseFormSetValue<LeadProps>
  control:Control<LeadProps,any>
}


export function ModalItem({onClose,open,item,handleLoadLeads}:DataProps) {

    const {cidades,planos} = useContext(AuthContext)


    const {register,control,setValue,handleSubmit,trigger,watch,reset,  formState: { errors }} = useForm<LeadProps>(
        {
            defaultValues:{...item,adesao:item.data}
        }
    )

    useEffect(()=>{
        reset({...item,adesao:item.data})
    },[item])






    const handleOnSubmit:SubmitHandler<LeadProps> = async(data) =>{
 

        toast.promise(
                    api.put("/lead/editarLead",{lead:data}),
                    {
                        loading:"Editando Lead",
                        success:()=>{
                            handleLoadLeads()
                            onClose()
                            
                            return "Lead editado com sucesso"},
                        error:"Erro ao editar lead"
                    }
                )
               
           
    }



    return(
        <Dialog  open={open} onOpenChange={()=>onClose()}>


            <DialogContent className="sm:max-w-5xl ">
                <DialogHeader/>
         
         
            
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


                          <div className= "flex flex-row w-full justify-between mt-2">

   {<ErrorIndicator errors={errors} />}

                        <Button size={'sm'} type="submit" variant={'outline'} >Salvar</Button>


                            </div> 
                          
                </form>

                   </DialogContent>

            
        </Dialog>
    )
}