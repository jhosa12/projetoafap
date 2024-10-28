
import { Button, Table } from "flowbite-react"
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { RiAlertLine } from "react-icons/ri";
import { ModalFiltroMov } from "./modalFiltro";
import { api } from "@/services/apiClient";
import { HiArrowDown, HiDocumentArrowUp } from "react-icons/hi2";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSolidPrinter } from "react-icons/bi";
import { useReactToPrint } from "react-to-print";
import RelatorioMov from "@/Documents/estoque/RelatorioMov";
import { GrRevert } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { ModalConfirm } from "./modalConfirm";


interface DataProps {
    usuario: string,
    id_usuario: string,
    permissoes: Array<string>
}

export interface HistoricoProps {
    data: Date,
    id_empresa: string,
    descricao: string,
    empresa: string,
    id_mov: number,
    produtos: Array<{ produto: string, id_produto: number, quantidade: number }>,
    tipo: string,
    usuario: string
}

export default function  HistoricoMov({ id_usuario, usuario,permissoes }: DataProps) {
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [openModal, setOpenModal] = useState<boolean>(false)
    const { empresas } = useContext(AuthContext)
    const [historico, setHistorico] = useState<Array<HistoricoProps>>([])
    const [dadosMov, setDadosMov] = useState<Partial<HistoricoProps>>()
    const componentRef = useRef<RelatorioMov>(null)
    const [isPending, startTransition] = useTransition();
    const [dadosEstorno,setDadosEstorno] = useState< {
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

        try {
            const response = await toast.promise(
                api.put('/estoque/historico/estorno', {
                    ...dadosEstorno,
                    produtos: dadosEstorno?.produtos?.filter(p => p.id_produto !== dadosEstorno.id_produto)
                }),
                {
                    pending: 'Estornando movimentação',
                    success: 'Movimentação estornada com sucesso',
                    error: 'Erro ao estornar movimentação'
                }
    
            )

            handleFiltro({ startDate: new Date(), endDate: new Date(), id_empresa: '' })
          /*  if (response.data) {
                setHistorico((prev) => prev.filter((h) => h.id_mov !== id_mov));
            }*/

        } catch (error) {
            console.log(error);
            toast.error('Erro ao estornar movimentacao');
        }
    };

    useEffect(() => {

        if (dadosMov) {
            handleImpressao()
        }

    }, [dadosMov])


    const handleImpressao = useReactToPrint({
        pageStyle: `
    @page {
        margin: 1rem;
    }
    @media print {
        body {
            -webkit-print-color-adjust: exact;
        }
        @page {
            size: auto;
            margin: 1rem;
        }
        @page {
            @top-center {
                content: none;
            }
            @bottom-center {
                content: none;
            }
        }
    }
`,
        documentTitle: 'MOVIMENTAÇÃO DE ESTOQUE',

        content: () => componentRef.current,
        onAfterPrint: () => {
            setDadosMov(undefined)
        }

    })


    const handleFiltro = async ({ startDate, endDate, id_empresa, signal }: { startDate: Date, endDate: Date, id_empresa: string, signal?: AbortSignal }) => {
        startTransition(async() => {
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

          {  <ModalConfirm status={'ESTORNO'} handleMovimentar={handleEstorno} open={openModalConfirm} setOpen={setOpenModalConfirm} />}
    
            <div className="flex-col w-full p-2  rounded-lg bg-white h-[79vh] ">

                <Button theme={{
                    color: {
                        light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100   "
                    }
                }}
                    color={"light"}
                    size={'sm'}
                    className="ml-auto"
                    onClick={() => setOpenModal(true)}
                >FILTRO
                </Button>

                <div className="overflow-y-auto mt-1 px-2 max-h-[70vh] ">
                    <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                        <Table.Head >
                            <Table.HeadCell >
                                DESCRIÇÃO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                DATA
                            </Table.HeadCell>
                            <Table.HeadCell >
                                EMPRESA
                            </Table.HeadCell>
                            <Table.HeadCell >
                                USUÁRIO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                TIPO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                AÇÕES
                            </Table.HeadCell>
                            <Table.HeadCell >

                            </Table.HeadCell>

                        </Table.Head>
                        <Table.Body className="divide-y">
                            {historico?.map((item, index) => {


                                return (<>  <Table.Row className="bg-white hover:cursor-pointer " key={index} onClick={() => toogleAberto(index)} >

                                    <Table.Cell className="font-semibold">
                                        {item.descricao}
                                    </Table.Cell>


                                    <Table.Cell className="text-black font-semibold  inline-flex items-center gap-2">
                                        {new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </Table.Cell>
                                    <Table.Cell className="text-black font-semibold ">
                                        {item.empresa}
                                    </Table.Cell>
                                    <Table.Cell className="text-black font-semibold " >
                                        {item.usuario}

                                    </Table.Cell>
                                    <Table.Cell className={`font-bold ${item.tipo === 'ENTRADA' ? 'text-green-500' : 'text-red-500'}  }`} >
                                        {item.tipo}

                                    </Table.Cell>

                                    <Table.Cell className="inline-flex gap-6 text-gray-600  font-semibold" >
                                        <button onClick={e => {
                                            e.stopPropagation(); setDadosMov(item)
                                        }} data-tooltip-id="tooltip" data-tooltip-content="Imprimir" className="hover:text-blue-600">  <BiSolidPrinter size={18} />
                                        </button>



                                    </Table.Cell>
                                    <Table.Cell className="text-black  font-semibold" >
                                        <MdKeyboardArrowDown size={16} />



                                    </Table.Cell>
                                </Table.Row>
                                    {
                                        abertos[index] && item.produtos.map(prod => (
                                            <Table.Row className="bg-slate-100" key={prod.id_produto}>
                                                <Table.Cell className="text-black font-semibold pl-12 italic ">{prod.produto}</Table.Cell>
                                                <Table.Cell className="text-black font-semibold ">QUANT.: {prod.quantidade}</Table.Cell>
                                                <Table.Cell className="text-black "></Table.Cell>
                                                <Table.Cell className="text-black "></Table.Cell>
                                                <Table.Cell className="text-black "></Table.Cell>
                                                <Table.Cell className="text-black ">
                                                    <button disabled={!permissoes.includes('EST2.2')} type="button" data-id={prod.id_produto} onClick={()=>{setDadosEstorno({id_empresa:item.id_empresa,id_produto:prod.id_produto,quantidade:prod.quantidade,tipo:item.tipo,id_mov:item.id_mov,produtos:item.produtos}),setOpenModalConfirm(true)}}  data-tooltip-id="tooltip" data-tooltip-content="Estornar" className="hover:text-yellow-500 disabled:cursor-not-allowed">
                                                        <GrRevert size={16} />
                                                    </button></Table.Cell>
                                                <Table.Cell className="text-black "></Table.Cell>
                                            </Table.Row>

                                        ))
                                    }
                                    <Tooltip id="tooltip" />
                                </>

                                )



                            })}




                        </Table.Body>

                    </Table>



                </div>

            </div>

        </>
    )
}