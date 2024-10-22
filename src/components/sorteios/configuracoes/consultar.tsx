import { useState } from "react"
import { MdDelete } from "react-icons/md";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoIosArrowDown } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import React from 'react';
import PrintButton from "@/Documents/sorteados/PrintButton";
interface GanhadoresProps{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
}
interface DataProps{
    dataSorteio:Date,
    setarDataSorteio:(data:Date)=>void,
    arrayGanhadores:Array<Partial<GanhadoresProps>>
    listarGanhadores:()=>Promise<void>
    loading:boolean,
    
}


export default function ConsultarGanhadores({setarDataSorteio,dataSorteio,arrayGanhadores,listarGanhadores,loading}:DataProps){

  
  
    return (
        <div className="text-white">
      {//dadosPremio.openModal &&   <ModalNovoPremio cadastroPremio={cadastroPremio} setarDadosPremios={setarDadosPremios} dadosPremio={dadosPremio}/>
      }
       <div className="flex  w-full bg-[#2b2e3b] px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-700 border p-1 rounded-lg border-gray-600" >FILTROS</label>


              <div className="flex h-full relative w-1/4">
                <div onClick={() => {}}
                  className="flex w-full h-full justify-between items-center py-1.5 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

              
                  <IoIosArrowDown />


                </div>

                {/* <ul className="absolute  top-7 -left-1 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => {}} type="checkbox" checked />
                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS</label>
                  </li>
                  {arrayGanhadores.map((item, index) => {
                    return (
                      <li className="flex items-center px-2 py-1">
                        <input onChange={() => {}} type="checkbox" checked value={''} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item?.premio?.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>*/}



              </div>



              <div className="inline-flex  items-center  gap-3">
               
                <DatePicker
                placeholderText="DATA SORTEIO"
                 // disabled
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                 selected={dataSorteio}
                  onChange={(date) => date && setarDataSorteio(date)}
                  selectsStart
                 // startDate={startDate}
                 // endDate={endDate}
                  className="flex py-1 pl-2 text-xs  border rounded-lg   bg-gray-700 border-gray-600  text-white"
                />
             

           

              </div>
              {!loading ? <button onClick={listarGanhadores} className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCAR<IoSearch size={18} /></button> :
                <button className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCANDO..<AiOutlineLoading3Quarters size={20} className="animate-spin" /></button>
              }
              <PrintButton winners={arrayGanhadores}/>
            </div>
       
             <ul className="flex flex-col w-full p-2 mt-1 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                    <span className="flex w-full font-semibold">GANHADOR</span>
                      <span className="flex w-full font-semibold">PRÊMIO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">ENDERECO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">BAIRRO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">STATUS</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA SORTEIO</span>
                      <span className="flex w-full text-start whitespace-nowrap justify-end ">AÇÕES</span>
                    </div>
                  </div>
                </li>
                {
                  arrayGanhadores?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                          <span className="flex w-full font-semibold">{item.titular}º</span>
                            <span className="flex w-full font-semibold">{item.premio}</span>
                            <span className="flex w-full text-start  font-semibold">{item.endereco} Nº {item.numero}</span>
                            <span className="flex w-full text-start  font-semibold">{item.bairro}</span>
                            <span className="flex w-full text-start  text-yellow-500 font-semibold">{item.status}</span>
                            <span className="flex w-full text-start  font-semibold">{item.data_sorteio && new Date(item.data_sorteio).toLocaleDateString()}</span>
                            <div className="inline-flex w-full text-start justify-end">
                              <button onClick={() => { }} className="rounded-lg text-red-600 hover:bg-gray-300 p-1"><MdDelete size={18} /></button>
                              <button className="rounded-lg text-blue-500 hover:bg-gray-300 p-1"><MdModeEditOutline size={18} /></button>
                            
                           
                            </div>

                          </div>
                        </div>

                      </li>
                    )
                  })
                }
              </ul>
            
        </div>
    )
}