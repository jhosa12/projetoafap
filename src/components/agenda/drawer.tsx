import { MdEvent } from "react-icons/md";
import { DropDown } from "./dropDown";
import DatePicker from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import 'react-datepicker/dist/react-datepicker.css';
import { MdDelete } from "react-icons/md";
import { MedicoProps } from "@/pages/agenda";
interface EventoProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date
    end:Date
    title:string
    status: string,
    obs:string
}
interface DrawerProps{
    isOpen:boolean,
    toggleDrawer:()=>void
    arrayMedicos:Array<MedicoProps>
    setarDataEvent :(fields:Partial<EventoProps>)=>void
    dataEvent:Partial<EventoProps>
    setArrayEvent:(array:Array<Partial<EventoProps>>)=>void
    events:Array<Partial<EventoProps>>
}


export function Drawer({events,setArrayEvent,isOpen,toggleDrawer,arrayMedicos,setarDataEvent,dataEvent}:DrawerProps){
   
  

  async function deletarEvento() {
      if(!dataEvent.id_ag){
        toggleDrawer();
        return;
      }
  
    try {
    const novo =  await toast.promise(
      api.delete(`/agenda/deletarEvento/${dataEvent.id_ag}`),
      {error:'Erro ao salvar dados',
          pending:'Salvando novos dados...',
          success:'Dados salvos com sucesso!'
      }
    )
    
    const novoArray = [...events]
    const index = novoArray.findIndex(item=>item.id_ag===dataEvent.id_ag)
    novoArray.splice(index,1)
    setArrayEvent(novoArray)
    toggleDrawer()
    } catch (error) {
      toast.error('erro na requisição')
    }
    
    }








  const novoEvento=async()=>{

    if(!dataEvent.status ||!dataEvent.id_med||!dataEvent.id_med||!dataEvent.title){
      toast.info('Preencha todos os campos obrigatorios!')
      return;
    }
        try {
          const evento =await toast.promise(
            api.post("/agenda/novoEvento",{
        
              id_med:Number(dataEvent.id_med),
              data:new Date(),
              start:dataEvent.start,
              end:dataEvent.end,
              title:dataEvent.title,
              status: dataEvent.status,
              obs:dataEvent.obs
          
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
          toggleDrawer()
        } catch (error) {
            toast.error('Erro ao gerar evento')
        }
  }

  const editarEvento=async()=>{
    if(!dataEvent.status ||!dataEvent.id_med||!dataEvent.id_med||!dataEvent.title){
      toast.info('Preencha todos os campos obrigatorios!')
      return;
    }
    try {
      const evento =await toast.promise(
        api.put("/agenda/editarEvento",{
          id_ag:Number(dataEvent.id_ag),
          id_med:Number(dataEvent.id_med),
          start:dataEvent.start,
          end:dataEvent.end,
          title:dataEvent.title,
          status: dataEvent.status,
          obs:dataEvent.obs
      
        }),
      {
        error:'Erro na requisição',
        pending:'Gerando Evento..',
        success:'Evento Gerado com sucesso'
      }          
    
    )
      const novo= [...events]
      const index = novo.findIndex(item=>item.id_ag===dataEvent.id_ag)
      novo[index] = {...evento.data}
      const ed = novo.map(item =>{return {...item,start:item.start ? new Date(item.start):new Date(),end:item.end?new Date(item.end):new Date()}})
      setArrayEvent(ed)
      toggleDrawer()
    } catch (error) {
        toast.error('Erro ao gerar evento')
    }
}
    

    return(
        
        <div  className="fixed z-10 flex w-full h-[100vh] ">
        <div className={`fixed flex flex-col top-0 gap-8 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}  w-2/5 bg-gray-800`} aria-labelledby="drawer-label">

        <div id="drawer-label" className="inline-flex items-center justify-between mb-4 text-base font-semibold  text-gray-400">
          <div className="inline-flex items-center">
          <MdEvent size={40}/>
          NOVO EVENTO
          </div>
          <button onClick={deletarEvento} className="p-1 hover:bg-gray-600 rounded-lg"><MdDelete size={23}/></button>
        </div>
        <DropDown setarDataEvent={setarDataEvent} dataEvent={dataEvent} array={arrayMedicos}/>
        
<form className="w-full mx-auto">
  <label  className="block mb-2 text-sm font-medium  text-white">STATUS</label>
  <select defaultValue={dataEvent.status} onChange={e=>setarDataEvent({...dataEvent,status:e.target.value})} className=" border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ">
    <option selected>SELECIONE O STATUS</option>
    <option value="AB">ABERTO</option>
    <option value="C">CANCELADO</option>
    <option value="AD">ADIADO</option>
  </select>
</form>
        <div className="inline-flex w-full justify-between gap-4">
        <div className="flex flex-col w-1/2">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA INICIAL</label>
          <DatePicker
        className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center  border  rounded-lg focus:ring-4  bg-gray-700 hover:bg-gray-600  text-white border-gray-600"
        selected={dataEvent.start}
        onChange={(e)=>e && setarDataEvent({...dataEvent,start:e})}
        timeFormat="p"
           dateFormat="Pp"
        showTimeSelect
        locale={pt}
       
        />
          </div>

          <div className="flex flex-col w-1/2">
          <label  className="block mb-1 text-sm font-medium  text-white">DATA FINAL</label>
          <DatePicker
        className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-lg bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
        selected={dataEvent.end}
        onChange={(e)=>e && setarDataEvent({...dataEvent,end:e})}
      
          timeFormat="p"
           dateFormat="Pp"
      
        showTimeSelect
        locale={pt}
        
        />
          </div>

        </div>
        
    <div>
    <label  className="block mb-1 text-sm font-medium text-white">OBSERVAÇÃO</label>
    <textarea value={dataEvent.obs} onChange={e=>setarDataEvent({...dataEvent,obs:e.target.value})}  rows={4} className="block p-2.5 w-full text-sm rounded-lg border 0  bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Write your thoughts here..."></textarea>
      </div>   
        <div className="inline-flex w-full h-full justify-end items-end  gap-4">
          <button onClick={toggleDrawer} className="flex w-1/2 h-fit px-4 py-2 text-sm font-medium text-center  border rounded-lg bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700">Cancelar</button>
         {dataEvent.id_ag? <button onClick={()=>editarEvento()} className="flex w-1/2 h-fit items-center px-4 py-2 text-sm font-medium text-center text-white  rounded-lg   bg-yellow-500 hover:bg-yellow-600">Editar Evento<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg></button>: <button onClick={()=>novoEvento()} className="flex w-1/2 h-fit items-center px-4 py-2 text-sm font-medium text-center text-white  rounded-lg   bg-blue-600 hover:bg-blue-700  ">Salvar Evento<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg></button>}
        </div>
      </div>
      </div>

    )
}