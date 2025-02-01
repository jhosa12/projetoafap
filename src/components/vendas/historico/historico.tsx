import useApiGet from "@/hooks/useApiGet";
import { Label, Modal, Select, Table, TextInput } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { ModalItem } from "./modalItem/modalItem";
import { ModalConfirmar } from "@/components/afapSaude/components/modalConfirmar";
import useApiPost from "@/hooks/useApiPost";
import { Button } from "@/components/ui/button";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { SubmitHandler, useForm } from "react-hook-form";
import { Sub } from "@radix-ui/react-menubar";

interface ReqProps{
    id?:string,
    status?:Array<string>,
    nome?:string,
    startDate?:string,
    endDate?:string
}

export interface LeadProps {
    index: number,
    id_lead: number,
    visita: Date,
    id_usuario: string,
    id_plano: number,
    plano: string,
    origem: string,
    valor_mensalidade: number
    nome: string,
    endereco: string,
    possuiPet: string
    planoPet: string,
    status: string,
    bairro: string,
    numero: number,
    data_nasc: Date,
    cep: string,
    rg: string,
    cpfcnpj: string,
    guia_rua: string,
    cidade: string,
    celular1: string,
    vencimento: Date | undefined,
    celular2: string,
    empresaAtual: string,
    servicosUsados: string,
    motivo: string,
    planodesaude: string,
    indicacao: string,
    usuario: string,
    data: Date,
    dependentes: Array<Partial<{ nome: string, celular: string, data_nasc: Date, grau_parentesco: string }>>
}

export function Historico() {
    const { postData, data } = useApiGet<Array<LeadProps>, ReqProps>("/lead/lista")
    const [lead, setLead] = useState<Partial<LeadProps>>()
    const [modalLead, setModalLead] = useState(false)
    const [categoria, setCategoria] = useState("")
    const [modalConfirma, setModalConfirma] = useState(false)
    const [modalFiltro, setModalFiltro] = useState(false)
    const { postData: postCategoria } = useApiPost<LeadProps, { id_lead: number | undefined, categoriaAtual: string, categoriaAnt: string | undefined, usuario: string | undefined }>("/leads/alterarCategoria")


    const onChangeCategoria = (e: React.ChangeEvent<HTMLSelectElement>, lead: Partial<LeadProps>) => {
        if (lead.status === e.target.value) {
            return;
        };
        setCategoria(e.target.value);
        setLead(lead);
        setModalConfirma(true)
    }


    const handleAtualizarCategoria = useCallback(async () => {
        try {
            await postCategoria({ categoriaAtual: categoria, categoriaAnt: lead?.status, usuario: lead?.usuario, id_lead: lead?.id_lead })

            postData({})

            setModalConfirma(false)

        } catch (error) {
            console.log(error)
        }


    }, [categoria, lead?.id_lead])



    const reqDados:SubmitHandler<ReqProps> = useCallback(async (data) => {
        try {
            postData(data)

        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        reqDados({})
    }, [])


    return (
        <div className="flex-col w-full px-2 bg-white   ">
            <ModalFiltro handleOnSubmit={reqDados} show={modalFiltro} onClose={() => setModalFiltro(false)} />
            <ModalItem item={lead ?? {}} open={modalLead} onClose={() => setModalLead(false)} />
            <ModalConfirmar pergunta={`Tem certeza que deseja alterar o(a) ${lead?.status} para um(a) ${categoria} ? Essa alteração será contabilizada na faturação!`} handleConfirmar={handleAtualizarCategoria} openModal={modalConfirma} setOpenModal={setModalConfirma} />

            <div className="flex flex-row w-full ">

                <Button onClick={() => setModalFiltro(true)} className="ml-auto" size={'sm'} variant={'outline'}>FILTRAR</Button>
            </div>


            <div className="overflow-y-auto mt-2 px-2 h-[calc(100vh-145px)]   ">
                <Table striped hoverable theme={{ body: { cell: { base: " px-3 py-1  text-[11px] text-black" } } }}  >
                    <Table.Head theme={{ cell: { base: "px-3 py-2 text-xs text-black font-bold bg-gray-50" } }} >
                        <Table.HeadCell >
                            Nome
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Previsão de Visita
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Data
                        </Table.HeadCell>
                        <Table.HeadCell >
                            categoria
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Vendedor
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Celular1
                        </Table.HeadCell>
                        <Table.HeadCell >
                            Celular2
                        </Table.HeadCell>

                    </Table.Head>
                    <Table.Body className="divide-y">
                        {data?.map((item, index) => (

                            <>
                                <Table.Row className="bg-white cursor-pointer " key={index} onClick={() => { setLead(item), setModalLead(true) }} >

                                    <Table.Cell className="">
                                        {item?.nome}
                                    </Table.Cell>
                                    <Table.Cell className="">
                                        {item?.visita && new Date(item?.visita).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Table.Cell>

                                    <Table.Cell className="">
                                        {item?.data && new Date(item?.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Table.Cell>

                                    <Table.Cell onClick={e => { e.stopPropagation() }} className={`${item?.status === 'LEAD' ? 'text-blue-600' : item.status === 'PROSPECCAO' ? 'text-yellow-500' : 'text-green-500'}`} >
                                        <select onChange={e => onChangeCategoria(e, item)} className="appearance-none border-none text-xs" value={item?.status}>
                                            <option>LEAD</option>
                                            <option>PROSPECCAO</option>
                                            <option>PRE VENDA</option>
                                            <option>VENDA</option>
                                        </select>
                                    </Table.Cell>
                                    <Table.Cell >
                                        {item?.usuario}
                                    </Table.Cell>

                                    <Table.Cell >
                                        {item?.celular1}
                                    </Table.Cell>

                                    <Table.Cell >
                                        {item?.celular2}
                                    </Table.Cell>


                                </Table.Row>

                            </>
                        ))}



                    </Table.Body>

                </Table>



            </div>

        </div>
    )
}



interface DataProps {
    show: boolean,
    onClose: () => void
    handleOnSubmit: SubmitHandler<ReqProps>
}
export const ModalFiltro = ({ onClose, show, handleOnSubmit }: DataProps) => {
    const {register,handleSubmit,control} = useForm<ReqProps>()


    return (
        <Modal size="sm" popup show={show} onClose={onClose}>
            <Modal.Header />
            <Modal.Body>
                <form className="flex flex-col gap-2 mt-1" >
                    <div>
                        <Label className="text-xs" value="Nome" />
                        <TextInput {...register('nome')} className="uppercase" sizing={'sm'} placeholder="NOME" />
                    </div>

                    <div>
                        <Label className="text-xs" value="Categoria" />
                        <Select {...register('status')} sizing={'sm'}>
                            <option value={"LEAD"}>LEAD</option>
                            <option value={"PROSPECCAO"}>PROSPECÇÃO</option>
                            <option value={"PRE VENDA"}>PRE VENDA</option>
                            <option value={"VENDA"}>VENDA</option>
                        </Select>
                    </div>
                    <div className="inline-flex w-full justify-between gap-2">
                        <div >

                            <Label className="text-xs" value="Data inicio" />

                            <DatePicker selected={new Date()} onChange={e => { }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>

                        <div >

                            <Label className="text-xs" value="Data fim" />

                            <DatePicker selected={new Date()} onChange={e => { }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                    </div>


                    <Button>Aplicar</Button>

                </form>
            </Modal.Body>

        </Modal>
    )
}