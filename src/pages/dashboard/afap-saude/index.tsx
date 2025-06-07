
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import Consultas from "@/components/afapSaude/consultas/consultas";
import Configuracoes from "@/components/afapSaude/config/configuracoes";
import Exames from "@/components/afapSaude/exames/exames";
import Calendario from "@/components/tabs/afapSaude/agendaMedico/calendario";
import { EventProps, ExamesProps, MedicoProps } from "@/types/afapSaude";
import { AuthContext } from "@/store/AuthContext";
import useVerifyPermission from "@/hooks/useVerifyPermission";
import { AlertTriangle, BarChart, CalendarDays, ClipboardList, Cog, LogIn, Settings, Syringe,GitGraph } from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import ScreenDashBoard from "@/components/afapSaude/dashboardAfapSaude/ScreenDashBoard";
import { TbChartPie, TbChartPieFilled } from "react-icons/tb";

export default function AppLayout() {
   const [medicos, setMedicos] = useState<Array<MedicoProps>>([])
  const [events, setEvents] = useState<Array<EventProps>>([])
  const [exames, setExames] = useState<Array<ExamesProps>>([])
  const {usuario,signOut} = useContext(AuthContext)
  const {verify}=useVerifyPermission()
  const {infoEmpresa} = useContext(AuthContext)

    useEffect(() => {
    if (!usuario?.nome) signOut()
  }, [usuario])


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



     useEffect(()=>{
     
      const agendaController =new AbortController()

        agenda(agendaController.signal)

        return () => {
          agendaController.abort();
        }
     },[infoEmpresa?.id])


  useEffect(() => {
    const controllers = {
      medicos: new AbortController(),
      agenda: new AbortController(),
      exames: new AbortController(),
    };

    getMedicos(controllers.medicos.signal)
  
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
        id_empresa:infoEmpresa?.id
      }, { signal })

      const novoArray = response?.data?.map((item: EventProps) => { return { ...item, start: new Date(item.start), end: new Date(item.end) } })
      setEvents(novoArray ?? [])
    } catch (error) {
      console.log('ERRO NA REQUISIÇÃO')
    }
  },[infoEmpresa?.id])


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


  const nomeNormalizado = infoEmpresa?.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

if (!nomeNormalizado?.includes("SAUDE")) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
    <AlertTriangle size={48} className="text-yellow-500 mb-4" />
      <h1 className="text-xl font-bold text-gray-800">Empresa não é do ramo da saúde</h1>
      <p className="text-sm text-gray-600 mt-2">
        Por favor, selecione uma empresa do segmento de saúde para visualizar os dados.
      </p>
    </div>
  );
}

  return (
   <div className="flex-1 px-4 py-1 overflow-auto">
    <Tabs defaultValue="agenda" className="h-full flex flex-col" >
      <div className="flex flex-row justify-between">
      <TabsList className="bg-blue-50 border-blue-200 p-1 mb-1 inline-flex w-fit">
  <TabsTrigger
    className="flex text-xs items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
    value="agenda"
  >
    <CalendarDays className="h-4 w-4" />
    AGENDA MÉDICA
  </TabsTrigger>

  <TabsTrigger
    disabled={verify('AFS3.0')}
    className="flex text-xs items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
    value="consultas"
  >
    <ClipboardList className="h-4 w-4" />
    CONSULTAS
  </TabsTrigger>

  <TabsTrigger
    disabled={verify('AFS2.0')}
    className="flex text-xs items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
    value="exames"
  >
    <Syringe className="h-4 w-4" />
    EXAMES
  </TabsTrigger>

  <TabsTrigger
    disabled={verify('AFS4.0')}
    className="flex text-xs items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
    value="configurar"
  >
    <Settings className="h-4 w-4" />
    CONFIGURAR
  </TabsTrigger>

    <TabsTrigger
    
    className="flex text-xs items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
    value="dashboard"
  >
    <TbChartPie className="h-4 w-4" />
    DASHBOARD
  </TabsTrigger>
</TabsList>
      <div className="text-right">
          <p className="text-[13px] font-medium text-slate-800">{infoEmpresa?.cidade_uf}</p>
          <p className="text-xs font-semibold text-green-500">🟢 Sistema Ativo</p>
        </div>
</div>
      <TabsContent  className="px-2" value="agenda" >
        <Calendario localEmpresa={infoEmpresa?.cidade_uf??''} id_empresa={infoEmpresa?.id??''} nomeEmpresa={infoEmpresa?.nome??''} events={events} medicos={medicos} setArrayEvent={setEvents} />
      </TabsContent>

      <TabsContent forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="consultas" >
        <Consultas empresa={infoEmpresa} verifyPermission={verify} events={events.filter(item => new Date(item.end) >= new Date())} medicos={medicos} />
      </TabsContent>

      <TabsContent forceMount className="hidden data-[state=active]:flex flex-col gap-4" value="exames" >
        <Exames empresa={infoEmpresa} verifyPermission={verify} exames={exames} />
      </TabsContent>

      <TabsContent className="px-4" value="configurar" >
        <Configuracoes  medicos={medicos} setMedicos={setArrayMedicos} setExames={setExames} exames={exames} />
      </TabsContent>
       <TabsContent className="px-4 overflow-auto max-h-[calc(100vh-115px)]" value="dashboard" >
        <ScreenDashBoard id_empresa={infoEmpresa?.id??''} />
      </TabsContent>
    </Tabs>
    
</div>
  )
}   



 

  

   
 