
import { IoMdSearch } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';
import {ModalBusca} from '../../components/modal'
import Teste from '@/pages/teste/index';
import { useState } from "react";
import { ClassNames } from "@emotion/react";
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
        <div className={`flex  flex-col w-full pl-4` }>
            <div className="flex  flex-row justify-start gap-2 items-center w-full">
            <button onClick={()=>updateFields({closeModal:!modalbusca.closeModal})} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 me-2 mb-2">
            <IoMdSearch size={20}/>
        Buscar Cliente
    </button>
               
              
            </div>


<div className="w-11/12   border  rounded-lg shadow bg-gray-800 border-gray-700">
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
    </ul>
    <div >
     {dados && (<div className={`p-4  rounded-lg md:p-8 bg-gray-800 ${dados? "":''}`}>
            <h2 className="flex flex-row gap-3 mb-3 text-xl font-extrabold tracking-tight text-white">001-JOSÉ HENRIQUE BATISTA DE FREITAS <span>PLANO:<span className="pl-3 text-[#c5942b]">GOLD PRIME 5</span></span></h2>
          <div className="flex w-full flex-row gap-2">
            <div className="flex flex-col  p-4  border  rounded-lg shadow bg-gray-800 border-gray-700">
 
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
    <h5 className="mb-1 flex flex-row justify-between gap-2  tracking-tight  text-white">
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">CATEGORIA: </span>GOLD PRIME 5</p>
            <p className="mb-1 font-normal text-gray-400"><span className="text-white font-semibold">VALOR: </span>R$ 39,00</p>
         </h5>
 

</div>
    </div>  
        </div>)}
        {historico && (<div className="p-4 rounded-lg md:p-8 bg-gray-800" id="services" role="tabpanel" aria-labelledby="services-tab">
           

<div className="flex overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead className="text-xs  uppercase  bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    NUMERO DA PARCELA
                </th>
                <th scope="col" className="px-6 py-3">
                    DATA VENC.
                </th>
                <th scope="col" className="px-6 py-3">
                    DATA AGENDADA
                </th>
                <th scope="col" className="px-6 py-3">
                    VALOR
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
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className=" border-b bg-gray-800 border-gray-700  hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    $1999
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
            <tr className=" bg-gray-800 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">
                    Magic Mouse 2
                </th>
                <td className="px-6 py-4">
                    Black
                </td>
                <td className="px-6 py-4">
                    Accessories
                </td>
                <td className="px-6 py-4">
                    $99
                </td>
                <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium  text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-3 text-base">Total</th>
                <td className="px-6 py-3">3</td>
                <td className="px-6 py-3">21,000</td>
            </tr>
        </tfoot>
    </table>
</div>

        </div>)}
        {dependentes && (<div className=" p-4  rounded-lg md:p-8 bg-gray-800" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
            <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto  sm:grid-cols-3 xl:grid-cols-6 text-white sm:p-8">
                <div className="flex flex-col">
                    <dt className="mb-2 text-3xl font-extrabold">73M+</dt>
                    <dd className="text-gray-400">Developers</dd>
                </div>
                <div className="flex flex-col">
                    <dt className="mb-2 text-3xl font-extrabold">100M+</dt>
                    <dd className="text-gray-400">Public repositories</dd>
                </div>
                <div className="flex flex-col">
                    <dt className="mb-2 text-3xl font-extrabold">1000s</dt>
                    <dd className="text-gray-400">Open source projects</dd>
                </div>
            </dl>
        </div>)}
    </div>
</div>


           
        </div>
        
        </>
    )

}
