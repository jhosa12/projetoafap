


import { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { MdDelete } from "react-icons/md";
import {  HiCalendar, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoIosAddCircle } from "react-icons/io";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/agendaMedico/drawer";
import { Timeline,Accordion,Button, Modal } from "flowbite-react";
import { EventProps, MedicoProps } from "@/pages/agenda";
import { MdAddBox } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)




interface DataProps{
  medicos:Array<MedicoProps>
  events:Array<EventProps>
  setArrayEvent:(array:Array<EventProps>)=>void
  dataEvent:Partial<EventProps>
  setarDataEvento:(fields:Partial<EventProps>)=>void
  deletarEvento:()=>Promise<void>
}

interface ObjectArrayMod{
  id_ag :number
  id_med:number
  id_usuario:number,
  data:Date
  start:Date,
  end:Date,
  title:string
  status: string,
  obs:string,
  clientes:Array<EventProps>

}



export default function Calendario({medicos,events,setArrayEvent,dataEvent,setarDataEvento,deletarEvento}:DataProps){
  
    
    const [isOpen, setIsOpen] = useState(false);
    const [modalDelete,setModalDel] = useState(false)





useEffect(()=>{

  if(events.length>0){
    const novoArray = events.reduce((acumulador,atual)=>{
      const itemExistente = acumulador.find(item=>item.id_med===atual.id_med)

      return acumulador
    },[] as Array<ObjectArrayMod>)
  }

},[events])


  const components:any ={
      event:({event,index}:{event:EventProps,index:number})=>{
          return(
            <Accordion  collapseAll onClick={(e) => e.stopPropagation()}  >
            <Accordion.Panel>
                <Accordion.Title  className="flex w-full border-green-500 bg-white text-cyan-700  border-l-8 py-2 focus:outline-none focus:ring-0 focus:ring-offset-0 "  >
                  <div className="inline-flex w-full items-center gap-8">
                  {event.status==='AB'?'ABERTO':event.status==='AD'?'ADIADO':'CANCELADO'} - {event.title}
                    <button className="hover:text-blue-600" onClick={(e)=>{e.stopPropagation()
                       setarDataEvento({...event,tipoAg:'ct',nome:'',celular:'',clientes:[],endereco:'',editar:false,id_agcli:undefined})
                       toggleDrawer()
                    }} >
        <MdAddBox size={26} />
    
      </button>
      <button onClick={()=>{
        setarDataEvento({...event,tipoAg:'md',id_agcli:undefined}),
        setModalDel(true)
      }} className="hover:text-red-600">
        <MdDelete size={26}/>
      </button>
                  </div>
                  <span className="text-sm">Clientes: {event?.clientes?.length}</span>
                  
                </Accordion.Title >
                <Accordion.Content>
      <Timeline theme={{item:{root:{vertical:'mb-1 ml-6 '},content:{body:{base:"mb-4 text-sm font-normal text-gray-500 dark:text-gray-400"},title:{base:"flex justify-between text-sm font-semibold text-gray-900 dark:text-white"}}}}}>
      {event?.clientes?.map((item,index)=>(
        <Timeline.Item  key={item.id_agcli}>
          <Timeline.Point icon={HiCalendar}/>
          <Timeline.Content>
          <Timeline.Time>{new Date(item.start).toLocaleDateString('pt-BR',{timeZone:'America/Fortaleza',weekday:'long',day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'})}</Timeline.Time>
          <Timeline.Title> 
            {item.nome}
             <button onClick={()=>handleEventClick({...item,tipoAg:'ct',id_med:event.id_med})} ><HiCalendar size={20} color="gray"/></button></Timeline.Title>
          <Timeline.Body>
            {item.endereco}
          </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      ))}
        </Timeline>
   
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
    
  
  
  )
         

      }
  }





const handleEventClick =(event:Partial<EventProps>)=>{
    setarDataEvento({...event})
    toggleDrawer()
}

    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };


        const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
               setarDataEvento({start,end,data:undefined,id_agmed:undefined,id_med:undefined,obs:'',status:'AB',title:'',celular:'',nome:'',tipoAg:'md',endereco:'',editar:true})  
               toggleDrawer()
        },[setArrayEvent])


    return(
    <>
   <div >


    <ModalDrawer deletarEvento={deletarEvento} setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent} setarDataEvent={setarDataEvento} arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer}/>
    <Calendar
      localizer={localizer}
      events={events.filter((item)=>item.tipoAg!=='tp')}
      components={components}
      startAccessor="start"
      endAccessor="end"
      selectable
     onSelectSlot={handleNovoEvento}
    // onSelectEvent={handleEventClick}
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

<Modal show={modalDelete} size="md" onClose={() => setModalDel(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Realmente deseja deletar esse agendamento?
              Todos os dados vinculados a ele também serão apagados
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => { setModalDel(false), deletarEvento()}}>
                {"Sim, tenho certeza"}
              </Button>
              <Button color="gray" onClick={() => setModalDel(false)}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
  <label  className="block mb-1  text-xs font-medium  text-white">DATA FINAL</label>
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