


import { useCallback, useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/tabs/afapSaude/agendaMedico/drawer";
import {  Button, Modal, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import ptBR from 'date-fns/locale/pt-BR';
import { format, parse, startOfWeek } from 'date-fns';
import { AuthContext } from "@/store/AuthContext";
import { getDay } from "date-fns";
import { api } from "@/lib/axios/apiClient";
import { LuCalendarCheck, LuCalendarClock, LuCalendarX } from "react-icons/lu";
import { EventProps, MedicoProps } from "@/types/afapSaude";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

const locales = {
  'pt-BR':ptBR,
} 


const colors ={
  failure: "border-red-500 bg-red-300 text-black ",
  success: "border-green-500 bg-green-200 text-black  ",
    warning: "border-yellow-500 bg-yellow-200 text-black  "
}

const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => format(date, formatStr, { locale: ptBR }),
  parse: (dateString: string, formatString: string) => parse(dateString, formatString, new Date(), { locale: ptBR }),
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

// Configura o moment para usar o idioma português

const eventPropGetter = (event: any) => {
  return {
    style: {
      backgroundColor: "transparent", // Remove a cor de fundo
      border: "none", // Opcional: Remove a borda do evento
      color: "#000", // Ajuste a cor do texto para melhor visualização
    
    },
  };
};



interface DataProps {
  medicos: Array<MedicoProps>
  events: Array<EventProps>
  setArrayEvent: (array: Array<EventProps>) => void
}

interface ObjectArrayMod {
  id_ag: number
  id_med: number
  id_usuario: number,
  data: Date
  start: Date,
  end: Date,
  title: string
  status: string,
  obs: string,
  clientes: Array<EventProps>
}

export default function Calendario({ medicos,events, setArrayEvent }: DataProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [modalDelete, setModalDel] = useState(false)
  const [dataEvent, setDataEvent] = useState<Partial<EventProps>>({})
  const [selectedDoctor, setSelectedDoctor] = useState<number>();




  const filteredEvents = selectedDoctor && selectedDoctor !== null
    ? events.filter(event => event.id_med === selectedDoctor)
    : events
  
 const deletarEvento = useCallback(async function () {
    if (!dataEvent.id_agmed) {
      setDataEvent({
        celular: '',
        data: new Date(),
        nome: '',
        endereco: '',
        status: '',
        obs: '',
        tipoAg: '',
        title: ''
      })
      setIsOpen(false);
      return;
    }

 


     
       toast.promise(
          api.delete(`/agenda/deletarEvento/${dataEvent.tipoAg}/${dataEvent.id_agmed}`),
          {
            error: 'Erro ao deletar dados',
            loading: 'Apagando dados...',
            success:()=> {
              const novoArray = [...events]
              const index = novoArray.findIndex(item => item.id_agmed === dataEvent.id_agmed)
              novoArray.splice(index, 1)
              setArrayEvent(novoArray)

              return'Dados deletados com sucesso!'}
          }
        )
    
      
 
  

  },[dataEvent.id_agmed,events])
 

 /* useEffect(() => {

    if (events.length > 0) {
      const novoArray = events.reduce((acumulador, atual) => {
        const itemExistente = acumulador.find(item => item.id_med === atual.id_med)

        return acumulador
      }, [] as Array<ObjectArrayMod>)
    }

  }, [events])
*/

  const components: any = {
    event: ({ event, index }: { event: EventProps, index: number }) => {
      const data = new Date()
      const eventDate = new Date(event.end)
      const verifyDate = data>eventDate
      return (
        <Alert theme={{color:colors,rounded:'rounded-sm',base:"flex  p-2 text-[11px]",icon:"mr-1 inline h-4 w-4 flex-shrink-0"}} className="text-[11px]" color={event.status === 'CANCELADO'?'failure':verifyDate?'success':'warning'}  icon={event.status === 'CANCELADO'?LuCalendarX :verifyDate?LuCalendarCheck :LuCalendarClock }>
      
            {event.title}
        </Alert>
      )
    },
    toolbar:(props:ToolbarProps)=>(
      <div className="rbc-toolbar flex items-center flex-wrap gap-4 px-2 justify-between">
      {/* Bloco de navegação (esquerda) */}
      <div className="flex items-center space-x-2 flex-1 text-xs">
        <button onClick={() => props.onNavigate('PREV')}>Anterior</button>
        <button onClick={() => props.onNavigate('TODAY')}>Hoje</button>
        <button onClick={() => props.onNavigate('NEXT')}>Próximo</button>
      </div>
    
      {/* Bloco do seletor (centro) */}
      <div className="w-64 text-xs">
  <select
    className="w-full h-8 appearance-none border border-gray-300 py-1 rounded-md px-4  pr-10 bg-white text-gray-700 focus:outline-none text-xs "
    defaultValue={''}
    onChange={(e) => setSelectedDoctor(parseInt(e.target.value))}
    value={selectedDoctor}
  >
    <option value={''}>
      Todos os Especialistas
    </option>
    {medicos.map((medico) => (
      <option key={medico.id_med} value={medico.id_med}>
        {medico.nome}
      </option>
    ))}
  </select>

  {/* Ícone da seta */}
 
</div>

    
      {/* Bloco de visualizações (direita) */}
      <div className="flex items-center space-x-2 flex-1 justify-end text-xs">
        <span className="uppercase font-semibold">{props.label}</span>
        <button onClick={() => props.onView('agenda')}>Agenda</button>
        <button onClick={() => props.onView('month')}>Mês</button>
        <button onClick={() => props.onView('week')}>Semana</button>
        <button onClick={() => props.onView('day')}>Dia</button>
      </div>
    </div>
    
    )
  }

  



  const handleEventClick = (event: Partial<EventProps>) => {
    setDataEvent({ ...event })
    toggleDrawer()
  } 

const toggleDrawer = () => {
  setIsOpen(!isOpen);
};  


  const handleNovoEvento = ({ start, end }: { start: Date, end: Date }) => {
    setDataEvent({ start, end, data: undefined, id_agmed: undefined, id_med: undefined, obs: '', status: 'AB', title: '', celular: '', nome: '', tipoAg: 'md', endereco: '', editar: true })
    toggleDrawer()
  }


  return (
   
      <div>

  
      <ModalDrawer deletarEvento={deletarEvento} setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent}  arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer} />
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          components={components}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventPropGetter}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleNovoEvento}
          selected={true}
          style={{ height: 'calc(100vh - 106px)'}}
          views={['month', 'week', 'day', 'agenda']}
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
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                Realmente deseja deletar esse agendamento?
                Todos os dados vinculados a ele também serão apagados
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => { setModalDel(false), deletarEvento() }}>
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
   
   
  )
}