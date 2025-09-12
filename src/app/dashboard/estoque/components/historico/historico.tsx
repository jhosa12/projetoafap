import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Fragment, useContext, useEffect, useRef, useState, useTransition } from "react";
import { AuthContext } from "@/store/AuthContext";
import { ModalFiltroMov } from "../../../../../components/modals/estoque/modalFiltro";
import { api } from "@/lib/axios/apiClient";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSolidPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import RelatorioMov from "@/Documents/estoque/RelatorioMov";
import { GrRevert } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import { ModalConfirm } from "../../../../../components/modals/estoque/modalConfirm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pageStyle } from "@/utils/pageStyle";

interface DataProps {
    // usuario: string,
    //  id_usuario: string,
    permissoes: Array<string>
}

export interface HistoricoProps {
    data: Date,
    id_empresa: string,
    descricao: string,
    empresa: string,
    id_mov: number,
    produtos: Array<{ produto: string, id_produto: number, quantidade: number, quant_atual: number, quant_anterior: number }>,
    tipo: string,
    usuario: string
}

export default function HistoricoMov({ permissoes }: DataProps) {
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [openModal, setOpenModal] = useState<boolean>(false)
    const { empresas } = useContext(AuthContext)
    const [historico, setHistorico] = useState<Array<HistoricoProps>>([])
    const [dadosMov, setDadosMov] = useState<Partial<HistoricoProps>>()
    const componentRef = useRef<HTMLDivElement>(null)
    const [isPending, startTransition] = useTransition();
    const [dadosEstorno, setDadosEstorno] = useState<{
        id_produto: number,
        id_mov: number,
        produtos: Array<{ produto: string, id_produto: number, quantidade: number }>,
        id_empresa: string,
        tipo: string,
        quantidade: number
    }>()
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)



    const handleEstorno = async () => {
        if (!dadosEstorno?.id_mov || !dadosEstorno.id_empresa || !dadosEstorno.id_produto) return;



        toast.promise(
            api.put('/estoque/historico/estorno', {
                ...dadosEstorno,
                produtos: dadosEstorno?.produtos?.filter(p => p.id_produto !== dadosEstorno.id_produto)
            }),
            {
                loading: 'Estornando movimentação...',
                success: () => {
                    handleFiltro({ startDate: new Date(), endDate: new Date(), id_empresa: '' })
                    return 'Movimentação estornada com sucesso'
                },
                error: 'Erro ao estornar movimentação'
            }

        )




        /*  if (response.data) {
              setHistorico((prev) => prev.filter((h) => h.id_mov !== id_mov));
          }*/


    };

    useEffect(() => {

        if (dadosMov) {
            handleImpressao()
        }

    }, [dadosMov])


    const handleImpressao = useReactToPrint({
        pageStyle: pageStyle,

        documentTitle: 'MOVIMENTAÇÃO DE ESTOQUE',

        contentRef: componentRef,
        onAfterPrint: () => {
            setDadosMov(undefined)
        }

    })


    const handleFiltro = async ({ startDate, endDate, id_empresa, signal }: { startDate: Date, endDate: Date, id_empresa: string, signal?: AbortSignal }) => {
        startTransition(async () => {
            try {
                const response = await api.post('/estoque/historico/filtro', {
                    startDate,
                    endDate,
                    id_empresa
                }, { signal })

                setHistorico(response.data)
                console.log(response.data)

            } catch (error) {
                console.log(error)
            }

        })

    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        handleFiltro({ startDate: new Date(), endDate: new Date(), id_empresa: '', signal })

        return () => {
            controller.abort()
        }
    }, [])


    const toogleAberto = (index: number) => {
        setAbertos((prev: { [key: number]: boolean }) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[Number(key)] = false;
                return acc;
            }, {} as { [key: number]: boolean }),
            [index]: !prev[index]
        }));
    };


    return (
        <>

            <div style={{ display: 'none' }}>

                <RelatorioMov ref={componentRef} dados={dadosMov ?? {}} />

            </div>

            <ModalFiltroMov handleFiltro={handleFiltro} openModal={openModal} setOpenModal={setOpenModal} empresas={empresas} />

            {<ModalConfirm status={'ESTORNO'} handleMovimentar={handleEstorno} open={openModalConfirm} setOpen={setOpenModalConfirm} />}

            <div className="flex-col w-full p-2  rounded-lg bg-white h-[79vh] ">
                <div className="flex w-full">
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        className="ml-auto text-black  mr-8"
                        onClick={() => setOpenModal(true)}
                    >FILTRO
                    </Button>
                </div>


                <div className="overflow-y-auto mt-1 px-2 max-h-[70vh] ">
                    <Table className="text-xs text-black">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-1 border-b">DESCRIÇÃO</TableHead>
                                <TableHead className="px-4 py-1 border-b">DATA</TableHead>
                                <TableHead className="px-4 py-1 border-b">EMPRESA</TableHead>
                                <TableHead className="px-4 py-1 border-b">USUÁRIO</TableHead>
                                <TableHead className="px-4 py-1 border-b">TIPO</TableHead>
                                <TableHead className="px-4 py-1 border-b">AÇÕES</TableHead>
                                <TableHead className="px-4 py-1 border-b"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y text-black">
                            {historico?.map((item, index) => (
                                <Fragment key={index}>
                                <TableRow className="bg-white hover:cursor-pointer" onClick={() => toogleAberto(index)}>
                                    <TableCell className="px-4 py-1">
                                        {item.descricao}
                                    </TableCell>
                                    <TableCell className="px-4 py-1 inline-flex items-center gap-2">
                                        {new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </TableCell>
                                    <TableCell className="px-4 py-1">
                                        {item.empresa}
                                    </TableCell>
                                    <TableCell className="px-4 py-1">
                                        {item.usuario}
                                    </TableCell>
                                    <TableCell className={`px-4 py-1 font-bold ${item.tipo === 'ENTRADA' ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.tipo}
                                    </TableCell>
                                    <TableCell className="px-4 py-1 inline-flex gap-6 text-gray-600">
                                        <button onClick={e => {
                                            e.stopPropagation(); setDadosMov(item)
                                        }} data-tooltip-id="tooltip" data-tooltip-content="Imprimir" className="hover:text-blue-600">  <BiSolidPrinter size={18} />
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-4 py-1">
                                        <MdKeyboardArrowDown size={16} />
                                    </TableCell>
                                </TableRow>
                                {abertos[index] && item.produtos.map((prod) => (
                                    <TableRow className="bg-slate-100" key={prod.id_produto}>
                                        <TableCell className="text-black font-semibold pl-12 italic ">{prod.produto}</TableCell>
                                        <TableCell className="text-black font-semibold ">QUANT MOVIMENTADA.: {prod.quantidade}</TableCell>
                                        <TableCell className="text-black ">QUANT ANTERIOR.: {prod.quant_anterior}</TableCell>
                                        <TableCell className="text-black ">QUANT ATUAL.: {prod.quant_atual}</TableCell>
                                        <TableCell className="text-black "></TableCell>
                                        <TableCell className="text-black ">
                                            <button disabled={!permissoes.includes('EST2.2')} type="button" data-id={prod.id_produto} onClick={() => { setDadosEstorno({ id_empresa: item.id_empresa, id_produto: prod.id_produto, quantidade: prod.quantidade, tipo: item.tipo, id_mov: item.id_mov, produtos: item.produtos }), setOpenModalConfirm(true) }} data-tooltip-id="tooltip" data-tooltip-content="Estornar" className="hover:text-yellow-500 disabled:cursor-not-allowed">
                                                <GrRevert size={16} />
                                            </button></TableCell>
                                        <TableCell className="text-black "></TableCell>
                                    </TableRow>
                                ))}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <Tooltip id="tooltip" />
                </div>
            </div>

        </>
    )
}