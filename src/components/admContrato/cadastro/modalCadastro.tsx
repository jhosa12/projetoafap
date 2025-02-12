

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { ResumoCadastro } from "@/components/admContrato/cadastro/resumoCadastro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Modal } from "flowbite-react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { HiInboxIn } from "react-icons/hi";
import { Control, SubmitHandler, useForm, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";


import { MultiStep } from "@/utils/multiStep";
import { DadosCadastro } from '@/types/associado';
import { DadosTitular } from './dadosTitular';
import { DadosPlano } from './dadosPlano';
import { DadosDependentes } from './dadosDependentes';
import { Button } from "@/components/ui/button";


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
    control?:Control<DadosCadastro>
  }


interface ModalProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
  
  }


export default function ModalCadastro({isOpen,onClose}:ModalProps) {
    const {usuario,carregarDados,selectEmp} = useContext(AuthContext)
    const {register,handleSubmit,setValue,watch,trigger,control} = useForm<DadosCadastro>()

   
  
 
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
  const dataAtual = new Date();
  dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000);

  const dataNasc = new Date(data.nasc);
  dataNasc.setTime(dataNasc.getTime() - dataNasc.getTimezoneOffset() * 60 * 1000);


  let dataAdesao
  if(data.contrato?.dt_adesao){
    dataAdesao = new Date(data?.contrato?.dt_adesao);
    dataAdesao.setTime(dataAdesao.getTime() - dataAdesao.getTimezoneOffset() * 60 * 1000);
  }

  let dataCarencia
  if(data.contrato?.dt_carencia){
    dataCarencia = new Date(data?.contrato?.dt_carencia);
    dataCarencia.setTime(dataCarencia.getTime() - dataCarencia.getTimezoneOffset() * 60 * 1000);
  }


    if(selectEmp === null){
        toast.warn('Selecione uma empresa')
        return
    }
    try{
      const response = await toast.promise(
        api.post('/novoAssociado',{
            id_empresa:selectEmp,
            nome:data.name.toUpperCase(),
            cep:data.cep,
            cpfcnpj:data.cpf,
            endereco:data.endereco,
            bairro:data.bairro,
            numero:Number(data.numero),
            cidade:data.cidade,
            uf:data.uf,
            guia_rua:data.referencia,
            email:data.email,
            data_nasc:data.nasc ? dataNasc:undefined,
            data_cadastro:dataAtual,
            celular1:data.celular1,
            celular2:data.celular2,
            telefone:data.telefone,
            cad_usu:usuario?.nome,
            cad_dh:dataAtual,
            rg:data.rg,
            profissao:data.profissao,
            sexo:data.sexo,
            contrato:{id_plano:data.contrato?.id_plano,
              plano:data.contrato?.plano,
              consultor:data.contrato?.consultor,
              situacao:"ATIVO",
              valor_mensalidade:data.contrato?.valor_mensalidade,
              dt_adesao:data.contrato?.dt_adesao?dataAdesao:dataAtual,
              cobrador:data.contrato?.cobrador,
              data_vencimento:data.contrato?.data_vencimento?new Date(data.contrato.data_vencimento):null,
              n_parcelas:Number(data.contrato?.n_parcelas),
              origem:data.contrato?.origem,
              carencia:"",
              dt_carencia:data.contrato?.dt_carencia?dataCarencia:null
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


      //console.log(response.data)
     setValue('contrato.id_contrato',response.data.id_contrato)
       carregarDados(response.data.id_global)

       onClose(false)
       
     // closeModa({id_associado:response.data.novoassociado.id_associado,contrato:{...data.contrato,id_contrato:response.data.novoContrato.id_contrato}})
     
    }catch(err){
      console.log(err)
      toast.error('Consulte o Administrador')
    }
  
   
    
   }

   
 

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <DadosTitular control={control} trigger={trigger} key={1} register={register} setValue={setValue} watch={watch} />,
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
             {currentStepIndex!==0 &&(<button className="bg-black p-2 rounded-lg justify-center items-center" type="button" onClick={back}><HiOutlineChevronLeft color="white" size={15}/></button>)} 
          
               {steps.length-1===currentStepIndex ?(<Button  type="submit" ><HiInboxIn size={22}/> SALVAR</Button>):
               <button  className="bg-black p-2 rounded-lg justify-center items-center" type="submit"><HiOutlineChevronRight color="white" size={15}/></button>} 
             
            </div>
          </form>
          </Modal.Body>
          </Modal>

        )
  } 
  
