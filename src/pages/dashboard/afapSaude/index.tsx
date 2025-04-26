

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios/apiClient";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'moment/locale/pt-br';
import Calendario from "@/components/tabs/afapSaude/agendaMedico/calendario";
import Consultas from "@/components/tabs/afapSaude/consultas";
import { FaCalendarAlt } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { BiSolidInjection } from "react-icons/bi";
import Configuracoes from "@/components/tabs/afapSaude/configuracoes/configuracoes";
import {  ExamesProps, MedicoProps, EventProps } from "@/types/afapSaude";
import Exames from "@/components/afapSaude/exames/exames";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function AfapSaude() {
  const [medicos, setMedicos] = useState<Array<MedicoProps>>([])
  const [events, setEvents] = useState<Array<EventProps>>([])
  const [menuIndex, setMenuIndex] = useState(0)
  const [exames, setExames] = useState<Array<ExamesProps>>([])




  const buscarExames = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await api.post("/afapSaude/exames", { signal })
      setExames(response.data)
    } catch (error) {
      console.log(error)
    }
  }, []
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
    const controllers = {
      medicos: new AbortController(),
      agenda: new AbortController(),
      exames: new AbortController(),
    };

    getMedicos(controllers.medicos.signal)
    agenda(controllers.agenda.signal)
    buscarExames(controllers.exames.signal)


    return () => {
      controllers.medicos.abort();
      controllers.agenda.abort();
      controllers.exames.abort();
    };

  }, [])


  const agenda = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await api.post("/agenda/listaEventos", {
        tipo: 'td'
      }, { signal })

      const novoArray = response?.data?.map((item: EventProps) => { return { ...item, start: new Date(item.start), end: new Date(item.end) } })
      setEvents(novoArray ?? [])
    } catch (error) {
      console.log('ERRO NA REQUISIÇÃO 1')
    }
  }, [])


  const getMedicos = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await api.post("/medico/lista", { signal })
      const ordenarMedicos = (a: { nome: string }, b: { nome: string }) => {
        const nomeA = a.nome.replace(/^DR\.?\s|^DRA\.?\s/i, "").trim();
        const nomeB = b.nome.replace(/^DR\.?\s|^DRA\.?\s/i, "").trim();
        return nomeA.localeCompare(nomeB);
      };

      const medicosOrdenados = response.data.sort(ordenarMedicos);
      setMedicos(medicosOrdenados)
      // console.log(response.data)
    } catch (error) {
      console.log('ERRO NA REQUISIÇÃO 2')

    }

  }, []
  )


  return (

   
    <Tabs defaultValue="agenda" >
      <TabsList className="bg-white">
        <TabsTrigger className="text-xs" value="agenda" >
          <FaCalendarAlt className="h-4 w-4 mr-2" />
          AGENDA MÉDICA
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="consultas" >
          <HiClipboardList className="h-4 w-4 mr-2" />
          CONSULTAS
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="exames" >
          <BiSolidInjection className="h-4 w-4 mr-2" />
          EXAMES
        </TabsTrigger>
        <TabsTrigger className="text-xs" value="configurar" >
          <IoMdSettings className="h-4 w-4 mr-2" />
          CONFIGURAR
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agenda" >
        <Calendario events={events} medicos={medicos} setArrayEvent={setEvents} />
      </TabsContent>

      <TabsContent value="consultas" className="px-4 ">
        <Consultas events={events.filter(item => new Date(item.end) >= new Date())} medicos={medicos} />
      </TabsContent>

      <TabsContent value="exames" className="px-4 ">
        <Exames exames={exames} />
      </TabsContent>

      <TabsContent value="configurar" className="px-4 ">
        <Configuracoes medicos={medicos} setMedicos={setArrayMedicos} setExames={setExames} exames={exames} />
      </TabsContent>
    </Tabs>

  )
}