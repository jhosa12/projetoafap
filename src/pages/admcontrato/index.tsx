import { IoIosClose } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import {ModalBusca} from '../../components/modal'
import Teste from '@/pages/teste/index';
import React,{ useState,useContext, useEffect, useRef } from "react";
import { RiFileAddLine } from "react-icons/ri";
import {AuthContext, signOut} from "../../contexts/AuthContext"
import { toast } from "react-toastify";
import { ModalMensalidade } from "@/components/modalmensalidade";
import { RiAddCircleFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { api } from "@/services/apiClient";
import { TbAlertTriangle } from "react-icons/tb";
import { ModalDependentes } from "@/components/modalDependentes";
import { FaEdit } from "react-icons/fa";
import { ModalEditarDados } from "@/components/modalEditarDados";
import { Tooltip } from 'react-tooltip';
import { BiSave } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import 'react-tooltip/dist/react-tooltip.css';
import { ModalAcordos } from "@/components/modalAcordos";
import { FaHandshake } from "react-icons/fa";
import { MenuLateral } from "@/components/menu";
import { canSRRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import PrintButtonContrato from "@/Documents/contratoAdesão/PrintButton";


interface MensalidadeProps{
    parcela_n:number,
    vencimento:Date,
    cobranca:Date,
    valor_principal:number,
    close:boolean,
    status:string,
    usuario:string,
    id_mensalidade:number,
    valor_total:number,
    motivo_bonus: string,
    data_pgto:Date,
    referencia:string,
    index:number
}



export default function AdmContrato(){
   
    const {data,closeModa,dadosassociado,carregarDados,usuario} = useContext(AuthContext)
  const [dados,setDados] =useState(true)
  const [historico,setHistorico] = useState(false)
  const [dependentes,setDependentes] =useState(false)
  const[documentos,setDocumentos] = useState(false)
  const [checkMensal,setCheck] = useState(false)
  const [checkDependente,setCheckDependente] = useState(false)
    const tabelaRef = useRef<HTMLTableElement>(null)
    const [excluir,setExcluir]=useState(false)
    const [excluirDependente,setExcluirDependente]=useState(false)
    const [openEdit,setOpenEdit] = useState<number>(0)
    const [observacao, setObservacao] = useState('');
    const [verObs,setVerObs] =useState(false)
    const [componenteMounted,setMounted]=useState(false)
    const [linhasSelecionadas, setLinhasSelecionadas] = useState<Array<Partial<MensalidadeProps>>>([]);
    const [showSublinhas, setShowSublinhas] = useState<boolean>(false);
    const [mensalidadeComGrupoE,setMensalidaGrupo] =useState<Array<MensalidadeProps>>([]);
 
    let currentAcordoId :string;

    // Função para adicionar ou remover linhas do array de linhas selecionadas
    const toggleSelecionada = (item:MensalidadeProps) => {
        const index =linhasSelecionadas.findIndex((linha) => linha.id_mensalidade === item.id_mensalidade);
if(item.status==='P'){
    toast.info('Mensalidade Paga!')
    return;
}
if(item.status ==='E'){
    toast.info('Mensalidade em acordo!')
    return;
}
        if (index === -1) {
            // Adiciona a linha ao array se não estiver selecionada
            setLinhasSelecionadas([...linhasSelecionadas,item]);
            closeModa({acordo:{mensalidade:[...linhasSelecionadas,item]}})
        } else {
            // Remove a linha do array se já estiver selecionada
            const novasLinhasSelecionadas = [...linhasSelecionadas];
            novasLinhasSelecionadas.splice(index , 1);
            setLinhasSelecionadas(novasLinhasSelecionadas);
            closeModa({acordo:{mensalidade:novasLinhasSelecionadas}})
        }
       
    };


   function handleObservacao() {
    
   const novaObservacao = observacao.trim();

   if (novaObservacao !== '') {
     const anotacoesAntigas = dadosassociado && dadosassociado.contrato?.anotacoes || ''; // Definindo um valor padrão para anotacoesAntigas caso seja null ou undefined
    closeModa({ contrato: { anotacoes: anotacoesAntigas + novaObservacao + ' '+ `[${usuario?.nome+' ' +'em'+' '+ new Date().toLocaleDateString() }]`+ '\n' } }) ;
     setObservacao('')
   }
   }

   useEffect(()=>{
   
   
    async function listaCadastro() {
        const response = await api.get('/listarDadosCadastro')
        closeModa({cidades:response.data.cidades,planos:response.data.planos})
        
    }
    
    listaCadastro()
    closeModa({acordo:{...{}}})
  if(componenteMounted){atualizarObs()}
   setMounted(true)
 },[data.contrato?.anotacoes] )
async function atualizarObs() {
    try{
      const response =  await toast.promise(
            api.put('/atualizarObservacao',{
             id_contrato:dadosassociado?.contrato.id_contrato,
             anotacoes:data.contrato?.anotacoes?.toUpperCase()
          }),
           {
       error:'Erro ao adicionar Observação',
       pending:'Adicionando Observação',
       success:'Observação inserida com sucesso'
           }
          
           )
       
           await carregarDados()
    
       } catch(err){
        console.log(err)
       }
    
    
}
    function mensalidadeSet(){
        setDados(false),
        setDependentes(false),
        setHistorico(true)
      
    }
  useEffect(() => {
    const user = !!usuario
    if(!user){ 
       signOut()
       return;
   }
 
    const carregarDadosAsync = async () => {
      try {
        await carregarDados();
       // closeModa({contrato:{},dependente:{}})
        setVerObs(false)

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
     
    };
   componenteMounted && carregarDadosAsync();
   
      setDados(false),
      setDependentes(false),
      setHistorico(true)
    
  }, [data.id_associado]);

  useEffect(() => {
  
    if (dadosassociado?.contrato.situacao === 'INATIVO') {
        toast.error('CONTRATO INATIVO');
      }
    let x = 0;
    
      dadosassociado?.mensalidade.map((item, index) => {
        new Date() >= new Date(item.vencimento) && item.status === 'A' || item.status==='E' ? (x = x + 1) : '';
      });
      if (x > 1) {
        toast.warn(`Possui ${x} mensalidades Vencidas`);
      }

      if (tabelaRef.current) {
        // Ajusta o scrollTop para a altura total da tabela
        tabelaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }

      setLinhasSelecionadas([])
    // Marcar o componente como desmontado quando ele for desmontado
  }, [dadosassociado?.contrato?.situacao, dadosassociado?.mensalidade]);
 
  function calcularDiferencaEmDias(data1:Date, data2:Date) {
    // Convertendo as datas para objetos Date
    const timestamp1 = data1.getTime();
  const timestamp2 = data2.getTime();

  // Calculando a diferença em milissegundos
  const diferencaEmMilissegundos =timestamp1 - timestamp2;

  // Convertendo a diferença em dias (1 dia = 24 horas x 60 minutos x 60 segundos x 1000 milissegundos)
  const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

  return diferencaEmDias;
  }

  async function excluirMesal(){
    if(!linhasSelecionadas){
        toast.info("Selecione uma mensalidade");
        return;
    }
 
   linhasSelecionadas.map((mensalidade)=>{
    if(mensalidade.status==='P'){
        toast.warn('Mensalidade Paga! Para excluir solite ao gerente');
        return ;
    }

   })
    
    setExcluir(false)
    try{
     const response = await toast.promise(
            api.delete('/mensalidade/delete',{
             data:{
                mensalidades:linhasSelecionadas
             } 
            }),
            {
                pending: `Efetuando`,
                success: `Excluida com sucesso`,
                error: `Erro ao efetuar exlusão`
               }

        ) 
             await carregarDados()
             closeModa({mensalidade:{}})
             
    }catch(err){
        console.log(err)
    }
  }
  async function adicionarMensalidade(){
    const ultimaMensalidade = dadosassociado?.mensalidade[dadosassociado.mensalidade.length-1]
    const vencimento = new Date(ultimaMensalidade?.vencimento?ultimaMensalidade?.vencimento:'')
   const proxData = vencimento.setMonth(vencimento.getMonth()+1)
    try{
        await  toast.promise(
            api.post('/mensalidade/adicionar',{
            id_contrato:dadosassociado?.contrato.id_contrato,
            id_associado:dadosassociado?.id_associado,
            status:'A',
            valor_principal:dadosassociado?.contrato.valor_mensalidade,
            parcela_n:ultimaMensalidade?.parcela_n && ultimaMensalidade?.parcela_n+1,
            vencimento:new Date(proxData),
            cobranca:new Date(proxData),
            referencia:`${String(new Date(proxData).getMonth()+1).padStart(2,'0')}/${new Date(proxData).getFullYear()%100}`
        }),
        {
            pending: `Efetuando`,
            success: `Mensalidade Adicionada`,
            error: `Erro ao gerar mensalidade`
           }

       ) 
        carregarDados()
      
    }catch(err){
        toast.error('Erro ao Adicionar nova parcela')
        console.log(err)
    }
   
  }

  async function excluirDep(){
   if(data.dependente?.excluido){
    toast.info("Dependente ja excluido")
    return;
   }
   if(!data.dependente?.id_dependente){
    toast.info("Selecione um dependente!")
    return;
   }
   if(!data.dependente?.exclusao_motivo){
    toast.warning("Informe um motivo!")
    return;
   }
    try{
        await toast.promise(
            api.put('/excluirDependente',{
                id_dependente:Number(data.dependente?.id_dependente),
                excluido:true,
                user_exclusao:usuario?.nome,
                exclusao_motivo:data.dependente.exclusao_motivo
            }),
            {
                pending: `Efetuando`,
                success: `Dependente Exluido`,
                error: `Erro ao Excluir`
            }
        )
        
       await carregarDados()
        setExcluirDependente(false)
        closeModa({dependente:{close:false}})
       
    }catch(err){
        console.log(err)
    }

    
  }

    return(
        <>
       
        <Head>
            <title>Administrar Contrato</title>
         
        </Head>
        <div className="flex flex-col w-full mr-2  justify-center">
        {data.closeModalPlano && (<ModalBusca/>)}
        {data.closeModalCadastro && (<Teste/>)}
        {data.mensalidade?.close && (<ModalMensalidade/>)}
        {data.dependente?.close && <ModalDependentes/>}
        {data.closeEditarAssociado && <ModalEditarDados openEdit={openEdit}/>}
       {data.acordo?.closeAcordo && (<ModalAcordos />)}
       
        <div className="flex  flex-col p-4  ">
        <div className="flex  flex-row justify-start gap-2 items-center w-full mt-2 pb-1">
        <button onClick={()=>closeModa({closeModalPlano:true,mensalidade:{}})} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        <IoMdSearch size={20}/>
        Buscar Cliente
    </button>         
    <button type="button" onClick={()=>closeModa({closeModalCadastro:true})}  className="text-white gap-1  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center bg-[#c5942b] hover:bg-[#c5942ba9] focus:ring-blue-800">
    Add Plano
    <RiFileAddLine size={20} />
    </button>
   
    
            </div>
<div className="flex-col w-full border  rounded-lg shadow  border-gray-700">
    <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800"  role="tablist">
        <li className="me-2">
            <button  type="button" onClick={()=>{setDados(true),setDependentes(false),setHistorico(false),setDocumentos(false)}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Dados</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>mensalidadeSet()}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Histórico/Movimentação</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(true),setHistorico(false),setDocumentos(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dependentes</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(true),setHistorico(false),setDocumentos(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Carteiras</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(true),setHistorico(false),setDocumentos(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Óbitos</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(false),setHistorico(false),setDocumentos(true)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Documentos</button>
        </li>
    </ul>
    <div className="flex flex-col">
 
     {dados && dadosassociado && (<div className={`p-4  rounded-lg md:p-8`}>
      
              <h2 className="inline-flex gap-3 mb-3 text-xl font-extrabold tracking-tight text-white">
                {dadosassociado?.contrato.id_contrato}-{dadosassociado?.nome}
                 <span>PLANO:
                
                <span className="pl-3 text-[#c5942b]">{dadosassociado?.contrato.plano}
                </span>
                </span>
              
            <span className={`inline-flex items-center  text-sm font-medium px-2.5 py-0.5 rounded-full ${dadosassociado?.contrato.situacao==='ATIVO'?"bg-green-900 text-green-300":"bg-red-900 text-red-300"}`}>
            <span className={`w-2 h-2 me-1 ${dadosassociado?.contrato.situacao==='ATIVO'?"bg-green-500 ":"bg-red-500"}  rounded-full`}></span>
            {dadosassociado?.contrato.situacao}
            </span>
                </h2>
          <div className="flex w-full flex-row gap-2">
           
            <div className="flex relative flex-col w-1/2  p-4 text-sm  border  rounded-lg shadow bg-gray-800 border-gray-700">
            <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO TITULAR </h2>
 
        <h5 className="mb-1 inline-flex justify-between text-sm gap-2 font-semibold tracking-tight  text-white">
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ENDEREÇO: </span>{dadosassociado?.endereco}</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">Nº: </span>{dadosassociado?.numero}</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">BAIRRO: </span>{dadosassociado?.bairro}</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CIDADE: </span>{dadosassociado?.cidade}</p>
        </h5>
        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">PONTO REF: </span>{dadosassociado?.guia_rua}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CELULAR1: </span>{dadosassociado?.celular1}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CELULAR2: </span>{dadosassociado?.celular2}</p>

         </h5>
  
         <button data-tooltip-id="my-tooltip"
  data-tooltip-content="Editar Dados do Cliente/Contrato" onClick={()=>{setOpenEdit(1),closeModa({closeEditarAssociado:true,
         name:dadosassociado.nome,
         nasc:new Date(dadosassociado.data_nasc).toLocaleDateString(),
         bairro:dadosassociado.bairro,
         celular1:dadosassociado.celular1,
         celular2:dadosassociado.celular2,
         telefone:dadosassociado.telefone,
         cidade:dadosassociado.cidade,
         cep:dadosassociado.cep,
         cpf:dadosassociado.cpf,
         endereco:dadosassociado.endereco,
         email:dadosassociado.email,
         id_associado:dadosassociado.id_associado,
         contrato:{id_contrato:dadosassociado.contrato.id_contrato,
            cobrador:dadosassociado.contrato.cobrador,
            consultor:dadosassociado.contrato.consultor,
            data_vencimento:dadosassociado.contrato.data_vencimento,
            dt_adesao:dadosassociado.contrato.dt_adesao,
            dt_carencia:dadosassociado.contrato.dt_carencia,
            id_plano:dadosassociado.contrato.id_plano,
            origem:dadosassociado.contrato.origem,
            plano:dadosassociado.contrato.plano,
            situacao:dadosassociado.contrato.situacao,
            supervisor:dadosassociado.contrato.supervisor,
            valor_mensalidade:dadosassociado.contrato.valor_mensalidade
        },
      //  planos:usuario?.planos,
       // cidades:usuario?.cidades,
        numero:dadosassociado.numero,
        profissao:dadosassociado.profissao,
        rg:dadosassociado.rg,
        referencia:dadosassociado.guia_rua,
        uf:dadosassociado.uf
        })}} className="absolute -right-1 -top-1 text-blue-400 "><FaEdit size={16}/></button>
       <Tooltip id="my-tooltip"/>
    </div>
    <div className="flex relative  w-1/2 text-white flex-col p-4 text-sm border  rounded-lg shadow bg-gray-800 border-gray-700">
    <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO PLANO</h2>
   
    <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
           
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CATEGORIA: </span>{dadosassociado?.contrato.plano}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">VALOR: </span>R$ {dadosassociado?.contrato.valor_mensalidade}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ADESÃO: </span> {new Date(dadosassociado?.contrato.dt_adesao).toLocaleDateString()}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CARÊNCIA: </span>{new Date(dadosassociado?.contrato.dt_carencia).toLocaleDateString()}</p>
         </h5>
         <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className=" font-normal text-gray-400"><span className="text-white font-semibold">ORIGEM: </span>{dadosassociado?.contrato.origem}</p>
            <p className=" font-normal text-red-600"><span className="text-white font-semibold">CONSULTOR: </span>{dadosassociado?.contrato.consultor}</p>
            <p className=" font-normal text-red-600"><span className="text-white font-semibold">COBRADOR: </span>{dadosassociado?.contrato.cobrador}</p>
         </h5>
 
        <button data-tooltip-id="my-tooltip"
  data-tooltip-content="Editar Dados do Cliente/Contrato" onClick={()=>{setOpenEdit(2),closeModa({closeEditarAssociado:true,
    name:dadosassociado.nome,
    nasc:new Date(dadosassociado.data_nasc).toLocaleDateString(),
    bairro:dadosassociado.bairro,
    celular1:dadosassociado.celular1,
    celular2:dadosassociado.celular2,
    telefone:dadosassociado.telefone,
    cidade:dadosassociado.cidade,
    cep:dadosassociado.cep,
    cpf:dadosassociado.cpf,
    endereco:dadosassociado.endereco,
    email:dadosassociado.email,
    id_associado:dadosassociado.id_associado,
    contrato:{id_contrato:dadosassociado.contrato.id_contrato,
       cobrador:dadosassociado.contrato.cobrador,
       consultor:dadosassociado.contrato.consultor,
       data_vencimento:dadosassociado.contrato.data_vencimento,
       dt_adesao:dadosassociado.contrato.dt_adesao,
       dt_carencia:dadosassociado.contrato.dt_carencia,
       id_plano:dadosassociado.contrato.id_plano,
       origem:dadosassociado.contrato.origem,
       plano:dadosassociado.contrato.plano,
       situacao:dadosassociado.contrato.situacao,
       supervisor:dadosassociado.contrato.supervisor,
       valor_mensalidade:dadosassociado.contrato.valor_mensalidade
   },
 //  planos:usuario?.planos,
  // cidades:usuario?.cidades,
   numero:dadosassociado.numero,
   profissao:dadosassociado.profissao,
   rg:dadosassociado.rg,
   referencia:dadosassociado.guia_rua,
   uf:dadosassociado.uf
        })}} className="absolute -right-1 -top-1  text-blue-400"><FaEdit size={16}/></button>
</div>
    </div>  
   
<div>
   <div className="w-full  mt-2 border  rounded-lg  bg-gray-700 border-gray-600">
   <div className="flex gap-2 items-center justify-end px-2 py-1 border-b dark:border-gray-600">
      <button onClick={()=>setVerObs(!verObs)}  type="button" className="inline-flex items-center py-1 px-2  text-center text-white 0 rounded-lg  hover:bg-blue-800">
     {verObs?<IoMdEye data-tooltip-id="my-tooltip"
  data-tooltip-content="Ocultar Observações" size={20}/> : <IoMdEyeOff data-tooltip-id="my-tooltip"
  data-tooltip-content="Visualizar Observações" size={20}/>}
           </button>
  
   <input value={observacao ?? ''} onChange={e=>setObservacao(e.target.value ?? '')} placeholder="Digite aqui todas as observações em relação ao plano" type="text"  className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
           <button onClick={()=>handleObservacao()}  type="button" className="inline-flex items-center py-1 px-2  text-center text-white bg-blue-700 rounded-lg  hover:bg-blue-800">
           <BiSave size={22}/>
           </button>
           
       </div>
       <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
          
           <textarea value={verObs?dadosassociado.contrato?.anotacoes: ''}   disabled rows={4} className="w-full px-0 text-sm pl-2  border-0 bg-gray-800 focus:ring-0 text-white placeholder-gray-400" />
       </div>
    
   </div>
   </div> 
   </div>
)}

        {historico && (
           
<div   className="flex flex-col rounded-lg  max-h-[calc(100vh-220px)]  p-2 shadow-md sm:rounded-lg">
<div className="flex w-full mb-2 gap-2">
<label className="relative inline-flex w-[130px] justify-center  items-center mb-1 cursor-pointer">
  <input checked={checkMensal} onChange={()=>setCheck(!checkMensal)} type="checkbox" value="2" className="sr-only peer"/>
  <div className="w-9 h-5 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[5px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
  <span className="ms-3 text-sm font-medium  text-gray-300">Exibir Pagas</span>
</label>
<div className="inline-flex rounded-md shadow-sm" role="group">
  <button onClick={adicionarMensalidade} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
 <RiAddCircleFill size={20}/>
    Adicionar
  </button>
  <button type="button" onClick={()=>closeModa({acordo:{...data.acordo,closeAcordo:true,visibilidade:false}})} className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   <FaHandshake size={20}/>
    Acordo
  </button>
  <button onClick={()=>setExcluir(!excluir)} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   <MdDeleteForever size={20}/>
    Excluir
  </button>
  {excluir?(<div  className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="flex items-center justify-center p-2 w-full h-full">
        <div className="relative rounded-lg shadow bg-gray-800">
            <button type="button" onClick={()=>setExcluir(!excluir)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
             <button  type="button" onClick={()=>closeModa({closeModalPlano:false})} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
                </button>
            </button>
            <div className="p-4 md:p-5 text-center">
                <div className="flex w-full justify-center items-center">
                  <TbAlertTriangle className='text-gray-400' size={60}/>
                </div>
                <h3 className="mb-5 text-lg font-normal  text-gray-400">Realmente deseja deletar esssa mensalidade?</h3>
               
                <button onClick={excluirMesal} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                    Sim, tenho certeza
                </button>
                <button onClick={()=>setExcluir(!excluir)}  type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
            </div>
        </div>
    </div>
</div>):''}
</div>

</div>

    <table 
     className="block  overflow-y-auto overflow-x-auto text-xs text-center rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
            <tr >
                <th scope="col" className="px-6 py-1">
                    NP
                </th>
                <th scope="col" className=" px-6 py-1">
                    DATA VENC.
                </th>
                <th scope="col" className=" px-6 py-1">
                    REF
                </th>
                <th scope="col" className="px-6 py-1">
                    DATA AGEND.
                </th>
                <th scope="col" className="px-6 py-1">
                    VALOR
                </th>
                <th scope="col" className="px-6 py-1">
                    status
                </th>
                <th scope="col" className=" px-6 py-1">
                    Data Pag.
                </th>
                <th scope="col" className=" px-6 py-1">
                    Hr Pag.
                </th>
                <th scope="col" className=" px-6 py-1">
                    usuário
                </th>
                <th scope="col" className=" px-6 py-1">
                    val pago
                </th>
                <th scope="col" className=" px-6 py-1">
                    forma
                </th>
                <th scope="col" className=" px-6 py-1">
                    ATRASO
                </th>
                <th scope="col" className="px-12 py-1">
                    <span>ações</span>
                </th>
            </tr>
        </thead>
        <tbody  >
     
        
          {dadosassociado?.mensalidade.map((item, index) => {

const idAcordoMudou = currentAcordoId !== item.status;
currentAcordoId = item.status;
     return ( idAcordoMudou && item.id_acordo!==null ? (
            <React.Fragment key={index}>
               
              { dadosassociado.acordo.map((i, l) => {
      return(

        
        
        <React.Fragment key={l}>
        <tr onAuxClick={()=>setShowSublinhas(!showSublinhas)} className={` ${i.status !=='A' && "hidden" } cursor-pointer hover:bg-gray-600 font-semibold text-yellow-500 border-b bg-gray-800 border-gray-700`} onClick={() => setShowSublinhas(!showSublinhas)} key={l}>
          <td className="px-2 py-1">{/* Renderizar algo aqui */}</td>
          <td className="px-2 py-1">ACORDO</td>
          <td className="px-2 py-1">VALOR:R${i.total_acordo}</td>
          <td className="px-2 py-1">VENC.:{new Date(i.data_fim).toLocaleDateString()}</td>
          <td className="px-2 py-1">RESP.:{i.realizado_por}</td>
          <td className="px-2 py-1">Método:{i.metodo}</td>
          <td className="px-2 py-1">{i.status}</td>
          <td className="px-2 py-1">{}</td>
          <td className="px-2 py-1">{}</td>
          <td className="px-2 py-1">{}</td>
          <td className="px-2 py-1">{}</td>
          <td className="px-2 py-1">{}</td>
          {/* Renderizar mais colunas se necessário */}
          <td className="px-2 py-1">
            <button onClick={(event)=>{
                console.log(i.mensalidade)
                    event.stopPropagation()
                       
                    closeModa({acordo:{
                        mensalidade:i.mensalidade,
                        id_acordo:i.id_acordo,
                        data_fim:i.data_fim,
                        data_inicio:i.data_inicio,
                        dt_pgto:i.dt_pgto,
                        realizado_por:i.realizado_por,
                        status:i.status,
                        total_acordo:i.total_acordo,
                        descricao:i.descricao,
                        visibilidade:true,
                        closeAcordo:true, 
                    }})
                
                    }} className={`font-medium hover:underline ${new Date(item.vencimento) < new Date() && item.status === 'A' ? "text-red-500" : 'text-blue-500'}`}>
              Baixar/Editar
            </button>
          </td>
        </tr>
        {i.mensalidade?.map((ii, ee) => (
          <tr   className={`border-b ${!showSublinhas && "hidden" } ${ii.status!=='E' && "hidden"} text-yellow-500 border-gray-700  hover:bg-gray-500 hover:text-black `} key={ee}>
            <th scope="row" className={`px-5 py-1 font-medium  whitespace-nowrap  `}>
                    {ii.parcela_n}
                </th>
                <td className={`px-2 py-1 `}>
                   {ii.vencimento && new Date(ii.vencimento).toLocaleDateString()}
                   
                </td>
                <td className="px-2 py-1">
                   {ii.referencia}
                </td>
                <td className="px-5 py-1">
                {ii.cobranca && new Date(ii.cobranca).toLocaleDateString()}
                </td>
                <td className="px-3 py-1">
               {`R$${ii.valor_principal}`}
                </td>
                <td className={`px-4 py-1 ${ii.status==='A'&& ii.vencimento && calcularDiferencaEmDias(new Date(), new Date(ii.vencimento))>=1 ?"font-bold text-red-600":item.status=='P'?"font-bold text-blue-600" :''}`}>
                  {ii.status}
                </td>
                <td className="px-4 py-1">
                  {ii.data_pgto? new Date(ii.data_pgto).toLocaleDateString():''}
                </td>
                <td className="px-4 py-1">
                  {ii.data_pgto? new Date(ii.data_pgto).toLocaleTimeString():''}
                </td>
                <td className="px-6 py-1">
               {ii.usuario}
                </td>
                <td className={`px-6 py-1`}>
                {ii.valor_total?`R$${ii.valor_total}`:''}     
                </td>
                <td className="px-4 py-1">
               
                </td>
              
                <td className="px-4 py-1">
                    {ii.vencimento && calcularDiferencaEmDias(new Date(),new Date(ii.vencimento))<=0?0:ii.vencimento && calcularDiferencaEmDias(new Date(),new Date(ii.vencimento))}
                </td>
                <td className="px-4 py-1">
                  
                </td>
               
          </tr>
        ))}
        </React.Fragment>
      )
     })}
    </React.Fragment>
  ) :      
                            
               checkMensal && item.status!=='E'?
            
               (

                <tr key={index} 
    
               onClick={()=>toggleSelecionada(item)}
                //className={` border-b ${item.id_mensalidade===data.mensalidade?.id_mensalidade?"bg-gray-600":"bg-gray-800"}  border-gray-700  hover:bg-gray-600  ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":item.status==='P'? 'text-blue-500':'text-white'}`}>
                className={`${calcularDiferencaEmDias(new Date(),new Date(item.vencimento))>=1 && item.status==='A' && "text-red-600"} border-b ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade)? "bg-gray-600" : "bg-gray-800"}  ${item.status==='P' && "text-blue-500"} border-gray-700  hover:bg-gray-500 hover:text-black   ${item.parcela_n===0?"hidden":''}`}>
                <th scope="row" className={`px-5 py-1 font-medium `}>
                    {item.parcela_n}
                </th>
                <td className={`px-2 py-1 `}>
                   {new Date(item.vencimento).toLocaleDateString()}
                   
                </td>
                <td className="px-2 py-1">
                   {item.referencia}
                </td>
                <td className="px-5 py-1">
                {new Date(item.cobranca).toLocaleDateString()}
                </td>
                <td className="px-3 py-1">
               {`R$${item.valor_principal}`}
                </td>
                <td className={`px-4 py-1  font-bold ${item.status==='A' && "text-red-600"}`}>
                  {item.status}
                </td>
                <td className="px-4 py-1">
                  {item.data_pgto? new Date(item.data_pgto).toLocaleDateString():''}
                </td>
                <td className="px-4 py-1">
                  {item.data_pgto? new Date(item.data_pgto).toLocaleTimeString():''}
                </td>
                <td className="px-6 py-1">
               {item.usuario}
                </td>
                <td className={`px-6 py-1`}>
                {item.valor_total?`R$${item.valor_total}`:''}     
                </td>
                <td className="px-4 py-1">
               
                </td>
              
                <td className="px-4 py-1">
                    {calcularDiferencaEmDias(new Date(),new Date(item.vencimento))<=0?0:calcularDiferencaEmDias(new Date(),new Date(item.vencimento))}
                </td>
                <td  className="px-8 py-1 text-right">
                <button onClick={(event)=>{
                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                    closeModa(
                    {mensalidadeAnt:dadosassociado?.mensalidade && dadosassociado.mensalidade[index-1] ,
                    
                    mensalidade:{
                    parcela_n:Number(item.parcela_n),
                    cobranca:item.cobranca,
                    vencimento:item.vencimento,
                    valor_principal:Number(item.valor_principal),
                    status:item.status,
                    usuario:item.usuario,
                    referencia:item.referencia,
                    id_mensalidade:item.id_mensalidade,
                    close:true,
                    valor_total:item.valor_total,
                    motivo_bonus:item.motivo_bonus,
                    data_pgto:item.data_pgto ? item.data_pgto: new Date(),
                    index:index
                    }})}} className={`font-medium ${item.status ==='E' ? "hidden":''}  hover:underline ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":'text-blue-500'}`}>Baixar/Editar</button>
                </td>
            </tr>
               ):item.status==='A'?(
                <tr key={index} //onClick={()=>{closeModa({mensalidade:{
                   // id_mensalidade:item.id_mensalidade,
                   // status:item.status
               // }})}} className={` border-b ${item.id_mensalidade===data.mensalidade?.id_mensalidade?"bg-gray-600":"bg-gray-800"}  border-gray-700  hover:bg-gray-600 ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":'text-white'}`}>
               onClick={()=>toggleSelecionada(item)}
               className={`${calcularDiferencaEmDias(new Date(),new Date(item.vencimento))>=1 && "text-red-600"}  border-b ${linhasSelecionadas.some(linha => linha.id_mensalidade === item.id_mensalidade)? "bg-gray-600" : "bg-gray-800"}   border-gray-700  hover:bg-gray-500 hover:text-black   ${item.parcela_n===0?"hidden":''}`}>
                   <th  className="px-5 py-1 font-medium  ">
                    {item.parcela_n}
                </th>
                <td className="px-2 py-1">
                   {new Date(item.vencimento).toLocaleDateString()}
                   
                </td>
                <td className="px-2 py-1">
                   {item.referencia}
                </td>
                <td className="px-5 py-1">
                {new Date(item.cobranca).toLocaleDateString()}
                </td>
                <td className="px-3 py-1">
               {`R$${item.valor_principal}`}
                </td>
                <td className={`px-4 py-1 ${item.status==='A' && "font-bold text-red-600"}`}>
                  {item.status}
                </td>
                <td className="px-4 py-1">
                  {item.data_pgto? new Date(item.data_pgto).toLocaleDateString():''}
                </td>
                <td className="px-4 py-1">
                  {item.data_pgto? new Date(item.data_pgto).toLocaleTimeString():''}
                </td>
                <td className="px-6 py-1">
               {item.usuario}
                </td>
                <td className={`px-6 py-1`}>
                {item.valor_total?`R$${item.valor_total}`:''}     
                </td>
                <td className="px-4 py-1">
                </td>
                <td className="px-4 py-1">
                    {calcularDiferencaEmDias(new Date(),new Date(item.vencimento))<=0?0:calcularDiferencaEmDias(new Date(),new Date(item.vencimento))}
                </td>
                <td className=" px-8 py-1 text-right">
                <button onClick={(event)=>{
                    event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                    closeModa(
                    {mensalidadeAnt:dadosassociado?.mensalidade && dadosassociado.mensalidade[index-1],
                    
                    mensalidade:{
                    parcela_n:Number(item.parcela_n),
                    cobranca:item.cobranca,
                    vencimento:item.vencimento,
                    valor_principal:Number(item.valor_principal),
                    status:item.status,
                    usuario:item.usuario,
                    referencia:item.referencia,
                    id_mensalidade:item.id_mensalidade,
                    close:true,
                    valor_total:item.valor_total,
                    motivo_bonus:item.motivo_bonus,
                    data_pgto:item.data_pgto ? item.data_pgto: new Date(),
                    index:index
                    }})}} className={`font-medium   hover:underline ${new Date(item.vencimento)<new Date()&& item.status==='A'?"text-red-500":'text-blue-500'}`}>Baixar/Editar</button>
                </td>
            </tr>

               ):''
                
               ) })}
        {/* Encontrar a primeira mensalidade com status 'E' */}

            
        </tbody>
    
    </table>
</div>
        )}
        {dependentes && (<div className="flex flex-col rounded-lg  max-h-[calc(100vh-200px)]  max-w-[calc(100vw-350px)]  p-4 shadow-md sm:rounded-lg">
        <div className="flex w-full mb-2 gap-2">
        <label className="relative inline-flex w-[150px] justify-center  items-center mb-1 cursor-pointer">
  <input checked={checkDependente} onChange={()=>setCheckDependente(!checkDependente)} type="checkbox" value="2" className="sr-only peer"/>
  <div className="w-9 h-5 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[7px] after:start-[5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
  <span className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">Exibir Excluidos</span>
</label>
        <div className="inline-flex rounded-md shadow-sm mb-1" role="group" >
  <button onClick={()=>closeModa({dependente:{close:true,saveAdd:false}})} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border  rounded-s-lg  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
 <RiAddCircleFill size={20}/>
    Adicionar
  </button>
  <button type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border-t border-b  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
    Settings
  </button>
  <button onClick={()=>setExcluirDependente(!excluirDependente)} type="button" className="inline-flex items-center px-4 py-1 gap-1 text-sm font-medium  border 0 rounded-e-lg  focus:z-10 focus:ring-2   bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
   <MdDeleteForever size={20}/>
    Excluir
  </button>
  {excluirDependente?( <div  className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="flex items-center justify-center p-2 w-full h-full">
        <div className="relative rounded-lg shadow bg-gray-800">
            <button type="button" onClick={()=>setExcluirDependente(!excluirDependente)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
             <button  type="button" onClick={()=>closeModa({closeModalPlano:false})} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
                </button>
            </button>
            <div className="p-4 md:p-5 text-center">
                <div className="flex w-full justify-center items-center">
                  <TbAlertTriangle className='text-gray-400' size={60}/>
                </div>
                <h3 className="mb-3 text-lg font-normal  text-gray-400">{`Realmente deseja deletar ${data.dependente?.nome} ?`}</h3>
                <input placeholder="Informe o motivo da exclusão" autoComplete='off' value={data.dependente?.exclusao_motivo} onChange={e=>closeModa({dependente:{...data.dependente,exclusao_motivo:e.target.value}})}  type="text" required className="block uppercase w-full mb-2 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
                <button onClick={excluirDep} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                    Sim, tenho certeza
                </button>
                <button onClick={()=>setExcluirDependente(!excluirDependente)}  type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
            </div>
        </div>
    </div>
</div>):''}
</div>
</div>
        <table 
     className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
        <thead className="sticky top-0  text-xs uppercase bg-gray-700 text-gray-400">
          {!checkDependente?(  <tr>
                <th scope="col" className=" px-2 py-1">
                    NOME
                </th>
                <th scope="col" className="px-12 py-1">
                    ADESÃO
                </th>
                <th scope="col" className="px-12 py-1">
                    CARÊNCIA
                </th>
                <th scope="col" className="px-12 py-1">
                    NASC.
                </th>
                <th scope="col" className="px-12 py-1">
                    PARENTESCO
                </th> 
                <th scope="col" className="px-[42px] py-1">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>):(
                  <tr>
                  <th scope="col" className=" px-6 py-1">
                      NOME
                  </th>
                  <th scope="col" className="px-6 py-1">
                      ADESÃO
                  </th>
                  <th scope="col" className="px-6 py-1">
                      CARÊNCIA
                  </th>
                  <th scope="col" className="px-6 py-1">
                      NASC.
                  </th>
                  <th scope="col" className="px-6 py-1">
                      PARENTESCO
                  </th> 
                  <th scope="col" className="px-6 py-1">
                      DATA EXCLUSÃO
                  </th> 
                  <th scope="col" className="px-6 py-1">
                      USUÁRIO
                  </th> 
                  <th scope="col" className="px-4 py-1">
                      <span className="sr-only">Edit</span>
                  </th>
              </tr>
            )}
        </thead>
        <tbody>
            {dadosassociado?.dependentes?.map((item,index)=>(
            checkDependente && item.excluido?( <tr key={index} onClick={()=>closeModa({dependente:{id_dependente:item.id_dependente,nome:item.nome,excluido:item.excluido}})} className={ `border-b ${item.id_dependente===data.dependente?.id_dependente?"bg-gray-600":"bg-gray-800"} border-gray-700  hover:bg-gray-600 text-red-500`}>
            <th scope="row"  className="px-6 py-1 font-medium  whitespace-nowrap">
                   {item.nome}
            </th>
            <td className="px-6 py-1">
            {new Date(item.data_adesao).toLocaleDateString()}
            </td>
            <td className="px-6 py-1">
            {item?.carencia? new Date(item.carencia).toLocaleDateString():''}
            </td>
            <td className="px-6 py-1">
            {item?.data_nasc? new Date(item.data_nasc).toLocaleDateString():''}
            </td>
            <td className="px-6 py-1">
               {item.grau_parentesco}
            </td>
            <td className="px-6 py-1">
               {new Date(item.dt_exclusao).toLocaleDateString()}
            </td>
            <td className="px-6 py-1">
               {item.user_exclusao}
            </td>
           
            
            <td className="px-4 py-1 text-right">
                <button onClick={(event)=>{
                               event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                               closeModa(
                               {
                                   dependente:{
                                       saveAdd:true,
                                       close:true,
                                       carencia:item.carencia,
                                       data_adesao:item.data_adesao,
                                       data_nasc:item.data_nasc,
                                       grau_parentesco:item.grau_parentesco,
                                       id_dependente:item.id_dependente,
                                       nome:item.nome,
                                       excluido:item.excluido,
                                       exclusao_motivo:item.exclusao_motivo                                   }
                               })}} className="font-medium  text-blue-500 hover:underline">Edit</button>
            </td>
           </tr>):!checkDependente && !item.excluido?(
             <tr key={index} onClick={()=>closeModa({dependente:{id_dependente:item.id_dependente,nome:item.nome,excluido:item.excluido}})} className={ `border-b ${new Date(item.carencia)>new Date()?"text-yellow-500":"text-white"} ${item.id_dependente===data.dependente?.id_dependente?"bg-gray-600":"bg-gray-800"} border-gray-700  hover:bg-gray-600`}>
             <th scope="row"  className="px-2 py-1 font-medium   whitespace-nowrap">
                    {item.nome}
             </th>
             <td className="px-8 py-1">
             {new Date(item.data_adesao).toLocaleDateString()}
             </td>
             <td className="px-10 py-1">
             {item?.carencia? new Date(item.carencia).toLocaleDateString():''}
             </td>
             <td className="px-8 py-1">
             {item?.data_nasc? new Date(item.data_nasc).toLocaleDateString():''}
             </td>
             <td className="px-12 py-1">
                {item.grau_parentesco}
             </td>
            
             
             <td className="px-3 py-1 ">
                 <button onClick={(event)=>{
                                event.stopPropagation() // Garante que o click da linha não se sobreponha ao do botão de Baixar/Editar
                                closeModa(
                                {
                                    dependente:{
                                        saveAdd:true,
                                        close:true,
                                        carencia:item.carencia,
                                        data_adesao:item.data_adesao,
                                        data_nasc:item.data_nasc,
                                        grau_parentesco:item.grau_parentesco,
                                        id_dependente:item.id_dependente,
                                        excluido:item.excluido,
                                        nome:item.nome,
                                       
                                    }
                                })}} className="font-medium  text-blue-500 hover:underline">Edit</button>
             </td>
            </tr>
           ):''

            ))}
           
        </tbody>
    
    </table>
</div>)}

{
    documentos && <div className="flex flex-col w-full rounded-lg p-6   gap-5">
    <div className="flex flex-row text-white gap-6 w-full">
    <PrintButtonContrato/>
    
    </div>

    </div>
}




    </div>
</div>
        </div>
        </div>
        </>
    )
}
export const getServerSideProps = canSRRAuth(async(ctx)=>{
    return{
      props:{}
    }
  })