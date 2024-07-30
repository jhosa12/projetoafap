


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
import { start } from "repl";
// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)


interface DadosProps{
    id_med:number,
    espec:string,
    nome:string,
    image:string
  
}
interface EventProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date,
    end:Date,
    title:string
    status: string

}
1

export default function Agenda(){
    const [medicos,setMedicos]=useState<Array<DadosProps>>([])
    const [events,setEvents]=useState<Array<Partial<EventProps>>>([])
    const [isOpen, setIsOpen] = useState(false);
    const [dataEvent,setDataEvent]= useState<Partial<EventProps>>({})

  const components:any ={
      event:({event}:{event:EventProps})=>{
        if(event.status==='CANCELADO') return <div className="flex rounded-md flex-col  items-center text-white border-[3px] border-blue-600 h-full pt-1 bg-red-600">
          <span className="whitespace-nowrap">{event.title}</span>
       
          </div>
             if(event.status==='ADIADO') return <div className="flex flex-col rounded-md  items-center text-white border-[3px] border-blue-600 h-full pt-1 bg-yellow-600">
                 <span>{event.title}</span>
             </div>

else return <div className="flex flex-col  items-center rounded-md  text-white border-[3px] border-blue-600 h-full pt-1 bg-green-600">
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

    
    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };


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

        const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
               setDataEvent({start,end})  
               toggleDrawer()
          


        },[setEvents])




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
      selected={true}
     style={{ height: 'calc(100vh - 68px)' }}
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