
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Teste from '@/pages/teste/index'
import { useState } from "react";
export default function AdmContrato(){
  const [textarea,setTextArea] = useState(true)
    return(
        <div className={`flex  flex-col w-full h-[100vh]` }>
          
            <div className="flex  flex-row justify-start gap-2 items-center w-11/12 h-[60px] pt-5 pl-5 ">
                <button className="rounded-lg  bg-[#ca9629] text-white border-solid border-[1px] p-1 flex  justify-start items-center "><IoIosAddCircle size={22}/> Add </button>
                <select className="flex justify-center items-center h-[30px] rounded-md pl-1">
                    <option >Contrato</option>
                    <option>Nome Titular</option>
                    <option>Nome Dependente</option>
                    <option>Endereço</option>
                    <option>CPF</option>
                </select>
                <input placeholder="Busca" className="border-solid border-[1px] w-1/3 p-1 pl-3 rounded-lg"></input>
                <button className="flex rounded border-[1px] h-[30px] p-1 justify-center items-center bg-slate-500"><IoMdSearch color="white" size={25}/></button>
              
            </div>
            <div className="flex rounded-lg ml-3 pl-2 pt-1  pb-2 bg-white w-3/4">
                <Tabs defaultIndex={0}>
    <TabList>
      <Tab><span className="font-sans text-[14px] font-semibold">Dados do Titular</span></Tab>
      <Tab><span className="font-sans text-[14px] font-semibold">Histórico</span></Tab>
      <Tab><span className="font-sans text-[14px] font-semibold">Dados do Plano</span></Tab>
    </TabList>

    <TabPanel>
      <div className="flex flex-row w-full gap-1">
        <div className="flex flex-col rounded-md border-solid border-[1px] gap-2 border-gray-300 p-2 text-[14px]">
          <div className=" flex flex-row justify-between ">
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-sans" >Nome: José Henrique Batista de Freitas</span>
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-sans" >Nasc.: 27/05/1999</span>
          </div>

          <div className=" flex flex-row justify-between gap-1 ">
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-sans" >Endereço: Agrovila Ubaldinho da Silva</span>
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-sans" >Nº: 1122</span>
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-sans" >Bairro: Zona Rural de Cedro</span>
          </div>

          <div className=" flex flex-row gap-2 ">
          <span className="font-mono">Nome: </span>
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-mono" >José Henrique Batista de Freitas</span>
          <span className="font-mono">Nasc.: </span>
          <span className=" border-b-2 rounded-sm bg-gray-50 pl-1 pr-1 font-mono" >27/05/1999</span>
          </div>
    
        </div>
        <div className= "flex relative">
          <textarea placeholder="Observações Gerenciais" disabled={textarea} className=" border-[1px] text-[12px] p-2"></textarea>
          <button type="button" onClick={()=>setTextArea(prev=>!prev)} className="  absolute -top-1 right-[-10px] p-[0.05rem]"><FaEdit size={18} color="black"/></button>
        </div>

      </div>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 3</h2>
    </TabPanel>
  </Tabs>
                </div>
            
                {!textarea && (<Teste/>)}
        </div>
    )

}
