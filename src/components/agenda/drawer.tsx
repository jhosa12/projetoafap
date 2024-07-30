import { MdEvent } from "react-icons/md";
import { DropDown } from "./dropDown";
import DatePicker from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";

interface DadosProps{
    id_med:number,
    espec:string,
    nome:string,
    image:string
   
}
interface EventoProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date
    end:Date
    title:string
    status: string
}
interface DrawerProps{
    isOpen:boolean,
    toggleDrawer:()=>void
    arrayMedicos:Array<DadosProps>
    setarDataEvent :(fields:Partial<EventoProps>)=>void
    dataEvent:Partial<EventoProps>
    setArrayEvent:(array:Array<Partial<EventoProps>>)=>void
    events:Array<Partial<EventoProps>>
}


export function Drawer({events,setArrayEvent,isOpen,toggleDrawer,arrayMedicos,setarDataEvent,dataEvent}:DrawerProps){
   
  
  const novoEvento=async()=>{
        try {
          const evento =await toast.promise(
            api.post("/agenda/novoEvento",{
        
              id_med:1,
              data:new Date(),
              start:dataEvent.start,
              end:dataEvent.end,
              title:dataEvent.title,
              status: 'CANCELADO'
          
            }),
          {
            error:'Erro na requisição',
            pending:'Gerando Evento..',
            success:'Evento Gerado com sucesso'
          }          
        
        )
          const novo= [...events]
          novo.push(evento.data)
          const ed = novo.map(item =>{return {...item,start:item.start ? new Date(item.start):new Date(),end:item.end?new Date(item.end):new Date()}})
          setArrayEvent(ed)
        } catch (error) {
            toast.error('Erro ao gerar evento')
        }
  }
    

    return(
        
        <div  className="fixed z-10 flex w-full h-[100vh] ">
       
  
        <div className={`fixed flex flex-col top-0 gap-8 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-white w-2/5 dark:bg-gray-800`} aria-labelledby="drawer-label">
        <h5 id="drawer-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
         <MdEvent size={40}/>
          NOVO EVENTO
        </h5>
     
        
        <DropDown setarDataEvent={setarDataEvent} dataEvent={dataEvent} array={arrayMedicos}/>
        <div className="inline-flex w-full justify-between gap-4">
        <div className="flex flex-col w-1/2">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA INICIAL</label>
          <DatePicker
        className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
        selected={dataEvent.start}
        onChange={(e)=>e && setarDataEvent({...dataEvent,start:e})}
        timeInputLabel="Hora:"
        dateFormat="dd/MM/yyyy h:mm aa"
        showTimeInput
        locale={pt}
        />
          </div>

          <div className="flex flex-col w-1/2">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA FINAL</label>
          <DatePicker
        className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
        selected={dataEvent.end}
        onChange={(e)=>e && setarDataEvent({...dataEvent,end:e})}
        timeInputLabel="Hora:"
        dateFormat="dd/MM/yyyy h:mm aa"
        showTimeInput
        locale={pt}
        
        />
          </div>

        </div>
        
    <div>
    <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">OBSERVAÇÃO</label>
    <textarea  rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
      
      </div>   


        
        <div className="inline-flex w-full h-full justify-end items-end  gap-4">
          <button onClick={toggleDrawer} className="flex w-1/2 h-fit px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cencelar</button>
          <button onClick={()=>novoEvento()} className="flex w-1/2 h-fit items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Salvar Evento<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg></button>
        </div>
      </div>
      </div>

    )
}