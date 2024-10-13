


import { useEffect, useState} from 'react'

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { ResumoCadastro } from "@/components/resumoCadastro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Modal } from "flowbite-react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { HiInboxIn } from "react-icons/hi";
import { SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";


import { MultiStep } from "@/components/multiStep";
import { DadosCadastro } from '@/types/associado';
import { DadosTitular } from './dadosTitular';
import { DadosPlano } from './dadosPlano';
import { DadosDependentes } from './dadosDependentes';


interface ParcelaData {
  parcela_n: number;
  vencimento: Date;
  cobranca: Date;
  valor_principal: number;
  status: string;
  referencia: string;
}

export interface ChildrenProps{
    register:UseFormRegister<DadosCadastro>,
    setValue:UseFormSetValue<DadosCadastro>,
    watch:UseFormWatch<DadosCadastro>
    trigger:UseFormTrigger<DadosCadastro>
  }


interface ModalProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
  
  }


export default function ModalCadastro({isOpen,onClose}:ModalProps) {
    const {usuario,carregarDados} = useContext(AuthContext)
    const {register,handleSubmit,setValue,watch,trigger,reset} = useForm<DadosCadastro>()

   
  
 
   function gerarMensalidade(){
    const mensalidades : Array<ParcelaData> = []
    let currentDate = new Date(watch('contrato.data_vencimento')??new Date());
    for (let i = 0;i<Number(watch('contrato.n_parcelas'));i++){
      const dataMensalidade: ParcelaData = {
        parcela_n: i + 1,
        vencimento: new Date(currentDate), // Copia da data atual
        cobranca: new Date(currentDate), // Copia da data atual
        valor_principal:Number(watch('contrato.valor_mensalidade')),
        status:'A',
        referencia: `${String(new Date(currentDate).getMonth()+1).padStart(2,'0')}/${new Date(currentDate).getFullYear()%100}`
    };
    mensalidades.push(dataMensalidade);
    
    // Aumenta um mês para a próxima iteração
    currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return mensalidades
   }

 const handleSave = async(data:DadosCadastro)=>{

    if(!watch('id_empresa')){
        toast.warn('Selecione uma empresa')
        return
    }
    try{
      const response = await toast.promise(
        api.post('/novoAssociado',{
            id_empresa:data.id_empresa,
            nome:data.name.toUpperCase(),
            cep:data.cep,
            endereco:data.endereco,
            bairro:data.bairro,
            numero:Number(data.numero),
            cidade:data.cidade,
            uf:data.uf,
            guia_rua:data.referencia,
            email:data.email,
            data_nasc:data.nasc && new Date(data.nasc),
            data_cadastro:new Date(),
            celular1:data.celular1,
            celular2:data.celular2,
            telefone:data.telefone,
            cad_usu:usuario?.nome,
            cad_dh:new Date(),
            edi_usu:usuario?.nome,
            edi_dh:new Date(),
            profissao:data.profissao,
            sexo:data.sexo,
            contrato:{id_plano:data.contrato?.id_plano,
              plano:data.contrato?.plano,
              consultor:data.contrato?.consultor,
              situacao:"ATIVO",
              valor_mensalidade:data.contrato?.valor_mensalidade,
              dt_adesao:data.contrato?.dt_adesao?new Date(data.contrato?.dt_adesao):new Date(),
              cobrador:data.contrato?.cobrador,
              data_vencimento:data.contrato?.data_vencimento?new Date(data.contrato.data_vencimento):null,
              n_parcelas:Number(data.contrato?.n_parcelas),
              origem:data.contrato?.origem,
              carencia:"",
              dt_carencia:data.contrato?.dt_carencia?new Date(data.contrato.dt_carencia):null
            },
            dependentes:data.arraydep,
            mensalidades:gerarMensalidade()
        }),
        {
          pending: `Efetuando`,
          success: `Cadastrado com sucesso`,
          error: `Erro ao efetuar Cadastro`
         }
      )


      console.log(response.data)
     setValue('contrato.id_contrato',response.data.id_contrato)
       carregarDados(response.data.id_global)
       
     // closeModa({id_associado:response.data.novoassociado.id_associado,contrato:{...data.contrato,id_contrato:response.data.novoContrato.id_contrato}})
     
    }catch(err){
      console.log(err)
    }
  
   
    
   }

   
 

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <DadosTitular trigger={trigger} key={1} register={register} setValue={setValue} watch={watch} />,
    <DadosPlano trigger={trigger} key={2} register={register} setValue={setValue} watch={watch}  />,
    <DadosDependentes key={3} trigger={trigger} register={register} setValue={setValue} watch={watch}  />,
    <ResumoCadastro key={4} trigger={trigger} register={register} setValue={setValue} watch={watch} />
  ])
  const onSubmit:SubmitHandler<DadosCadastro>=(data)=>{
    steps.length-1===currentStepIndex ? handleSave(data):next()
  }
  return ( 
     
        <Modal
          show={isOpen}
          position={'center'}
          onClose={()=>onClose(false)}
          size={'5xl'}
         //dismissible
        >
          <Modal.Header>Cadastro de Contrato</Modal.Header>
          <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step}
            <div className="flex mt-4 gap-8 p-2 justify-end">
             {currentStepIndex!==0 &&(<button className="bg-blue-600 p-2 rounded-lg justify-center items-center" type="button" onClick={back}><HiOutlineChevronLeft color="white" size={25}/></button>)} 
          
               {steps.length-1===currentStepIndex ?(<button  className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="submit" ><HiInboxIn size={22}/> SALVAR</button>):
               
               
               <button  className="bg-blue-600 p-2 rounded-lg justify-center items-center" type="submit"><HiOutlineChevronRight color="white" size={25}/></button>} 
             
            </div>
          </form>
          </Modal.Body>
          </Modal>

        )
  } 
  
