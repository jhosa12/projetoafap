import { ClientProps, EventProps, MedicoProps } from "@/pages/afapSaude"
import { Modal, Table, FloatingLabel, Label, TextInput, Select, Button } from "flowbite-react"
import { IoLogoWhatsapp } from "react-icons/io";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "@/contexts/AuthContext";
import { ModalPreAgend } from "./components/modalPreAgend";
import { PopoverFiltro } from "./components/PopoverFiltro";
import { ModalStatusAgendamento } from "./components/modalStatusAgendamento";


interface DataProps {
    arrayMedicos: Array<MedicoProps>
    events: Array<EventProps>
}


export interface DadosInputs {
    id_agcli: number,
    id_med: number,
    status: string,
    data_prev: Date|undefined,
    nome: string,
    celular: string,
    id_agmed: number|null,
    espec: string,
    endereco: string,
    title: string,

}

export default function PreAgend({ arrayMedicos, events }: DataProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dados, setDados] = useState<Partial<DadosInputs>>()
    const { usuario } = useContext(AuthContext)
    const [filtrar, setFiltrar] = useState<boolean>(false)
    const [pre, setPre] = useState<Array<ClientProps>>([])
    const [openStatus,setOpenStatus] = useState<boolean>(false)


useEffect(() => {
    preAgendamento({endDate:undefined,id_med:null,startDate:undefined,status:undefined})
}, [])


const handleChangeStatus = ({event,item}:{event: ChangeEvent<HTMLSelectElement>,item:DadosInputs}) => {
    const { value } = event.target
    setDados({ ...item, status: value })
    setOpenStatus(true)

}
    const preAgendamento = async ({endDate,id_med,startDate,status}:{startDate:Date|undefined,endDate:Date|undefined,status:string|undefined,id_med:number|null}) => {
       
        try {
          const response = await api.post("/agenda/preagendamento",{
            startDate,
            endDate,
            status,
            id_med
          })
          setPre(response.data)
        } catch (error) {
          console.error('Erro na requisição pre')
        }
      }
  

    const handleDeletarEvent = async (id: number) => {
        try {
            const deletado = await toast.promise(
                api.delete(`/agenda/deletarEvento/ct/${id}`)


                ,
                {
                    error: 'Erro ao deletar dados',
                    pending: 'Deletando Pre Agendamento',
                    success: 'Deletado com sucesso!'
                }

            )

            const novoArray = pre.filter(item => item.id_agcli !== deletado.data.id_agcli)
            setPre(novoArray)
        } catch (error) {
            console.log(error)
        }
    }


    const formatPhoneNumber = (phoneNumber: string) => {
        // Remove todos os caracteres que não sejam números
        let cleaned = phoneNumber.replace(/\D/g, '');

        // Verifica se o telefone tem 11 dígitos (2 dígitos DDD + 9 dígitos número)
        if (cleaned.length === 11) {
            // Adiciona o código do país (Brasil: +55)
            return `55${cleaned}`;
        } else {
            console.error('Número de telefone inválido:', phoneNumber);
            return null;
        }
    };

    const handleWhatsAppClick = (phoneNumber: string) => {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (formattedNumber) {
            const message = encodeURIComponent("Olá, gostaria de agendar uma consulta ?");
            const whatsappURL = `whatsapp://send?phone=${formattedNumber}&text=${message}`;
            window.open(whatsappURL);
        }
    };



    return (
        <>
         

        {
            isOpen && <ModalPreAgend dados={dados??{}} openModal={isOpen} setOpenModal={setIsOpen} arrayMedicos={arrayMedicos} events={events}   id_usuario={usuario?.id??''} setPre={setPre} pre={pre}  />
        }

        <ModalStatusAgendamento arrayPre={pre} setPre={setPre} cliente={{...dados}} openModal={openStatus} setOpenModal={setOpenStatus}/>



            {/* TABELA DE PRE AGENDAMENTOS */}
            <div className="flex flex-col overflow-x-auto overflow-y-auto p-2 gap-1">
                <div className="inline-flex ml-auto gap-4"> 
                <PopoverFiltro arrayMedicos={arrayMedicos} openModal={filtrar} setOpenModal={()=>setFiltrar(!filtrar)} filtroAgenda={preAgendamento} loading={false} />
                <Button size={'sm'} onClick={() => { setIsOpen(true), setDados({ celular: '',  endereco: '', espec: '', id_agmed: undefined, nome: '', title: '', id_agcli: undefined }) }} ><MdAdd size={20} /> Adicionar</Button>
                </div>
             
                <Table  theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}>
                    <Table.Head>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>Medico</Table.HeadCell>
                        <Table.HeadCell>Telefone</Table.HeadCell>
                        <Table.HeadCell>Data Solicitação</Table.HeadCell>
                        <Table.HeadCell>Data Prevista</Table.HeadCell>
                        <Table.HeadCell>STATUS</Table.HeadCell>
                        <Table.HeadCell>USUÁRIO</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y ">
                        {pre.map((item, index) =>
                        (
                            <Table.Row key={item.id_agcli} className="bg-white text-black">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.nome}
                                </Table.Cell>
                                <Table.Cell>{item.medico}</Table.Cell>
                                <Table.Cell>{item.celular}</Table.Cell>
                                <Table.Cell>{item.data && new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>

                                <Table.Cell>{item.data_prev && new Date(item.data_prev).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>

                                <Table.Cell>
                                    <select   className={`font-semibold border-none focus:ring-0 hover:cursor-pointer  appearance-none outline-none text-xs ${
    item.status === 'AGENDADO' ? 'text-blue-500' :
    item.status === 'AGUARDANDO DATA' ? 'text-yellow-500' :
    item.status === 'CONFIRMADO' ? 'text-green-500' :
    item.status === 'CANCELADO' ? 'text-red-500' : ''
  }`}  value={item.status} onChange={e => handleChangeStatus({item, event:e})}>
                                        <option disabled className="font-semibold text-blue-500" value={'AGENDADO'}>
                                        AGENDADO
                                            </option>
                                        <option className="text-yellow-500 font-semibold" value={'AGUARDANDO DATA'}>AGUARDANDO DATA</option>
                                        <option className="text-green-500 font-semibold" value={'CONFIRMADO'}>CONFIRMADO</option>
                                        <option className="text-red-500 font-semibold" value={'CANCELADO'}>CANCELADO</option>
                                    </select>
                                </Table.Cell>
                                <Table.Cell>{}</Table.Cell>
                                
                                <Table.Cell className="text-slate-500">
                                    <div className="inline-flex gap-4">
                                        <button onClick={() => handleWhatsAppClick(item.celular ?? '')} className="hover:text-green-400">
                                            <IoLogoWhatsapp size={18} />
                                        </button>
                                        <button onClick={() => handleDeletarEvent(Number(item.id_agcli))} className="hover:text-red-500">
                                            <MdDelete size={20} />
                                        </button>
                                        <button onClick={() => {
                                            // setarDataEvent({...item,start:undefined,end:undefined})
                                            setDados({ ...item})
                                            setIsOpen(true)
                                        }} className="hover:text-blue-500">
                                            <BsFillCalendarDateFill size={18} />
                                        </button>

                                    </div>
                                </Table.Cell>
                            </Table.Row>)

                        )}

                    </Table.Body>
                </Table>
            </div>
        </>
    )
}