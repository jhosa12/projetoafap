
import { MultiStep } from "../../components/multiStep";
import { Item } from "../../components/dadosTitular";
import { DadosPlano } from "../../components/dadosPlano";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import {FormEvent, useEffect, useState} from 'react'
import { DadosDependentes } from "@/components/dadosDependentes";
import { IoIosClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { MdSaveAlt } from "react-icons/md";
import { ResumoCadastro } from "@/components/resumoCadastro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";


interface ParcelaData {
  parcela_n: number;
  vencimento: Date;
  cobranca: Date;
  valor_principal: number;
  status: string;
  referencia: string;
}

interface CidadesProps  {
  id_cidade: number,
  estado: number,
  uf: string,
  cidade: string
}

interface TitularProps{
  name:string,
  nasc:Date,
  sexo:string,
  cep:string,
  endereco:string,
  numero:number,
  bairro:string,
  profissao:string,
  referencia:string,
  uf:string,
  cidade:string,
  rg:string,
  cpf:string,
  naturalidade:string,
  email:string,
  celular1:string,
  celular2:string,
  telefone:string,
  cidades:Array<Partial<CidadesProps>>
}
interface DadosProps{
  titular:Partial<TitularProps>
}


export default function TesteLayout({titular}:Partial<DadosProps>) {
    const {usuario,data,closeModa,carregarDados} = useContext(AuthContext)
    const [mounted,setMounted] = useState(false)
    const [dadosTitular,setDados] = useState<Partial<TitularProps>>({})

    const setarDadosTitular =(fields:Partial<TitularProps>)=>{
      setDados((prev:Partial<TitularProps>)=>{
        if(prev){
          return {...prev,...fields}
        }else return{...fields}

      })

    }
 
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
            nome:dadosTitular.name,
            cep:dadosTitular.cep,
            endereco:dadosTitular.endereco,
            bairro:dadosTitular.bairro,
            numero:dadosTitular.numero,
            cidade:dadosTitular.cidade,
            uf:dadosTitular.uf,
            guia_rua:dadosTitular.referencia,
            email:dadosTitular.email,
            dadosTitular_nasc:dadosTitular.nasc && new Date(dadosTitular.nasc),
            dadosTitular_cadastro:new Date(),
            celular1:dadosTitular.celular1,
            celular2:dadosTitular.celular2,
            telefone:dadosTitular.telefone,
            cad_usu:usuario?.nome,
            cad_dh:new Date(),
            edi_usu:usuario?.nome,
            edi_dh:new Date(),
            profissao:dadosTitular.profissao,
            sexo:dadosTitular.sexo,
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
    setarDadosTitular({...titular})
    mounted && carregarDados()
    setMounted(true)
   },[data.id_associado])

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <Item dadosTitular={dadosTitular} setarDados={setarDadosTitular}  />,
    <DadosPlano />,
    <DadosDependentes />,
    <ResumoCadastro/>
  ])
  function onSubmit(e:FormEvent){
    e.preventDefault()
    next()
  }
  return ( 
     
            <div  tabIndex={-1} aria-hidden="true" className="bg-opacity-5 bg-white overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full">
          <div className="pl-2 pr-2 flex flex-col items-center justify-center w-full h-full ">
          <div className="relative  border  rounded-lg shadow bg-gray-800 border-gray-600 p-2">
          <form onSubmit={onSubmit}>
            <div className="absolute font-bold text-white top-2 right-2">
              {currentStepIndex + 1} / {steps.length}
              <button onClick={()=>closeModa({...data,closeModalCadastro:false})} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30}/>
                  </button>
            </div>
            {step}
            <div className="flex mt-4 gap-4 justify-end">
             {currentStepIndex!==0 &&(<button type="button" onClick={back}><FaCircleArrowLeft color='blue' style={{color:'#CA9629'}} size={30}/></button>)} 
              <button type="submit">
               {steps.length-1===currentStepIndex ?(<button onClick={save} className="flex flex-row bg-blue-600 rounded-lg p-2 gap-2 text-white" type="button" ><MdSaveAlt size={22}/> SALVAR</button>):(<FaCircleArrowRight size={30} style={{color:'#CA9629'}}/>)} 
                </button>
            </div>
          </form>
          </div>
          </div>
        </div>
     

        )
  } 
  
