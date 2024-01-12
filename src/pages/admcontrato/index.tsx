
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import {ModalBusca} from '../../components/modal'
import Teste from '@/pages/teste/index';
import { useState } from "react";
import { ClassNames } from "@emotion/react";
import { RiFileAddLine } from "react-icons/ri";

type FormData={
    closeModal:boolean,
    nome:string
}
const INITIAL_DATA:FormData ={
    closeModal:false,
    nome:''
}
export default function AdmContrato(){
  const [textarea,setTextArea] = useState(true)
  const [modalbusca,setModalBusca] = useState(INITIAL_DATA)
  const [modalplano,setModalPlano] = useState(false)
  const [dados,setDados] =useState(true)
  const [historico,setHistorico] = useState(false)
  const [dependentes,setDependentes] =useState(false)
 
 

  
  function updateFields(fields:Partial<FormData>){
    setModalBusca(prev=>{
        return {...prev,...fields}
    })
  }
    return(
        <>
        {modalbusca.closeModal && (<ModalBusca {...modalbusca} updateFields={updateFields}/>)}
        {modalplano && (<Teste/>)}
        <div className="flex  flex-col w-full pl-4">
            <div className="flex  flex-row justify-start gap-2 items-center w-full mb-4">
            <button onClick={()=>updateFields({closeModal:!modalbusca.closeModal})} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <IoMdSearch size={20}/>
        Buscar Cliente
    </button>
               
    <button type="button" onClick={()=>setModalPlano(true)} className="text-white gap-1  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center bg-[#c5942b] hover:bg-[#c5942ba9] focus:ring-blue-800">
    Add Plano
    <RiFileAddLine size={20} />
    </button>
            </div>


<div className="w-11/12  border  rounded-lg shadow bg-gray-800 border-gray-700">
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
     {dados && (<div className={`p-4  rounded-lg md:p-8 bg-gray-800 ${dados? "":''}`}>
            <h2 className="flex flex-row gap-3 mb-3 text-xl font-extrabold tracking-tight text-white">001-JOSÉ HENRIQUE BATISTA DE FREITAS <span>PLANO:<span className="pl-3 text-[#c5942b]">GOLD PRIME 5</span></span></h2>
          <div className="flex w-full flex-row gap-2">
           
            <div className="flex flex-col  p-4  border  rounded-lg shadow bg-gray-800 border-gray-700">
            <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO TITULAR</h2>
 
        <h5 className="mb-1 flex flex-row justify-between  gap-2 font-semibold tracking-tight  text-white">
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ENDEREÇO: </span>AGROVILA UBALDINHO</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">Nº: </span>22</p>
        <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">BAIRRO: </span>UBALDINHO</p>
        </h5>
        <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">PONTO REF: </span>PROXIMO AO CENTRO</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CIDADE: </span>VARZEA ALEGRE/CE</p>
         </h5>
    </div>
    <div className="flex flex-col p-4  border  rounded-lg shadow bg-gray-800 border-gray-700">
    <h2 className="text-sm font-semibold mb-4  text-gray-500">DADOS  DO PLANO</h2>
    <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CATEGORIA: </span>GOLD PRIME 5</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">VALOR: </span>R$ 39,00</p>
         </h5>
         <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">ADESÃO: </span>25/01/2024</p>
            <p className="mb-1 font-normal text-red-600"><span className="text-white font-semibold">CARÊNCIA: </span>25/03/2024</p>
         </h5>
 

</div>
    </div>  
        </div>)}
        {historico && (
           
<div className="flex  rounded-lg  overflow-y-auto w-full max-h-96  p-3   shadow-md sm:rounded-lg">
    <table 
     className="w-full text-sm text-left rtl:text-right overflow-y-auto   rounded-lg  text-gray-400 ">
        <thead className=" w-full text-xs  uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className=" px-6 py-3">
                    NP
                </th>
                <th scope="col" className="px-6 py-3">
                    DATA VENC.
                </th>
                <th scope="col" className="px-6 py-3">
                    DATA AGEND.
                </th>
                <th scope="col" className="px-8 py-3">
                    VALOR
                </th>
                <th scope="col" className="px-6 py-3">
                    status
                </th>
                <th scope="col" className="px-6 py-3">
                    BAIXADA POR
                </th>
                <th scope="col" className="px-6 py-3">
                    AGENDADA POR
                </th>
                
                <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    1
                </th>
                <td className="px-6 py-4">
                    25/01/2024
                </td>
                <td className="px-6 py-4">
                25/01/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    2
                </th>
                <td className="px-6 py-4">
                    25/02/2024
                </td>
                <td className="px-6 py-4">
                    25/02/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    3
                </th>
                <td className="px-6 py-4">
                    25/03/2024
                </td>
                <td className="px-6 py-4">
                    25/03/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    4
                </th>
                <td className="px-6 py-4">
                    25/04/2024
                </td>
                <td className="px-6 py-4">
                    25/04/2024
                </td>
                <td className="px-6 py-4">
                    R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    5
                </th>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    6
                </th>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                A
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            <tr  className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    7
                </th>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>

            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    8
                </th>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    8
                </th>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                    25/05/2024
                </td>
                <td className="px-6 py-4">
                R$ 39,00
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4">
                
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            
        
            
        </tbody>
    
    </table>
</div>

        )}
        {dependentes && (<div className="flex rounded-lg  overflow-y-auto w-full max-h-96  p-3   shadow-md sm:rounded-lg">
    <table 
     className="w-full text-sm text-left rtl:text-right overflow-y-auto   rounded-lg  text-gray-400 ">
        <thead className=" w-full text-xs  uppercase bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className=" px-6 py-3">
                    NOME
                </th>
                <th scope="col" className="px-6 py-3">
                    ADESÃO
                </th>
                <th scope="col" className="px-6 py-3">
                    CARÊNCIA
                </th>
                <th scope="col" className="px-8 py-3">
                    NASC.
                </th>
                <th scope="col" className="px-6 py-3">
                    PARENTESCO
                </th> 
                <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    MARCOS ANTONIO BATISTA DE FREITAS
                </th>
                <td className="px-6 py-4">
                    25/01/2024
                </td>
                <td className="px-6 py-4">
                25/01/2024
                </td>
                <td className="px-6 py-4">
                25/01/2024
                </td>
                <td className="px-6 py-4">
                IRMÃO
                </td>
              
                
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    PEDRO DANIEL DA SILVA
                </th>
                <td className="px-6 py-4">
                    25/02/2024
                </td>
                <td className="px-6 py-4">
                    25/02/2024
                </td>
                <td className="px-6 py-4">
                25/02/2024
                </td>
                <td className="px-6 py-4">
                PRIMO
                </td>
                
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    JOSE HENRIQUE BATISTA DE FREITAS
                </th>
                <td className="px-6 py-4">
                    25/03/2024
                </td>
                <td className="px-6 py-4">
                    25/03/2024
                </td>
                <td className="px-6 py-4">
                25/03/2024
                </td>
                <td className="px-6 py-4">
                SOBRINHO
                </td>
               
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
               
            </tr>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    MARIA DAS GRAÇAS
                </th>
                <td className="px-6 py-4">
                    25/04/2024
                </td>
                <td className="px-6 py-4">
                    25/04/2024
                </td>
                <td className="px-6 py-4">
                25/04/2024
                </td>
                <td className="px-6 py-4">
                AMIGA
                </td>
                
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
        
        </tbody>
    
    </table>
</div>)}
    </div>
</div>


           
        </div>
        
        </>
    )

}
