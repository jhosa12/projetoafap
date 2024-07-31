


import { MdDelete, MdEdit } from "react-icons/md";
import { BiSolidLockOpenAlt } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { Drawer } from "@/components/agenda/drawer";

// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)


interface MedicoProps{
    id_med:number,
    espec:string,
    nome:string,
    image:{
      type: string;
      data: number[];
    }
  
}
interface EventProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date,
    end:Date,
    title:string
    status: string,
    obs:string

}
interface DataProps{
  medicos:Array<MedicoProps>
  events:Array<Partial<EventProps>>
  setArrayEvent:(array:Array<Partial<EventProps>>)=>void
  dataEvent:Partial<EventProps>
  setarDataEvento:(fields:Partial<EventProps>)=>void
}

export default function Calendario({medicos,events,setArrayEvent,dataEvent,setarDataEvento}:DataProps){
  
    
    const [isOpen, setIsOpen] = useState(false);


  const components:any ={
      event:({event}:{event:EventProps})=>{
         return <div className={`flex rounded-md flex-col  items-center text-white   h-full pt-1 ${event.status==='C'?"bg-red-600":event.status==='AB'?"bg-green-600":"bg-yellow-500"}`}>
          <span className="whitespace-nowrap">{event.title}</span>
          <span >{event.obs}</span>
       
          </div>
         

      }
  }


const handleEventClick =(event:Partial<EventProps>)=>{
    console.log(event)
}

    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };


        const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
               setarDataEvento({start,end})  
               toggleDrawer()
          


        },[setArrayEvent])




    return(
    <>
   <div>


    {isOpen && <Drawer setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent} setarDataEvent={setarDataEvento} arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer}/>}
    <Calendar
      localizer={localizer}
      events={events}
      components={components}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={handleNovoEvento}
      onSelectEvent={handleEventClick}
      selected={true}
     style={{ height: 'calc(100vh - 108px)' }}
      messages={{
        next: "Próximo",
        previous: "Anterior",
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia",
        agenda: "Agenda",
        date: "Data",
        time: "Hora",
        event: "Evento"
      }}
    />
  </div>
    {/*    <div className="p-4">
        <div className="flex flex-col w-full border  rounded-lg shadow  border-gray-700 max-h-[calc(100vh-100px)] ">
        <div className="text-gray-300 bg-gray-800 rounded-t-lg inline-flex items-center p-2 justify-between   ">
            <h1 className=" text-lg  pl-3 font-medium">Agenda Consultas</h1>
            <div id="divFiltro" className="inline-flex gap-4">
            <div>
  <label  className="block mb-1 text-xs font-medium  text-white">DATA INICIAL</label>
  <DatePicker selected={new Date()} onChange={()=>{}}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
  </div>
  <div>
  <label  className="block mb-1 text-xs font-medium  text-white">DATA FINAL</label>
  <DatePicker selected={new Date} onChange={()=>{}}  dateFormat={"dd/MM/yyyy"} locale={pt}   required className="block uppercase w-full py-[5px] pr-2 pl-2 sm:text-xs  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>
  </div>
  <div className="flex flex-col w-2/6">
          <label className="block mb-1 text-xs font-medium text-white">STATUS</label>
          <select defaultValue={''} onChange={()=>{}} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  text-xs  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
            <option value={['A','R']} selected>ABERTO/REAGENDADO</option>
            <option value={['A']} selected>ABERTO</option>
            <option value={['R']} selected>REAGENDADO</option>
           
          </select>
        </div>
      
        </div>
        </div>
        <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)] text-white">

<ul className="flex flex-col w-full p-2 gap-1 text-sm">
  <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
    <div className="inline-flex w-full items-center">
      <span className="flex w-72 me-2 justify-center font-semibold">#</span>
      <span className="flex w-full text-start font-semibold">MEDICO</span>
      <span className="flex w-full text-start whitespace-nowrap ">ESPECIALIDADE</span>
      <span className="flex w-full   "></span>
      <span className="flex w-full justify-end  "></span>

    </div>
  </li>
  {
    medicos?.map((item, index) => {


      return (
        <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
          <div className="inline-flex w-full items-center">
          
            <span className="flex w-72 me-2 text-start justify-center font-semibold">
              {item.image && <img className="w-[46px] h-[46px] rounded-full" src={`data:image/jpeg;base64,${item.image}`} alt="Rounded avatar"></img>}</span>
            <span className="flex w-full text-start font-semibold">{item?.nome}</span>
            <span className="flex w-full text-start font-semibold">{item.espec}</span>
            <span className="flex w-full text-start font-semibold">{''}</span>
          
        
            <div className="flex w-full justify-end gap-2 ">
              <button onClick={() => {
             
             
              }}
                className="hover:bg-gray-500 p-1 text-blue-500 rounded-lg ">
                <MdEdit size={17} />
              </button>
              <button className="hover:bg-gray-500 p-1 rounded-lg text-red-500 ">
                <MdDelete size={17} />
              </button>
            </div>


          </div>
          <ul >
   
            {item.agenda.map(atual=>(
                <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
          <div className="inline-flex w-full items-center">
          <span className="flex w-72 me-2 text-start justify-center font-semibold">{''}</span>
            <span className="flex w-full text-start font-semibold">{new Date(atual.data).toLocaleDateString()}</span>
            <span className="flex w-full text-start ">{''}</span>
            <div className="flex w-full justify-end gap-2 ">
              <button onClick={() => {
             
             
              }}
                className="hover:bg-gray-500 p-1 text-blue-500 rounded-lg ">
                <MdEdit size={17} />
              </button>
              <button className="hover:bg-gray-500 p-1 rounded-lg text-red-500 ">
                <MdDelete size={17} />
              </button>
            </div>
                
                 </div>
                 </li>
            ))}
          </ul>

        </li>
      )
    })
  }
</ul>

</div>





        </div>
        


        </div>*/}
          </>
    )
}