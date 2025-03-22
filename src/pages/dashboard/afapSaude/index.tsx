

import {  useEffect, useState,Suspense, useCallback } from "react";
import { api } from "@/lib/axios/apiClient";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import {  momentLocalizer } from 'react-big-calendar'
import moment from 'moment'


import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br'; // Importa o idioma português para o moment
import Calendario from "@/components/tabs/afapSaude/agendaMedico/calendario";
import Consultas from "@/components/tabs/afapSaude/consultas";
import { Tabs } from "flowbite-react";
import { FaCalendarAlt } from "react-icons/fa";
import {HiClipboardList } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";

import { BiSolidInjection } from "react-icons/bi";
import Exames from "@/components/tabs/afapSaude/exames/exames";
import Configuracoes from "@/components/tabs/afapSaude/configuracoes/configuracoes";

// Configura o moment para usar o idioma português
moment.locale('pt-br');
const localizer = momentLocalizer(moment)





export interface ExamesData{
  id_exame:number,
  nome:string,
  obs:string,
  data:Date,
  valorExame:number,
  desconto:number,
  valorFinal:number,
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
  valorFinal:number,
  valorRepasse:number,
  obs:string
}


export interface ConsultaProps{
  id_consulta:number|null,
  id_med:number|null,
  complemento:string,
  dt_pgto:Date|null,
  user:string,
  procedimentos:Array<ExamesData>,
  nome:string,
  celular:string,
  cpf:string,
  espec:string,
  status:string,
  vl_consulta:number|null,
  tipoDesc:string,
  vl_desc:number|null,
  vl_final:number|null,
  data:Date,
  exames:Array<ExamesData>,
  nascimento:Date,
  endereco:string,
  bairro:string,
  numero:number,
  cidade:string,
  responsavel:string,
  grau_parentesco:string,
  informacoes:string,
  receita:string,
  peso:number,
  altura:number,
  temperatura:number,
  idade:number,
  identidade:string,
  observacao:string
  id_selected:number,
  id_agmed:number|null,
  hora_prev:Date,
  buscar:string,
  data_prev:Date|undefined,
  retorno:string
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
  exames: Array<ExamesProps>

}

export interface ClientProps {
  data_prev:Date|undefined,
  id_agcli: number,
  user:string,
  espec: string,
  medico: string,
  id_agmed: number|null,
  id_med: number,
  id_usuario: number
  data: Date
  start: Date,
  end: Date,
  title: string
  status: string,
  endereco: string,
  numero:number,
  bairro:string
  cidade:string
  complemento:string,
  buscar:string
  obs: string,
  nome: string,
  hora_prev:Date,
  celular: string,
  tipoAg: string
}
export interface EventProps {

  id_agcli: number,
  id_agmed: number|null
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
 // const [dataEvent, setDataEvent] = useState<Partial<EventProps>>({})
  const [menuIndex, setMenuIndex] = useState(0)
  const [consultas,setConsultas] =useState<Array<ConsultaProps>>([])
  const [exames,setExames] = useState<Array<ExamesProps>>([])
  



  const buscarExames =useCallback(async ()=>{
    try {
        const response  = await api.post("/afapSaude/exames")
        setExames(response.data)
    } catch (error) {
        console.log(error)
    }
},[]
)


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


  /*const setarDataEvento = (fields: Partial<EventProps>) => {
    setDataEvent((prev: Partial<EventProps>) => {

      if (prev) {
        return { ...prev, ...fields }
      }
      else return { ...fields }

    })
  }*/




  /*   const toggleDrawer = () => {
       setIsOpen(!isOpen);
     };*/


  useEffect(() => {

   
      getMedicos()
      agenda()
     
      
   
    buscarExames()
    
  
  }, [])


  const agenda = useCallback(async  ()=> {
    try {
      const response = await api.post("/agenda/listaEventos", {
        tipo: 'td'
      })

      const novoArray = response.data.map((item: EventProps) => { return { ...item, start: new Date(item.start), end: new Date(item.end) } })
      setEvents(novoArray)
    } catch (error) {
      toast.error('ERRO NA REQUISIÇÃO')
    }
  },[])
  const getMedicos =useCallback( async() => {
    try {
      const response = await api.post("/medico/lista")
      const ordenarMedicos = (a: { nome: string }, b: { nome: string }) => {
        const nomeA = a.nome.replace(/^DR\.?\s|^DRA\.?\s/i, "").trim();
        const nomeB = b.nome.replace(/^DR\.?\s|^DRA\.?\s/i, "").trim();
        return nomeA.localeCompare(nomeB);
      };

      const medicosOrdenados = response.data.sort(ordenarMedicos);
      setMedicos(medicosOrdenados)
     // console.log(response.data)
    } catch (error) {
      toast.error('ERRO NA REQUISIÇÃO')

    }

  },[]
)
  /*    const handleNovoEvento = useCallback(({start,end}:{start:Date,end:Date})=>{
             setDataEvent({start,end})  
             toggleDrawer()
      },[setEvents])*/




  return (
 
      <div className="flex flex-col  w-full text-white">

        
      <Tabs theme={{base: 'bg-white rounded-b-lg',tabpanel:'bg-white rounded-b-lg h-[calc(100vh-70px)]',tablist:{tabitem:{base: "flex items-center  justify-center rounded-t-lg px-3 py-1 text-[11px] font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",variant:{underline:{active:{
        on:"active rounded-t-lg border-b-2 border-blue-600 text-blue-500 ",
        off:"border-b-2 border-transparent text-black hover:border-gray-700 hover:text-gray-600 "
      }}}}}}} onActiveTabChange={event => setMenuIndex(event)} variant="underline">

<Tabs.Item  active={menuIndex === 0} title="AGENDA MÉDICA" icon={()=><FaCalendarAlt className="mr-2 h-3 w-4"/>}>

     {menuIndex === 0 && <Calendario  events={events} medicos={medicos} setArrayEvent={setEvents} />}
     
      </Tabs.Item>
      <Tabs.Item  active={menuIndex === 1}  title="CONSULTAS" icon={()=><HiClipboardList className="mr-2 h-4 w-4"/>}>
     {menuIndex === 1 && <Consultas events={events.filter(item => new Date(item.end) >= new Date())} setConsultas={setConsultas}  consultas={consultas} medicos={medicos}/>}
      </Tabs.Item>
      <Tabs.Item  active={menuIndex === 2}  title="EXAMES" icon={()=><BiSolidInjection className="mr-2 h-4 w-4"/>}>
    {menuIndex === 2 && <Exames exames={exames}/>}
      </Tabs.Item>
      <Tabs.Item  active={menuIndex === 3}  icon={()=><IoMdSettings className="mr-2 h-4 w-4"/>}  title="CONFIGURAR">
     { menuIndex === 3 && <Configuracoes medicos={medicos} setMedicos={setArrayMedicos} setExames={setExames} exames={exames}/>}
      </Tabs.Item>
    </Tabs>
      </div>


  )
}