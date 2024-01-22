
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import {ModalBusca} from '../../components/modal'
import Teste from '@/pages/teste/index';
import { useState,useContext, useEffect } from "react";
import { RiFileAddLine } from "react-icons/ri";

import {AuthContext} from "../../contexts/AuthContext"
import { toast } from "react-toastify";





export default function AdmContrato(){
   
    const {data,closeModa,dadosassociado,carregarDados} = useContext(AuthContext)
  const [dados,setDados] =useState(true)
  const [historico,setHistorico] = useState(false)
  const [dependentes,setDependentes] =useState(false)
 
  
  useEffect(() => {
    const carregarDadosAsync = async () => {
      try {
        await carregarDados();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    carregarDadosAsync();
  }, [data.id_associado]);

  useEffect(() => {
    let x =0;
    if (dadosassociado?.contrato.situacao=== 'INATIVO') {
      toast.error('CONTRATO INATIVO');
    }
    dadosassociado?.mensalidade.map((item,index)=>{
        new Date()>=new Date(item.vencimento) && item.status==='A'? x=x+1 :'';
    })
    if(x>1){
        toast.warn(`Possui ${x} mensalidades em aberto`)
    }
   
   
  }, [dadosassociado]);

  function calcularDiferencaEmDias(data1:Date, data2:Date) {
    // Convertendo as datas para objetos Date
    const timestamp1 = data1.getTime();
  const timestamp2 = data2.getTime();

  // Calculando a diferença em milissegundos
  const diferencaEmMilissegundos = Math.abs(timestamp2 - timestamp1);

  // Convertendo a diferença em dias (1 dia = 24 horas x 60 minutos x 60 segundos x 1000 milissegundos)
  const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

  return diferencaEmDias;
  }





    return(
        <div className="flex w-full mr-2">
        {data.closeModalPlano && (<ModalBusca/>)}
        {data.closeModalCadastro && (<Teste/>)}
        <div className="flex  flex-col w-full pl-4">
        <div className="flex  flex-row justify-start gap-2 items-center w-full mb-4">
        <button onClick={()=>closeModa({closeModalPlano:true})} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        <IoMdSearch size={20}/>
        Buscar Cliente
    </button>         
    <button type="button" onClick={()=>closeModa({closeModalCadastro:true})}  className="text-white gap-1  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center bg-[#c5942b] hover:bg-[#c5942ba9] focus:ring-blue-800">
    Add Plano
    <RiFileAddLine size={20} />
    </button>
            </div>
<div className="w-full border  rounded-lg shadow bg-gray-800 border-gray-700">
    <ul className="flex flex-wrap text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
        <li className="me-2">
            <button  type="button" onClick={()=>{setDados(true),setDependentes(false),setHistorico(false)}}   className="inline-block p-4  rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Dados</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(false),setHistorico(true)}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Histórico</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(true),setHistorico(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dependentes</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setDados(false),setDependentes(true),setHistorico(false)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Óbitos</button>
        </li>
    </ul>
    <div >
     {dados && dadosassociado && (<div className={` p-4  rounded-lg md:p-8 bg-gray-800 ${dados? "":''}`}>
    
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
           
            <div className="flex flex-col  p-4 text-sm  border  rounded-lg shadow bg-gray-800 border-gray-700">
            <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO TITULAR</h2>
 
        <h5 className="mb-1 inline-flex justify-between text-sm gap-2 font-semibold tracking-tight  text-white">
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ENDEREÇO: </span>{dadosassociado?.endereco}</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">Nº: </span>{dadosassociado?.numero}</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">BAIRRO: </span>{dadosassociado?.bairro}</p>
        </h5>
        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">PONTO REF: </span>{dadosassociado?.guia_rua}</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CIDADE: </span>{dadosassociado?.cidade}</p>
         </h5>
    </div>
    <div className="flex text-white flex-col p-4 text-sm border  rounded-lg shadow bg-gray-800 border-gray-700">
    <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO PLANO</h2>
   
    <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
           
            <p className=" font-normal text-gray-400"><span className="text-white font-semibold">CATEGORIA: </span>{dadosassociado?.contrato.plano}</p>
            <p className="font-normal text-gray-400"><span className="text-white font-semibold">VALOR: </span>R$ {dadosassociado?.contrato.valor_mensalidade}</p>
         </h5>
         <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ADESÃO: </span>{dadosassociado?.contrato.dt_adesao?new Date(dadosassociado.contrato.dt_adesao).toLocaleDateString():''}</p>
            <p className="mb-1 font-normal text-red-600"><span className="text-white font-semibold">CARÊNCIA: </span>{dadosassociado?.contrato.dt_carencia? new Date(dadosassociado.contrato.dt_carencia).toLocaleDateString():''}</p>
         </h5>
 

</div>
    </div>  
        </div>)}
        {historico && (
           
<div className="flex  rounded-lg  overflow-y-auto w-full max-h-96  p-3   shadow-md sm:rounded-lg">
    <table 
     className="w-full text-xs text-left rtl:text-right overflow-y-auto   rounded-lg  text-gray-400 ">
        <thead className=" w-full text-xs  uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className=" px-6 py-1">
                    NP
                </th>
                <th scope="col" className="px-6 py-1">
                    DATA VENC.
                </th>
                <th scope="col" className="px-6 py-1">
                    DATA AGEND.
                </th>
                <th scope="col" className="px-8 py-1">
                    VALOR
                </th>
                <th scope="col" className="px-6 py-1">
                    status
                </th>
                <th scope="col" className="px-6 py-1">
                    BAIXADA POR
                </th>
                <th scope="col" className="px-6 py-1">
                    AGENDADA POR
                </th>
                <th scope="col" className="px-6 py-1">
                    ATRASO
                </th>
                <th scope="col" className="px-6 py-1">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {dadosassociado?.mensalidade.map((item,index)=>(
                
                <tr onDoubleClick={()=>{alert("CLICOU DUAS VEZES")}} className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-7 py-1 font-medium  whitespace-nowrap text-white">
                    {item.parcela_n}
                </th>
                <td className="px-7 py-1">
                   {new Date(item.vencimento).toLocaleDateString()}
                   
                </td>
                <td className="px-7 py-1">
                {new Date(item.cobranca).toLocaleDateString()}
                </td>
                <td className="px-10 py-1">
               {`R$${item.valor_principal}`}
                </td>
                <td className="px-10 py-1">
                  {item.status}
                </td>
                <td className="px-10 py-1">
               {item.usuario}
                </td>
                <td className="px-6 py-1">
                   
                </td>
                <td className="px-6 py-1">
                    {calcularDiferencaEmDias(new Date(),new Date(item.vencimento))}
                </td>
                <td className="px-6 py-1 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            ))}
            
        </tbody>
    
    </table>
</div>

        )}
        {dependentes && (<div className="flex rounded-lg  overflow-y-auto w-full max-h-96  p-3   shadow-md sm:rounded-lg">
    <table 
     className="w-full text-sm text-left rtl:text-right overflow-y-auto   rounded-lg  text-gray-400 ">
        <thead className=" w-full text-xs  uppercase bg-gray-700 text-gray-400">
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
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {dadosassociado?.dependentes?.map((item,index)=>(
 <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
 <th scope="row" className="px-6 py-1 font-medium  whitespace-nowrap text-white">
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

 
 <td className="px-6 py-1 text-right">
     <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
 </td>
</tr>
            ))}
           
        
        
         
        
        </tbody>
    
    </table>
</div>)}
    </div>
</div> 
        </div>
        </div>
    )
}
