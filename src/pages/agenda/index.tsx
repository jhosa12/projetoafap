


import { MdDelete, MdEdit } from "react-icons/md";
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import imag from "../../../public/carne.png"

import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { Drawer } from "@/components/agenda/drawer";
import Calendario from "@/components/agenda/calendario";
import AdmMedico from "@/components/agenda/admMedico";

// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)


export interface MedicoProps{
    id_med:number,
    espec:string,
    nome:string,
    sobre:string,
    file:File|undefined,
    imageUrl:string,
    tmpUrl:string,
    funeraria:number,
    particular:number,
    plano:number
}
export interface EventProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date,
    end:Date,
    title:string
    status: string,
    obs:string

}


export default function Agenda(){
    const [medicos,setMedicos]=useState<Array<MedicoProps>>([])
    const [events,setEvents]=useState<Array<Partial<EventProps>>>([])
    const [isOpen, setIsOpen] = useState(false);
    const [dataEvent,setDataEvent]= useState<Partial<EventProps>>({})
    const [menuIndex, setMenuIndex] = useState(1)



    const setArrayMedicos =(array:Array<MedicoProps>)=>{
      setMedicos(array)
    }

  const components:any ={
      event:({event}:{event:EventProps})=>{
        if(event.status==='C') return <div className="flex rounded-md flex-col  items-center text-white   h-full pt-1 bg-red-600">
          <span className="whitespace-nowrap">{event.title}</span>
       
          </div>
             if(event.status==='AD') return <div className="flex flex-col rounded-md  items-center text-white   h-full pt-1 bg-yellow-500">
                 <span>{event.title}</span>
             </div>

else return <div className="flex flex-col  items-center rounded-md  text-white   h-full pt-1 bg-green-600">
<span>{event.title}</span>
</div>
      }
  }


  const setarDataEvento =(fields:Partial<EventProps>)=>{
    setDataEvent((prev:Partial<EventProps>)=>{

      if(prev){
        return {...prev,...fields}
      }
      else return {...fields}

    })
  }

  const setArrayEvent =(array:Array<Partial<EventProps>>)=>{
    setEvents(array)
  }

    
 /*   const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };*/


   useEffect(() => {
        getMedicos()
        agenda()
      }, [])


      async function agenda() {
        try {
          const response = await api.get("/agenda/listaEventos")
            const novoArray =response.data.map((item:EventProps)=>{return{...item,start:new Date(item.start),end:new Date(item.end)}})
          setEvents(novoArray)
    
    
        } catch (error) {
          toast.error('ERRO NA REQUISIÇÃO')
    
        }
        
      }
    
      async function getMedicos() {
        try {
          const response = await api.get("/medico/lista")
    
          setMedicos(response.data)
    
    
        } catch (error) {
          toast.error('ERRO NA REQUISIÇÃO')
    
        }
    
      }

    /*    const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
               setDataEvent({start,end})  
               toggleDrawer()
          


        },[setEvents])*/




    return(
    <>
     <div className="flex flex-col px-4 w-full text-white">
    <ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Agenda</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(2)} className={`inline-block p-2 border-blue-600  hover:border-b-[1px]  rounded-t-lg   hover:text-gray-300  `}>Médicos</button>
            </li>
          
         

          </ul>

          {menuIndex===1 && <Calendario setarDataEvento={setarDataEvento} dataEvent={dataEvent} events={events} medicos={medicos} setArrayEvent={setArrayEvent}/> }
          {menuIndex===2 && <AdmMedico  setArray={setArrayMedicos} medicos={medicos}/> }

    </div>
   
          </>
    )
}