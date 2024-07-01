import { useState } from "react"
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import React from 'react';
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
}


export default function ConsultarGanhadores({setarDataSorteio,dataSorteio,arrayGanhadores,listarGanhadores}:DataProps){
   
  
    return (
        <div className="text-white">
      {//dadosPremio.openModal &&   <ModalNovoPremio cadastroPremio={cadastroPremio} setarDadosPremios={setarDadosPremios} dadosPremio={dadosPremio}/>
      }
       
             <ul className="flex flex-col w-full p-2 mt-1 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                    <span className="flex w-full font-semibold">GANHADOR</span>
                      <span className="flex w-full font-semibold">PRÊMIO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">ENDERECO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">BAIRRO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">STATUS</span>
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
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.endereco}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.bairro}</span>
                            <span className="flex w-full text-start whitespace-nowrap text-yellow-500 font-semibold">{item.status}</span>
                            <div className="inline-flex w-full text-start justify-end whitespace-nowrap">
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