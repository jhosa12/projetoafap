import { useCallback, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, dateFnsLocalizer, ToolbarProps, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br"; // Importa o idioma português para o moment
import { ModalDrawer } from "@/components/tabs/afapSaude/agendaMedico/drawer";
import {  Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import ptBR from "date-fns/locale/pt-BR";
import { format, parse, startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { api } from "@/lib/axios/apiClient";
import { CalendarEvent as CalendarEventProps,  EventProps, MedicoProps } from "@/types/afapSaude";
import { toast } from "sonner";
import Sidebar from "@/components/afapSaude/calendar/SideBar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarEvent from "@/components/afapSaude/calendar/CalendarEvent";


const locales = {
  "pt-BR": ptBR,
};

const colors = {
  failure: "border-red-500 bg-red-300 text-black ",
  success: "border-green-500 bg-green-200 text-black  ",
  warning: "border-yellow-500 bg-yellow-200 text-black  ",
};

const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) =>
    format(date, formatStr, { locale: ptBR }),
  parse: (dateString: string, formatString: string) =>
    parse(dateString, formatString, new Date(), { locale: ptBR }),
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
  medicos: Array<MedicoProps>;
  events: Array<EventProps>;
  setArrayEvent: (array: Array<EventProps>) => void;
  id_empresa:string
  nomeEmpresa:string,
  localEmpresa:string
}

export default function Calendario({
  medicos,
  events,
  setArrayEvent,
  id_empresa,
  nomeEmpresa,
  localEmpresa
}: DataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDelete, setModalDel] = useState(false);
  const [dataEvent, setDataEvent] = useState<Partial<EventProps>>({});
  const [selectedDoctor, setSelectedDoctor] = useState<number>();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventProps | null>(null);

  const handleNewEvent = () => {
    const now = new Date();
    const oneHourLater = new Date(now);
    oneHourLater.setHours(now.getHours() + 1);
    
    setSelectedEvent({
      id: '',
      title: '',
      start: now,
      end: oneHourLater,
      allDay: false,
    });
   // setIsModalOpen(true);
  };


  const handleNavigate = (date: Date) => {
    setDate(date);
  };

  const filteredEvents =
    selectedDoctor && selectedDoctor !== null
      ? events.filter((event) => event.id_med === selectedDoctor)
      : events;

  const deletarEvento = useCallback(
    async function () {
      if (!dataEvent.id_agmed) {
        setDataEvent({
          celular: "",
          data: new Date(),
          nome: "",
          endereco: "",
          status: "",
          obs: "",
          tipoAg: "",
          title: "",
        });
        setIsOpen(false);
        return;
      }

      toast.promise(
        api.delete(
          `/agenda/deletarEvento/${dataEvent.tipoAg}/${dataEvent.id_agmed}`
        ),
        {
          error: "Erro ao deletar dados",
          loading: "Apagando dados...",
          success: () => {
            const novoArray = [...events];
            const index = novoArray.findIndex(
              (item) => item.id_agmed === dataEvent.id_agmed
            );
            novoArray.splice(index, 1);
            setArrayEvent(novoArray);

            return "Dados deletados com sucesso!";
          },
        }
      );
    },
    [dataEvent.id_agmed, events]
  );

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
    event: ({ event, index }: { event: EventProps; index: number }) => {
     
     return <CalendarEvent event={event} index={index} />
    },
    toolbar:(props: ToolbarProps)=>(
      <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setMonth(date.getMonth() - 1);
            setDate(newDate);
          }}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button
          size='sm'
          variant="outline"
          onClick={() => setDate(new Date())}
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setMonth(date.getMonth() + 1);
            setDate(newDate);
          }}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
        <h2 className="text-lg uppercase font-semibold ml-4">
    {props.label}
        </h2>
      </div>
      
      <div className="md:hidden">
        <Button onClick={handleNewEvent} className="bg-calendar-primary hover:bg-calendar-secondary">
          Novo Evento
        </Button>
      </div>
      
      <div className="hidden md:flex space-x-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          className={view === "month" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
          onClick={() => setView("month")}
          size="sm"
        >
          Mês
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          className={view === "week" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
          onClick={() => setView("week")}
          size="sm"
        >
          Semana
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          className={view === "day" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
          onClick={() => setView("day")}
          size="sm"
        >
          Dia
        </Button>
        <Button
          variant={view === "agenda" ? "default" : "outline"}
          className={view === "agenda" ? "bg-calendar-primary hover:bg-calendar-secondary" : ""}
          onClick={() => setView("agenda")}
          size="sm"
        >
          Agenda
        </Button>
      </div>
    </div>
    )

  };

  const handleEventClick = (event: Partial<EventProps>) => {
    setDataEvent({ ...event });
    toggleDrawer();
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleNovoEvento = ({ start, end }: { start: Date; end: Date }) => {
    setDataEvent({
      start,
      end,
      data: undefined,
      id_agmed: undefined,
      id_med: undefined,
      obs: "",
      status: "AB",
      title: "",
      celular: "",
      nome: "",
      tipoAg: "md",
      endereco: "",
      editar: true,
    });
    toggleDrawer();
  };

  return (
    <div className="flex flex-col w-full md:flex-row h-screen max-h-screen overflow-hidden ">
      <div className="hidden md:block">
        <Sidebar
          view={view}
          nomeEmpresa={nomeEmpresa}
          setView={setView}
          date={date}
          onNavigate={handleNavigate}
          onAddEvent={()=>{setDataEvent({});setIsOpen(true)}}
          hideControls={true}
          medicos={medicos}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
        />
      </div>
      <ModalDrawer
        id_empresa={id_empresa}
        deletarEvento={deletarEvento}
        setArrayEvent={setArrayEvent}
        events={events}
        dataEvent={dataEvent}
        arrayMedicos={medicos}
        isOpen={isOpen}
        local={localEmpresa}
        toggleDrawer={toggleDrawer}
      />
     <div className="flex-1 flex flex-col px-2 py-1 overflow-hidden">
        <div className="flex overflow-auto bg-white rounded-lg p-1">
        <Calendar
        defaultDate={date}
        localizer={localizer}
        events={filteredEvents}
        components={components}
         onView={(newView) => setView(newView)}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleNovoEvento}
        selected={true}
        style={{ height: "calc(100vh - 115px)", width: "100%" }}
        views={["month", "week", "day", "agenda"]}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          allDay: 'Dia inteiro',
          noEventsInRange: 'Não há eventos neste período',
        }}
        className="rounded-md "
      />
        </div>
   

      </div>
      

      <Modal
        show={modalDelete}
        size="md"
        onClose={() => setModalDel(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
            <h3 className="mb-5 text-lg font-normal text-gray-500 ">
              Realmente deseja deletar esse agendamento? Todos os dados
              vinculados a ele também serão apagados
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setModalDel(false), deletarEvento();
                }}
              >
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
  );
}
