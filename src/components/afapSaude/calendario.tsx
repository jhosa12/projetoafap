


import { useCallback, useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { MdDelete } from "react-icons/md";
import { HiCalendar, HiClipboardCheck } from "react-icons/hi";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/afapSaude/drawer";
import { Timeline, Accordion, Button, Modal, Alert } from "flowbite-react";
import { ClientProps, ConsultaProps, EventProps, MedicoProps } from "@/pages/afapSaude";
import { MdAddBox } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { TiCancel } from "react-icons/ti";
import { Tooltip } from 'react-tooltip';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { ModalPreAgend } from "./components/modalPreAgend";
import { AuthContext } from "@/contexts/AuthContext";

import { set } from "date-fns";

// Configura o moment para usar o idioma português
moment.locale('pt-BR');
const localizer = momentLocalizer(moment)




interface DataProps {
  medicos: Array<MedicoProps>
  events: Array<EventProps>
  setArrayEvent: (array: Array<EventProps>) => void
  dataEvent: Partial<EventProps>
  setarDataEvento: (fields: Partial<EventProps>) => void
  deletarEvento: () => Promise<void>
  consultas:Array<ConsultaProps>
  setConsultas:(array:Array<ConsultaProps>)=>void
 
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

export default function Calendario({ medicos, events, setArrayEvent, dataEvent, setarDataEvento, deletarEvento,consultas,setConsultas }: DataProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [modalDelete, setModalDel] = useState(false)
  const {usuario} = useContext(AuthContext)


  

  const gerarConsulta = async ({evento,id_med}:{evento:ClientProps,id_med:number}) => {
  
    try {

      const response = await toast.promise(
        api.post("/afapSaude/consultas/cadastro", {
          nome: evento.nome,
          data: new Date(),
          espec: evento.title,
         // exames: data.exames,
          id_med: id_med,
         // tipoDesc: data.tipoDesc,
         // vl_consulta: data.vl_consulta,
         // vl_desc: data.vl_desc,
        //  vl_final: data.vl_final,
          celular: evento.celular,
          //cpf: data.cpf
        }),
        {
          error: 'Erro ao gerar consulta',
          pending: 'Cadastrando Consulta.....',
          success: 'Consulta Cadastrada com sucesso'
        }
      )

      setConsultas([...consultas, response.data])

    } catch (error) {
      console.log(error)
    }
  }

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
        <Alert   icon={HiCalendar}>
       
           
     
                {event.status} - {event.title}

            
              {/*  <button data-tooltip-id="event" data-tooltip-content={'Adicionar Agendamento'} className="hover:text-blue-600" onClick={(e) => {
                  e.stopPropagation()
                  setarDataEvento({ ...event, tipoAg: 'ct', nome: '', celular: '', clientes: event.clientes, endereco: '', editar: false, id_agcli: undefined })
                  setAgeCliente(true)
                }} >
                  <MdAddBox size={22} />

                </button>
                <button data-tooltip-id="event" data-tooltip-content={'Deletar'} onClick={() => {
                  setarDataEvento({ ...event, tipoAg: 'md', id_agcli: undefined }),
                    setModalDel(true)
                }} className="hover:text-red-600">
                  <MdDelete size={22} />
                </button>*/
           }
                
           
             

           
  
          
        </Alert>



      )


    }
  }

  



  const handleEventClick = (event: Partial<EventProps>) => {
    setarDataEvento({ ...event })
    
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };


  const handleNovoEvento = ({ start, end }: { start: Date, end: Date }) => {
    setarDataEvento({ start, end, data: undefined, id_agmed: undefined, id_med: undefined, obs: '', status: 'AB', title: '', celular: '', nome: '', tipoAg: 'md', endereco: '', editar: true })
    toggleDrawer()
  }


  return (
    <>
      <div >

  
        <ModalDrawer deletarEvento={deletarEvento} setArrayEvent={setArrayEvent} events={events} dataEvent={dataEvent}  arrayMedicos={medicos} isOpen={isOpen} toggleDrawer={toggleDrawer} />
        <Calendar
          localizer={localizer}
          events={events.filter((item) => item.tipoAg !== 'tp')}
          components={components}
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