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
            defaultValues:item
        }
    )

    useEffect(()=>{
        reset(item)
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


                          <div className= "flex flex-row w-full justify-between mt-2">

                          {Object.keys(errors).length > 0 && (
  <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
    <ul className="list-disc pl-5 text-xs">
      {errors.nome && <li>Nome é obrigatório (aba Dados Pessoais)</li>}
      {errors.cpfcnpj && <li>CPF/CNPJ é obrigatório (aba Dados Pessoais)</li>}
      {errors.endereco && <li>Endereço é obrigatório (aba Dados Pessoais)</li>}
      {errors.bairro && <li>Bairro é obrigatório (aba Dados Pessoais)</li>}
     

      {/* Adicione aqui outros campos que quer rastrear */}
    </ul>
  </div>
)}

                        <Button size={'sm'} type="submit" variant={'outline'} >Salvar</Button>


                            </div> 
                          
                </form>

            </Modal.Body>
        </Modal>
    )
}