import { ClientProps, ConsultaProps, EventProps, MedicoProps } from "@/pages/afapSaude"
import { Modal, Table, FloatingLabel, Label, TextInput, Select, Button } from "flowbite-react"
import { IoLogoWhatsapp } from "react-icons/io";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "@/contexts/AuthContext";
import { ModalPreAgend } from "./components/modalPreAgend";
import { PopoverFiltro } from "./components/PopoverFiltro";
import { ModalConfirmar } from "./components/modalConfirmar";
import { Tooltip } from "react-tooltip";
import { FaNotesMedical } from "react-icons/fa";
import { da } from "date-fns/locale";


interface DataProps {
    arrayMedicos: Array<MedicoProps>
    events: Array<EventProps>,
    consultas:Array<ConsultaProps>
    setConsultas: (array: Array<ConsultaProps>) => void
}




export default function PreAgend({ arrayMedicos, events,consultas,setConsultas }: DataProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dados, setDados] = useState<Partial<ClientProps>>()
    const { usuario,cidades } = useContext(AuthContext)
    const [filtrar, setFiltrar] = useState<boolean>(false)
    const [pre, setPre] = useState<Array<ClientProps>>([])
    const [openStatus,setOpenStatus] = useState<boolean>(false)
    const [openConsulta,setOpenConsulta] = useState<boolean>(false)


    let data = new Date()
    data.setHours(data.getHours() - data.getTimezoneOffset() / 60)
    


useEffect(() => {
    preAgendamento({endDate:undefined,id_med:null,startDate:undefined,status:undefined})
}, [])



const gerarConsulta = async () => {
  
    try {

      const response = await toast.promise(
        api.post("/afapSaude/consultas/cadastro", {
          nome: dados?.nome,
          data: new Date(),
          espec: dados?.espec,
         // exames: data.exames,
          id_med: dados?.id_med,
         // tipoDesc: data.tipoDesc,
         // vl_consulta: data.vl_consulta,
         // vl_desc: data.vl_desc,
        //  vl_final: data.vl_final,
          celular: dados?.celular,
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


const handleAlterarStatus = async () => {
     
    try {

        const evento = await toast.promise(
         
            api.put("/agenda/preAgendamento/editar", {
                id_agcli: dados?.id_agcli,
                id_agmed:dados?.status === 'AGUARDANDO DATA' ? null : dados?.id_agmed,
                
                data_prev: dados?.status === 'AGUARDANDO DATA' ? null : dados?.data_prev,
                status: dados?.status
            }),
            {
                error: 'Erro na requisição',
                pending: 'Alterando status..',
                success: 'Status alterado com sucesso'
            }

        )
        let novo: Array<ClientProps> = [...pre]
        const index = pre.findIndex(item => item.id_agcli === dados?.id_agcli)
                novo[index] = { ...evento.data }
          
            setPre(novo)

          setOpenStatus(false)

    } catch (error) {
        toast.error('Erro ao gerar evento')
    }
}


const handleChangeStatus = ({event,item}:{event: ChangeEvent<HTMLSelectElement>,item:ClientProps}) => {
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
            isOpen && <ModalPreAgend usuario={usuario?.nome} cidades={cidades} dados={dados??{}} openModal={isOpen} setOpenModal={setIsOpen} arrayMedicos={arrayMedicos} events={events}   id_usuario={usuario?.id??''} setPre={setPre} pre={pre}  />
        }

        <ModalConfirmar pergunta="Realmente deseja alterar o status?" handleConfirmar={handleAlterarStatus} openModal={openStatus} setOpenModal={setOpenStatus}/>


        <ModalConfirmar pergunta="Realmente deseja gerar a consulta?" handleConfirmar={gerarConsulta} openModal={openConsulta} setOpenModal={setOpenConsulta}/>
  


   
            {/* TABELA DE PRE AGENDAMENTOS */}
            <div className="flex flex-col overflow-x-auto overflow-y-auto p-2 gap-1 text-black">
             {data.toISOString()}
                <div className="inline-flex ml-auto gap-4"> 
                <PopoverFiltro arrayMedicos={arrayMedicos} openModal={filtrar} setOpenModal={()=>setFiltrar(!filtrar)} filtroAgenda={preAgendamento} loading={false} />
                <Button size={'sm'} onClick={() => { setIsOpen(true), setDados({ celular: '',  endereco: '', espec: '', id_agmed: undefined, nome: '', title: '', id_agcli: undefined }) }} ><MdAdd size={20} /> Adicionar</Button>
                </div>
             
                <Table  theme={{ body: { cell: { base: " px-2 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } },head:{cell:{base:"bg-gray-50 text-xs px-2 py-2 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg "}} }}>
                    <Table.Head>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>Médico</Table.HeadCell>
                        <Table.HeadCell>Cel.</Table.HeadCell>
                        <Table.HeadCell>Data Solic.</Table.HeadCell>
                        <Table.HeadCell>Data Prev.</Table.HeadCell>
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
                                <Table.Cell className="whitespace-nowrap">{item.celular}</Table.Cell>
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
                                    <div className="inline-flex gap-3">
                                        <button data-tooltip-id="tooltip-agenda" data-tooltip-content={'Abrir conversa'} onClick={() => handleWhatsAppClick(item.celular ?? '')} className="hover:text-green-400">
                                            <IoLogoWhatsapp size={18} />
                                        </button>
                                        <button data-tooltip-id="tooltip-agenda" data-tooltip-content={'Deletar'} onClick={() => handleDeletarEvent(Number(item.id_agcli))} className="hover:text-red-500">
                                            <MdDelete size={20} />
                                        </button>
                                        <button data-tooltip-id="tooltip-agenda" data-tooltip-content={'Alterar'} onClick={() => {
                                            // setarDataEvent({...item,start:undefined,end:undefined})
                                            setDados({ ...item})
                                            setIsOpen(true)
                                        }} className="hover:text-blue-500">
                                            <MdEditDocument size={18} />
                                        </button>

                                        <button data-tooltip-id="tooltip-agenda" data-tooltip-content={'Gerar Consulta'} onClick={() => {
                                            // setarDataEvent({...item,start:undefined,end:undefined})
                                            setDados({ ...item,espec:item.medico})
                                            setOpenConsulta(true)
                                        }} className="hover:text-blue-500">
                                            <FaNotesMedical  size={18} />
                                        </button>

                                    </div>
                                </Table.Cell>
                            </Table.Row>)

                        )}

                    </Table.Body>
                </Table>
                <Tooltip id="tooltip-agenda"/>
            </div>
        </>
    )
}