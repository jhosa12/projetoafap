


import { useCallback, useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdAccessTime } from "react-icons/md";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/afapSaude/agendaMedico/drawer";
import {  Button, Modal, Alert } from "flowbite-react";
import {ConsultaProps, EventProps, MedicoProps } from "@/pages/afapSaude";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import ptBR from 'date-fns/locale/pt-BR';
import { format, parse, startOfWeek } from 'date-fns';
import { AuthContext } from "@/contexts/AuthContext";
import { getDay } from "date-fns";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";

const locales = {
  'pt-BR':ptBR,
} 
const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) => format(date, formatStr, { locale: ptBR }),
  parse: (dateString: string, formatString: string) => parse(dateString, formatString, new Date(), { locale: ptBR }),
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

// Configura o moment para usar o idioma português





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
  const {usuario} = useContext(AuthContext)
  const [dataEvent, setDataEvent] = useState<Partial<EventProps>>({})


  
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

    try {


     
        const response = await toast.promise(
          api.delete(`/agenda/deletarEvento/${dataEvent.tipoAg}/${dataEvent.id_agmed}`),
          {
            error: 'Erro ao deletar dados',
            pending: 'Apagando dados...',
            success: 'Dados deletados com sucesso!'
          }
        )
        const novoArray = [...events]
        const index = novoArray.findIndex(item => item.id_agmed === dataEvent.id_agmed)
        novoArray.splice(index, 1)
        setArrayEvent(novoArray)
      
 
    } catch (error) {
      toast.error('erro na requisição')
    }

  },[dataEvent.id_agmed,events])
 

  useEffect(() => {

    if (events.length > 0) {
      const novoArray = events.reduce((acumulador, atual) => {
        const itemExistente = acumulador.find(item => item.id_med === atual.id_med)

        return acumulador
      }, [] as Array<ObjectArrayMod>)
    }

  }, [events])


  const components: any = {
    event: ({ event, index }: { event: EventProps, index: number }) => {
      return (
        <Alert theme={{base:"flex flex-col gap-2 p-2 text-xs break-words",icon:"mr-2 inline h-4 w-4 flex-shrink-0",}} className="text-xs break-words" color={event.status === 'ABERTO'?'success':event.status === 'CANCELADO'?'failure':'warning'}  icon={event.status === 'ABERTO'?FaCheck :event.status === 'CANCELADO'?ImCancelCircle :MdAccessTime }>
      
           {event.status} - {event.title}
        </Alert>



      )


    }
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
    <>
      <div >

  
      {isOpen &&  <ModalDrawer deletarEvento={deletarEvento} setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent}  arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer} />}
        <Calendar
          localizer={localizer}
          events={events.filter((item) => item.tipoAg !== 'tp')}
          components={components}
          onSelectEvent={handleEventClick}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleNovoEvento}
          selected={true}
          style={{ height: 'calc(100vh - 110px)'}}
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
   
    </>
  )
}