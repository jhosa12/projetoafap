
import { api } from "@/services/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";




export default function GerarOS(){
    
    const {usuario}= useContext(AuthContext)

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
            <button  type="button" onClick={()=>{}}   className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Falecido</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}    className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Declarante</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Dados do Óbito</button>
        </li>
        <li className="me-2">
            <button type="button" onClick={()=>{}}   className="inline-block p-4   hover:bg-gray-700 hover:text-gray-300">Produtos e Serviços</button>
        </li>
    </ul>
    <div className="rounded-lg p-4 grid grid-flow-row-dense grid-cols-4 gap-3">
    <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Nome do Falecido</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Data Nascimento</label>
            <input  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{}</input>
        </div>
        <div className="flex flex-col col-span-1 ">
            <label  className="block  text-xs font-medium  text-white">Religião</label>
            <select  className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
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
        </div>
    </div>
            

        </div>
        </>
    )
}