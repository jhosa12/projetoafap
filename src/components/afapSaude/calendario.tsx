


import { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { MdDelete } from "react-icons/md";
import { HiCalendar, HiClipboardCheck } from "react-icons/hi";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/afapSaude/drawer";
import { Timeline, Accordion, Button, Modal } from "flowbite-react";
import { ClientProps, EventProps, MedicoProps } from "@/pages/afapSaude";
import { MdAddBox } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { TiCancel } from "react-icons/ti";
import { Tooltip } from 'react-tooltip';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)




interface DataProps {
  medicos: Array<MedicoProps>
  events: Array<EventProps>
  setArrayEvent: (array: Array<EventProps>) => void
  dataEvent: Partial<EventProps>
  setarDataEvento: (fields: Partial<EventProps>) => void
  deletarEvento: () => Promise<void>
  pre:Array<ClientProps>
  setPre:(array:Array<ClientProps>)=>void
 
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

export default function Calendario({pre,setPre, medicos, events, setArrayEvent, dataEvent, setarDataEvento, deletarEvento }: DataProps) {


  const [isOpen, setIsOpen] = useState(false);
  const [modalDelete, setModalDel] = useState(false)



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
        <Accordion collapseAll onClick={(e) => e.stopPropagation()}  >
          <Accordion.Panel>
            <Accordion.Title className="flex w-full border-green-500 bg-white text-cyan-700  border-l-8 py-2 focus:outline-none focus:ring-0 focus:ring-offset-0 "  >
              <div className="inline-flex w-full items-center gap-8">
                {event.status === 'AB' ? 'ABERTO' : event.status === 'AD' ? 'ADIADO' : 'CANCELADO'} - {event.title}
                <button data-tooltip-id="event" data-tooltip-content={'Adicionar Agendamento'} className="hover:text-blue-600" onClick={(e) => {
                  e.stopPropagation()
                  setarDataEvento({ ...event, tipoAg: 'ct', nome: '', celular: '', clientes: [], endereco: '', editar: false, id_agcli: undefined })
                  toggleDrawer()
                }} >
                  <MdAddBox size={26} />

                </button>
                <button data-tooltip-id="event" data-tooltip-content={'Deletar'} onClick={() => {
                  setarDataEvento({ ...event, tipoAg: 'md', id_agcli: undefined }),
                    setModalDel(true)
                }} className="hover:text-red-600">
                  <MdDelete size={26} />
                </button>
              </div>
              <span className="text-sm">Clientes: {event?.clientes?.length}</span>

            </Accordion.Title >
            <Accordion.Content>
              <Timeline theme={{ item: { root: { vertical: 'mb-1 ml-6 ' }, content: { body: { base: "mb-4 text-sm font-normal text-gray-500 dark:text-gray-400" }, title: { base: "flex justify-between text-sm font-semibold text-gray-900 dark:text-white" } } } }}>
                {event?.clientes?.map((item, index) => (
                  <Timeline.Item key={item.id_agcli}>
                    <Timeline.Point icon={HiCalendar} />
                    <Timeline.Content>
                      <Timeline.Time>{new Date(item.start).toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza', weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</Timeline.Time>
                      <Timeline.Title>
                        {item.nome}
                        <div className="inline-flex gap-5">
                        <button data-tooltip-id="event" data-tooltip-content={'Editar Agendamento'} className="text-gray-500 hover:text-blue-600" onClick={() => handleEventClick({ ...item, tipoAg: 'ct', id_med: event.id_med })} ><HiCalendar size={20} /></button>
                        <button data-tooltip-id="event" data-tooltip-content={'Cancelar'} className="text-gray-500 hover:text-red-600" onClick={() => CancelarAgendamento({id_agmed:item.id_agmed,id_agcli:item.id_agcli})} ><TiCancel size={23}  /></button>
                        <button data-tooltip-id="event" data-tooltip-content={'Gerar Consulta'} className="text-gray-500 hover:text-green-600" onClick={() => handleEventClick({ ...item, tipoAg: 'ct', id_med: event.id_med })} ><HiClipboardCheck size={23}  /></button>
                        </div>
                        
                        </Timeline.Title>
                      <Timeline.Body>
                        {item.endereco}
                      </Timeline.Body>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
              <Tooltip id="event"/>
            </Accordion.Content>
          </Accordion.Panel>
          
        </Accordion>



      )


    }
  }

  const CancelarAgendamento = async ({id_agmed,id_agcli}:{id_agmed:number|null,id_agcli:number}) => {
 
    try {
      const evento = await toast.promise(
        api.put("/agenda/editarEvento", {
          id_agcli:id_agcli,
          id_agmed:null,
          tipoAg: 'ct',
          

        }),
        {
          error: 'Erro na requisição',
          pending: 'Gerando Evento..',
          success: 'Evento Gerado com sucesso'
        }

      )



      const novo = [...events]
      const index = novo.findIndex(item => item.id_agmed === id_agmed)


     

        const indexct = novo[index].clientes?.findIndex(item => item.id_agcli === id_agcli)
        if (indexct !== undefined && indexct !== -1 && novo[index].clientes) {
          novo[index].clientes.splice(indexct,1)
          setArrayEvent(novo)
        setPre([...pre,evento.data])
        }

      



    } catch (error) {
      toast.error('Erro ao gerar evento')
      console.log(error)
    }
  }



  const handleEventClick = (event: Partial<EventProps>) => {
    setarDataEvento({ ...event })
    toggleDrawer()
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };


  const handleNovoEvento = useCallback(({ start, end }: { start: Date, end: Date }) => {
    setarDataEvento({ start, end, data: undefined, id_agmed: undefined, id_med: undefined, obs: '', status: 'AB', title: '', celular: '', nome: '', tipoAg: 'md', endereco: '', editar: true })
    toggleDrawer()
  }, [setArrayEvent])


  return (
    <>
      <div >


        <ModalDrawer deletarEvento={deletarEvento} setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent} setarDataEvent={setarDataEvento} arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer} />
        <Calendar
          localizer={localizer}
          events={events.filter((item) => item.tipoAg !== 'tp')}
          components={components}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleNovoEvento}
          // onSelectEvent={handleEventClick}
          selected={true}
          style={{ height: 'calc(100vh - 125px)' }}
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