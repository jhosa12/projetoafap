
import { api } from "@/services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";




export default function GerarOS(){
    
    const {usuario}= useContext(AuthContext)
    const [falecido,setFalecido] =useState(true);
    const [declarante,setDeclarante] =useState(false);
    const [dadosObito,setObito] = useState(false);
    useEffect(()=>{
        try{
         
          
        }catch(err){
           toast.error('Erro ao Listar Notificações')
        }
     },[])






    return(
        <>
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
            <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>
            <div className="flex flex-row gap-8">
            <div className="flex items-center ">
    <input  type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600"/>
    <label  className="ms-2 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-300">PARTICULAR</label>
</div>
            <button onClick={()=>{}} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        <IoMdSearch size={20}/>
        Buscar
    </button> 
    </div>
            </div>
            <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">
            <ul className="flex flex-wrap text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800"  role="tablist">
        <li className="me-2">
            <button  type="button" onClick={()=>{setFalecido(true), setDeclarante(false),setObito(false)}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(true),setObito(false)}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{setFalecido(false), setDeclarante(false),setObito(true)}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
        </li>
    </ul>
   {falecido && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Nome do Falecido</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Data Nascimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Religião</label>
            <select  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs bg-[#0f172a] border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                <option value="">CATÓLICA</option>
                <option value="">EVANGÉLICA</option>
            </select>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Sexo</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">RG</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CPF</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Estado Civil</label>
            <select  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                <option value="">CATÓLICA</option>
                <option value="">EVANGÉLICA</option>
            </select>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Certidão de Casamento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Conjuge</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Naturalidade</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Profissão</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Nacionalidade</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Tipo de Inumado</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Cemitério</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço do Cemitério</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
        
        </div>
        <div className="flex gap-2 text-gray-400 justify-center items-center  col-span-4">
            <span>Endereço</span>
        <div className="border-b-[1px] w-full border-gray-600"></div>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Número</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Cidade</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">UF</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
           
        </div>
      
        </div>}



        {declarante && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Nome do Declarante</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CPF/CNPJ</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">RG</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>

        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Endereço</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
      
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Numero</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Bairro</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Complemento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Cidade</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">UF</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
           
        </div>
        </div>}



        {dadosObito && <div className="rounded-lg p-6 grid grid-flow-row-dense grid-cols-4 gap-6">
    <div className="flex flex-col col-span-1">
            <label  className="block  text-xs font-medium  text-white">Data do Falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Local do Falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Hora do falecimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>

        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Hora da Solicitação</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
      
        <div className="flex flex-col col-span-3 ">
            <label  className="block  text-xs font-medium  text-white">Laudo Médico (Causa Morte)</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Número da D.O.</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Nome do Médico</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">CRM</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
    
     
        <div className="flex flex-row gap-x-4 col-span-1 ">
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Data Sepultamento</label>
            <input  className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div>
            <div className="flex flex-col">
            <label  className="block  text-xs font-medium  text-white">Hora Sepultamento</label>
            <input  className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
            </div> 
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Tipo</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        </div>}




    </div>
        </div>
        </>
    )
}