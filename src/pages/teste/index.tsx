
import { MultiStep } from "../../components/multiStep";
import { Item } from "../../components/dadosTitular";
import { DadosPlano } from "../../components/dadosPlano";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import {FormEvent, useEffect, useState} from 'react'
import { DadosDependentes } from "@/components/dadosDependentes";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { MdSaveAlt } from "react-icons/md";
import { ResumoCadastro } from "@/components/resumoCadastro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Modal } from "flowbite-react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { HiInboxIn } from "react-icons/hi";


interface ParcelaData {
  parcela_n: number;
  vencimento: Date;
  cobranca: Date;
  valor_principal: number;
  status: string;
  referencia: string;
}





export default function TesteLayout() {
    const {usuario,data,closeModa,carregarDados} = useContext(AuthContext)
    const [mounted,setMounted] = useState(false)
  
 
   function gerarMensalidade(){
    const mensalidades : Array<ParcelaData> = []
    let currentDate = new Date(data.contrato?.data_vencimento?data.contrato.data_vencimento:'');
    for (let i = 0;i<Number(data.contrato?.n_parcelas);i++){
      const dataMensalidade: ParcelaData = {
        parcela_n: i + 1,
        vencimento: new Date(currentDate), // Copia da data atual
        cobranca: new Date(currentDate), // Copia da data atual
        valor_principal:Number(data.contrato?.valor_mensalidade),
        status:'A',
        referencia: `${String(new Date(currentDate).getMonth()+1).padStart(2,'0')}/${new Date(currentDate).getFullYear()%100}`
    };
    mensalidades.push(dataMensalidade);
    
    // Aumenta um mês para a próxima iteração
    currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return mensalidades
   }

  async function save(){
    try{
      const response = await toast.promise(
        api.post('/novoAssociado',{
            nome:data.name,
            cep:data.cep,
            endereco:data.endereco,
            bairro:data.bairro,
            numero:data.numero,
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
              n_parcelas:data.contrato?.n_parcelas,
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
      
      closeModa({id_associado:response.data.novoassociado.id_associado,contrato:{...data.contrato,id_contrato:response.data.novoContrato.id_contrato}})
     
    }catch(err){
      console.log(err)
    }
  
   
    
   }
   useEffect(()=>{
    //setarDadosTitular({...titular})
    mounted && carregarDados()
    setMounted(true)
   },[data.id_associado])

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <Item  />,
    <DadosPlano />,
    <DadosDependentes />,
    <ResumoCadastro/>
  ])
  function onSubmit(e:FormEvent){
    e.preventDefault()
    next()
  }
  return ( 
     
        <Modal
          show={data.closeModalCadastro}
          position={'center'}
          onClose={()=>closeModa({closeModalCadastro:false})}
          size={'5xl'}
         //dismissible
        >
          <Modal.Header>Cadastro de Contrato</Modal.Header>
          <Modal.Body>
          <form onSubmit={onSubmit}>
            {step}
            <div className="flex mt-4 gap-8 p-2 justify-end">
             {currentStepIndex!==0 &&(<button className="bg-blue-600 p-2 rounded-lg justify-center items-center" type="button" onClick={back}><HiOutlineChevronLeft color="white" size={25}/></button>)} 
          
               {steps.length-1===currentStepIndex ?(<button onClick={save} className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="button" ><HiInboxIn size={22}/> SALVAR</button>):
               
               
               <button  className="bg-blue-600 p-2 rounded-lg justify-center items-center" type="submit"><HiOutlineChevronRight color="white" size={25}/></button>} 
             
            </div>
          </form>
          </Modal.Body>
          </Modal>

        )
  } 
  
