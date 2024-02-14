
import { MultiStep } from "../../components/multiStep";
import { Item } from "../../components/dadosTitular";
import { DadosPlano } from "../../components/dadosPlano";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import {FormEvent, useState} from 'react'
import { DadosDependentes } from "@/components/dadosDependentes";
import { IoIosClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { MdSaveAlt } from "react-icons/md";
import { ResumoCadastro } from "@/components/resumoCadastro";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";

export default function TesteLayout() {
    const {data,closeModa} = useContext(AuthContext)
 
  const [closePlano,setTestePlano]=useState(false)
   
   function testeFields(){

    setTestePlano(true)
    console.log(closePlano)
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
            cad_usu:"teste",
            cad_dh:new Date(),
            edi_usu:"teste",
            edi_dh:new Date(),
            profissao:"teste",
            sexo:'M',
            contrato:{id_plano:data.contrato?.id_plano?10:10,
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
            dependentes:data.arraydep
          
        }),
        {
          pending: `Efetuando`,
          success: `Cadastrado com sucesso`,
          error: `Erro ao efetuar Cadastrar`
         }
  
      )
    }catch(err){
      console.log(err)
      console.log(data.contrato)
      console.log(data.arraydep)
    }
  
     

   }

  const {steps,currentStepIndex,step,next,back} =MultiStep([
    <Item />,
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
             {currentStepIndex!==0 &&(<button type="button" onClick={back}><FaCircleArrowLeft style={{color:'#CA9629'}} size={30}/></button>)} 
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
  
