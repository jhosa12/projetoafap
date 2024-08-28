



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

import Calendario from "@/components/afapSaude/calendario";
import AdmMedico from "@/components/afapSaude/admMedico";
import PreAgend from "@/components/afapSaude/preAgendamento";
import { MdMedicalServices } from "react-icons/md";
import Consultas from "@/components/afapSaude/consultas";
import { Tabs } from "flowbite-react";
import { FaCalendarAlt } from "react-icons/fa";
import {HiClipboardList } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import Configuracoes from "@/components/afapSaude/configuracoes";

// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)





export interface ExamesData{
  id_exame:number|null,
  nome:string,
  data:Date,
  porcFun:number,
  porcPart:number,
  porcPlan:number
  valorBruto:number,
  desconto:number,
  valorFinal:number
}

export interface ExamesProps{
  id_exame:number,
  nome:string,
  data:Date,
  usuario:string,
  valorBruto:number,
  porcFun:number,
  porcPart:number,
  porcPlan:number
  valorFinal:number
}


export interface ConsultaProps{
  id_consulta:number|null,
  id_med:number|null,
  nome:string,
  celular:string,
  cpf:string,
  espec:string,
  vl_consulta:number,
  tipoDesc:string,
  vl_desc:number,
  vl_final:number,
  data:Date,
  exames:Array<ExamesData>
}

export interface MedicoProps {
  id_med: number,
  espec: string,
  nome: string,
  sobre: string,
  file: File | undefined,
  imageUrl: string,
  tmpUrl: string,
  funeraria: number,
  particular: number,
  plano: number,
  time: number,

}

export interface ClientProps {

  id_agcli: number,
  id_agmed: number,
  id_med: number,
  id_usuario: number
  data: Date
  start: Date,
  end: Date,
  title: string
  status: string,
  endereco: string,
  obs: string,
  nome: string,
  celular: string,
  tipoAg: string
}
export interface EventProps {
  clientes: Array<ClientProps>
  id_agcli: number,
  id_agmed: number
  id_med: number,
  id_usuario: number
  data: Date,
  endereco: string,
  start: Date,
  end: Date,
  title: string
  status: string,
  obs: string,
  nome: string,
  celular: string,
  tipoAg: string,
  editar: boolean
}


export default function AfapSaude() {
  const [medicos, setMedicos] = useState<Array<MedicoProps>>([])
  const [events, setEvents] = useState<Array<EventProps>>([])
  const [isOpen, setIsOpen] = useState(false);
  const [dataEvent, setDataEvent] = useState<Partial<EventProps>>({})
  const [menuIndex, setMenuIndex] = useState(1)
  const [pre, setPre] = useState<Array<ClientProps>>([])
  const [consultas,setConsultas] =useState<Array<ConsultaProps>>([])
  const [exames,setExames] = useState<Array<ExamesProps>>([])




  const buscarExames = async ()=>{
    try {

        const response  = await api.get("/afapSaude/exames")


        setExames(response.data)
        
    } catch (error) {
        console.log(error)
    }
}


const buscarConsultas = async ()=>{
        try {
            const response = await api.get("/afapSaude/consultas")
            
            setConsultas(response.data)
        } catch (error) {
            console.log(error)
        }
}








  async function deletarEvento() {
    if (!dataEvent.id_agmed) {
      setarDataEvento({
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


      if (dataEvent.tipoAg === 'md') {
        const novo = await toast.promise(
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
      }
      else if (dataEvent.tipoAg === 'ct') {
        const novo = await toast.promise(
          api.delete(`/agenda/deletarEvento/${dataEvent.tipoAg}/${dataEvent.id_agcli}`),


          {
            error: 'Erro ao deletar dados',
            pending: 'Apagando dados...',
            success: 'Dados deletados com sucesso!'
          }
        )

        const novoArray = [...events]
        const indexMd = novoArray?.findIndex(item => item.id_agmed === dataEvent.id_agmed)
        const indexCt = novoArray[indexMd]?.clientes?.findIndex(item => item.id_agcli === dataEvent.id_agcli)
        novoArray[Number(indexMd)]?.clientes?.splice(Number(indexCt), 1)
        setArrayEvent(novoArray)
        setIsOpen(false)
      }




    } catch (error) {
      toast.error('erro na requisição')
    }

  }







  const setArrayMedicos = (array: Array<MedicoProps>) => {
    setMedicos(array)
  }

  const components: any = {
    event: ({ event }: { event: EventProps }) => {
      if (event.status === 'C') return <div className="flex rounded-md flex-col  items-center text-white   h-full pt-1 bg-red-600">
        <span className="whitespace-nowrap">{event.title}</span>

      </div>
      if (event.status === 'AD') return <div className="flex flex-col rounded-md  items-center text-white   h-full pt-1 bg-yellow-500">
        <span>{event.title}</span>
      </div>

      else return <div className="flex flex-col  items-center rounded-md  text-white   h-full pt-1 bg-green-600">
        <span>{event.title}</span>
      </div>
    }
  }


  const setarDataEvento = (fields: Partial<EventProps>) => {
    setDataEvent((prev: Partial<EventProps>) => {

      if (prev) {
        return { ...prev, ...fields }
      }
      else return { ...fields }

    })
  }

  const setArrayEvent = (array: Array<EventProps>) => {
    setEvents(array)
  }


  /*   const toggleDrawer = () => {
       setIsOpen(!isOpen);
     };*/


  useEffect(() => {

   
      getMedicos()
      agenda()
      preAgendamento()
      
    buscarConsultas()
    buscarExames()
    
  
  }, [])


  async function agenda() {
    try {
      const response = await api.post("/agenda/listaEventos", {
        tipo: 'td'
      })

      const novoArray = response.data.map((item: EventProps) => { return { ...item, start: new Date(item.start), end: new Date(item.end) } })
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


  const preAgendamento = async () => {
    try {
      const lista = await api.get("/agenda/preagendamento")
      setPre(lista.data)

    } catch (error) {
      console.error('Erro na requisição pre')
    }
  }

  /*    const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
             setDataEvent({start,end})  
             toggleDrawer()
      },[setEvents])*/




  return (
    <>
      <div className="flex flex-col px-4 w-full text-white">
      <Tabs theme={{tabpanel:'py-1',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-4 py-3 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-400 "
      }}}}}}}  variant="underline">

      <Tabs.Item  active title="Agenda" icon={FaCalendarAlt}>
      <Calendario deletarEvento={deletarEvento} setarDataEvento={setarDataEvento} dataEvent={dataEvent} events={events} medicos={medicos} setArrayEvent={setArrayEvent} />
      </Tabs.Item>

      <Tabs.Item title="Medicos" icon={MdMedicalServices}>
      <AdmMedico setArray={setArrayMedicos} medicos={medicos} />
      </Tabs.Item>

      <Tabs.Item title="Pré Agendamentos" icon={MdAccessTimeFilled}>
      <PreAgend setArrayEvent={setArrayEvent} events={events.filter(item => new Date(item.end) >= new Date())} setPre={setPre} arrayMedicos={medicos} pre={pre} />
      </Tabs.Item>

      <Tabs.Item title="Consultas" icon={HiClipboardList}>
      <Consultas exames={exames} consultas={consultas} medicos={medicos}/>
      </Tabs.Item>
      <Tabs.Item  icon={IoMdSettings}  title="Configurar">
       <Configuracoes/>
      </Tabs.Item>
    </Tabs>
      </div>

    </>
  )
}