import { useContext, useEffect, useState } from "react";
import React from 'react';
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { FaRepeat } from "react-icons/fa6";
import { api } from "@/lib/axios/apiClient";
import { toast } from "react-toastify";
import  ModalPremio  from "../components/modalPremio";
import { Button } from "flowbite-react";
import { PremioProps } from "@/pages/dashboard/sorteio/configuracoes";
import { AuthContext } from "@/store/AuthContext";
import { ConveniadosProps } from "@/pages/dashboard/conveniados";




export default function CadastroPremio(){
 
    const [dadosPremio,setDadosPremio] =useState<Partial<PremioProps>>({})
    const [openModal, setOpenModal] = useState(false)
    const {empresas} = useContext(AuthContext)
    const [conveniados,setConveniados] = useState<Array<ConveniadosProps>>([])	
    const [arrayPremios,setArrayPremios]=useState<Array<Partial<PremioProps>>>([])


    async function listarPremios() {
      const response = await toast.promise(
           api.get('/sorteio/listarPremios'),
          {error:'Erro ao Requisitar Dados',
              pending:'Listando dados.....',
              success:'Dados Carregados'
          }
      )
      setArrayPremios(response.data)
  }

    const handleListarConveniados=async()=>{

      const response = await api.get('/conveniados/listar')
  

      setConveniados(response.data)
  }

useEffect(()=>{
  handleListarConveniados()
  listarPremios()
},[])


   

   
    return(
        <div className="flex flex-col w-full p-2 text-black">
         {openModal &&   <ModalPremio  arrayPremios={arrayPremios} setPremios={setArrayPremios} listarPremios={listarPremios} conveniados={conveniados} empresas={empresas} setModal={setOpenModal} setarDadosPremios={setDadosPremio} dadosPremio={dadosPremio}/>}
         <Button size={'sm'} className="ml-auto" onClick={()=>setOpenModal(true)} >ADICIONAR PRÊMIO</Button>
             <ul className="flex flex-col w-full p-2 mt-1 gap-1 text-sm font-bold max-h-[calc(100vh-180px)] overflow-y-auto">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                    <span className="flex w-full ">ORDEM DE SORTEIO</span>
                      <span className="flex w-full ">DESCRIÇÃO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">CONVENIADO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EMPRESA</span>
                      <span className="flex w-full text-start whitespace-nowrap justify-end ">AÇÕES</span>
                    </div>
                  </div>
                </li>
                {
                  arrayPremios?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-200" : "bg-slate-300"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                          <span className="flex w-full font-semibold">{index+1}º</span>
                            <span className="flex w-full font-semibold">{item.descricao}</span>
                            
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.conveniado}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{empresas.find(empresa => empresa.id === item.id_empresa)?.nome}</span>
                            <div className="inline-flex w-full text-start justify-end whitespace-nowrap">
                            <button className="rounded-lg hover:text-blue-500 text-gray-500 p-1"><MdModeEditOutline size={18} /></button>
                              <button onClick={() => { }} className="rounded-lg hover:text-red-600 text-gray-500 p-1"><MdDelete size={18} /></button>
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