import { Button, ButtonGroup, Table } from "flowbite-react";
import useApiPost from "@/hooks/useApiPost";
import { useEffect, useState } from "react";
import { themeLight } from "@/app/dashboard/admcontrato/_components/acordos/screen";
import { FaFilter } from "react-icons/fa6";
import { IoPrint } from "react-icons/io5";
import { IoMdAddCircle, IoMdTrash } from "react-icons/io";
import { ajustarData } from "@/utils/ajusteData";
import { EmpresaProps } from "@/types/empresa";
import { MdEdit } from "react-icons/md";

import { api } from "@/lib/axios/apiClient";
import { MetasProps, SetorProps } from "@/components/vendas/acompanhamento";
import { FormProps, ModalMetas } from "@/components/vendas/modalMetas";
import { ModalFiltroMetas } from "@/components/vendas/modalFiltro";
import { PlanoContasProps } from "@/pages/dashboard/financeiro";
import { toast } from "sonner";

interface FormFiltro {
    startDate: string | undefined,
    endDate: string | undefined,
    id_empresa: string,

}
interface DataProps {
    id_empresa: string
    empresas: Array<EmpresaProps>,
    setores: Array<SetorProps>
    planoContas: Array<PlanoContasProps>
}



export function GerenciarMetas({ id_empresa, empresas, setores, planoContas }: DataProps) {

    const [modalFiltro, setModalFiltro] = useState(false)
    const [modalNovaMeta, setModalNovaMeta] = useState(false)
    const { data, postData, loading } = useApiPost<Array<MetasProps>, FormFiltro>("/vendas/filtroMetas")
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
    const [meta, setMeta] = useState<Partial<MetasProps>>()



    const handleNovo = async (data: FormProps) => {

        toast.promise(
            api.post('/vendas/novaMeta', {
                id_grupo: 1,
                id_empresa,
                date: data.date,
                dateFimMeta: data.dateFimMeta,
                valor: data.valor,
                descricao: data.descricao,
            }),
            {
                loading: 'Salvando Dados....',
                success: 'Dados Salvos com Sucesso',
                error: 'Erro ao salvar dados',
            }
        )
        //  setMetas([...arrayMetas,response.data])
    };

    useEffect(() => {
        if (id_empresa) {
            handleFiltro()
        }
    }, [id_empresa])

    const handleFiltro = async () => {
        const { dataFim, dataIni } = ajustarData(startDate, endDate)
        const payload = {
            startDate: dataIni,
            endDate: dataFim,
            id_empresa
        }
        await postData(payload)
    }
    return (

        <div className="flex flex-col w-full px-4">
            {modalNovaMeta &&
                <ModalMetas
                    handleNovaMeta={handleNovo}
                    arrayMetas={data ?? []}
                    id_empresa={id_empresa}
                    arraySetores={setores}
                    meta={meta ?? {}}
                    planoContas={planoContas}
                    setModalMetas={setModalNovaMeta}
                    show={modalNovaMeta}
                />}

            {
                modalFiltro && <ModalFiltroMetas
                    filtrar={handleFiltro}
                    endDate={endDate}
                    loading={loading}
                    setEndDate={setEndDate}
                    setFiltro={setModalFiltro}
                    setStartDate={setStartDate}
                    startDate={startDate}
                    arraySetores={setores}
                    show={modalFiltro}
                />

            }

            <ButtonGroup className="ml-auto">
                <Button theme={themeLight} onClick={() => setModalFiltro(true)} type="button" color='light' size='xs'><FaFilter className='mr-1 h-4 w-4' />FILTRAR</Button>

                <Button theme={themeLight} onClick={() => { setMeta({}), setModalNovaMeta(true) }} type="button" color='light' size='xs'><IoMdAddCircle className='mr-1 h-4 w-4' />NOVA META</Button>


                <Button theme={themeLight} onClick={() => {
                    meta?.id_meta ? setModalNovaMeta(true) : toast.info('SELECIONE UMA META')
                }} color='light' size='xs'>  <MdEdit className='mr-1 h-4 w-4' />EDITAR</Button>

                <Button theme={themeLight} onClick={() => window.print()} color='light' size='xs'>  <IoMdTrash className='mr-1 h-4 w-4' />EXCLUIR</Button>

                <Button theme={themeLight} onClick={() => window.print()} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> IMPRIMIR</Button>



            </ButtonGroup>

            <div className="w-full  max-h-[calc(100vh-160px)] overflow-y-auto mt-1">
                <Table
                    theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-6 py-1" } }, head: { cell: { base: "px-6 py-1" } } }}>
                    <Table.Head >
                        <Table.HeadCell>
                            DESCRIÇÃO
                        </Table.HeadCell>
                        <Table.HeadCell >
                            DATA INICIO
                        </Table.HeadCell>
                        <Table.HeadCell >
                            DATA FIM.
                        </Table.HeadCell>
                        <Table.HeadCell >
                            VALOR
                        </Table.HeadCell>
                        <Table.HeadCell >
                            EMPRESA
                        </Table.HeadCell>

                    </Table.Head>
                    <Table.Body className="divide-y text-black"  >
                        {Array.isArray(data) && data?.map((item, index) => (
                            <Table.Row
                                onClick={() => setMeta(item)}
                                className={` hover:cursor-pointer hover:bg-gray-300 ${meta?.id_meta === item.id_meta && 'bg-gray-300'} `} key={index}>
                                <Table.Cell >
                                    {item.descricao}
                                </Table.Cell>
                                <Table.Cell >
                                    {new Date(item.date || '').toLocaleDateString()}

                                </Table.Cell>

                                <Table.Cell >
                                    {new Date(item.dateFimMeta || '').toLocaleDateString()}
                                </Table.Cell>
                                <Table.Cell >
                                    {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Table.Cell>
                                <Table.Cell >
                                    {empresas?.find((emp) => emp.id === item.id_empresa)?.nome}
                                </Table.Cell>

                            </Table.Row>

                        ))}

                    </Table.Body>

                </Table>
            </div>

        </div>
    )
}