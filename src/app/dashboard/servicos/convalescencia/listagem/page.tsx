'use client';

import React, { useContext, useEffect, useRef, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { Tooltip } from 'react-tooltip';
import Link from "next/link";
import useActionsListagem from "../../_hooks/useActionsListagem";
import { format } from "date-fns";
import { Search, Plus, FileText, Printer, FileTextIcon, Receipt, ReceiptIcon, FileEditIcon, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import { usePaginatedData, DOTS } from "../../_hooks/useActionsPaginacao";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { FileUp } from 'lucide-react';
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import DocumentTemplateContrato from "@/app/dashboard/servicos/_documents/convalescencia/contrato/DocumentTemplate";
import { usePrintDocsAssociado } from "@/hooks/usePrintDocsAssociado";
import { AuthContext } from "@/store/AuthContext";
import { DadosAssociado } from "@/app/dashboard/admcontrato/_components/dados-associados/screen";
import { useActionsPrintConvalescenca } from "../../_hooks/useActionsPrintConvalescenca";
import { VerificarSituacao } from "@/app/dashboard/admcontrato/_utils/verificarSituacao";
import DocumentTemplateComprovante from "../../_documents/convalescencia/comprovante/DocumentTemplate";
import { AnyAaaaRecord } from "node:dns";
import { TabelaCompleta } from "../../_components/convalescentes/data-table";
import { ConvProps } from "../../_types/convalescente";
import { columns } from "../../_components/convalescentes/colunas-listagem";
import { truncate } from "node:fs";
import DocumentTemplateComprovanteGenerico from "../../_documents/convalescencia/comprovante/DocumentTemplateGenerico";
import { Docs } from "../../_hooks/useActionsPrintConvalescenca";
import { useTimeout } from "usehooks-ts";



export default function Convalescente() {
    const [modal, setModal] = useState(false)
    const [modalImprimirBotoes, setModalImprimirBotoes] = useState(false)
    const [documentoImprimir, setDocumentoImprimir] = useState<Docs | null>(null)
    const [itemSelecionado, setItemSelecionado] = useState<any | null>(null);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | null>(null)
    const [materialParaImpressao, setMaterialParaImpressao] = useState<any[]>([]);
    const [idContratoParaImpressao, setIdContratoParaImpressao] = useState<number | null>(null);
    const [tentandoImprimir, setTentandoImprimir] = useState<Docs | null>(null);

    const { usuario, infoEmpresa, dadosassociado } = useContext(AuthContext)

    const [rowSelection, setRowSelection] = useState({});

    const {


        // --- Estados que a UI irá ler ---
        pendente,
        aberto,
        entregue,
        criterio,
        input,
        arrayConv,
        listaConv,
        excluir,
        arrayFiltro,

        // --- Funções para alterar o estado  ---
        setPendente,
        setAberto,
        setEntregue,
        setCriterio,
        setInput,
        setExcluir,
        setFiltro,

        // --- Funções de Ação ---
        setarListaConv,
        listarConv,
        deletarConv,
        receberDevolucao,


    } = useActionsListagem()

    const {

        iniciarImpressao,
        componentRefs,
        documentoAtivo


    } = useActionsPrintConvalescenca(
        itemSelecionado,
        idContratoParaImpressao,
        usuario?.nome ?? "",
        infoEmpresa?.id ?? "",
        setarListaConv,
        () => {

            setModal(false),
            setItemSelecionado(false)
            setProdutoSelecionadoId(null)
            setTentandoImprimir(null)
            setDocumentoImprimir(null);
        },
    )

    const {

        currentPageData,
        currentPage,
        goToPage,
        nextPage,
        previousPage,
        paginationRange,
        isFirstPage,
        isLastPage,

    } = usePaginatedData({

        data: arrayFiltro,
        itemsPerPage: 10,
        siblingCount: 2

    });

    // const handleConfirmarDevolucao = async () => {

    //     if (!itemSelecionado) {
    //         toast.error("Nenhum item selecionado para devolução.")
    //         return
    //     }

    //     const materialFiltrado = (itemSelecionado.convalescenca_prod ?? []).filter(
    //         (produto: any) => produto.id_conv_prod === produtoSelecionadoId
    //     );

    //     setMaterialParaImpressao(materialFiltrado);
    //     try {

    //         await receberDevolucao(produtoSelecionadoId)

    //         iniciarImpressao(documentoImprimir)

    //     } catch (error) {
    //         toast.error("Não foi possível alterar o status.");
    //     }
    // }

    const linhaSelecionada: ConvProps | null = React.useMemo(() => {
        const indicesSelecionados = Object.keys(rowSelection)
        if (indicesSelecionados.length !== 1) {
            return null
        }

        const indice = parseInt(indicesSelecionados[0], 10)
        return arrayFiltro[indice] || null
    }, [rowSelection])


    const handleImprimirModal = (tipoDocumento: Docs) => {

        if (!linhaSelecionada) {
            toast("Por favor, selecione uma linha para Imprimir um Comprovante!")
            return
        }

        console.log("--- DADOS DA FONTE (linhaSelecionada) ---");
        console.log("Objeto completo:", linhaSelecionada);
        console.log("Nome:", linhaSelecionada.nome);
        console.log("ID Contrato Global:", linhaSelecionada.id_contrato_global);

        console.log("-----------------------------------------");

        setItemSelecionado(linhaSelecionada)
        setIdContratoParaImpressao(linhaSelecionada?.id_contrato_global ?? null)
        setDocumentoImprimir(tipoDocumento)
        setModalImprimirBotoes(true)

    }

    const handleExecutarImpressao = async () => {
        if (!documentoImprimir) return;

        if (documentoImprimir) {
            iniciarImpressao(documentoImprimir)
        }
    
        setModalImprimirBotoes(false);
    };

    const handleExcluir = () => {

        if (!linhaSelecionada) {
            toast("Por favor, selecione uma linha para Excluir!")
            return
        } else {

            setExcluir(true);
            setarListaConv({ id_conv: linhaSelecionada?.id_conv })

        }
    }


    useEffect(() => {
        listarConv();
    }, []);

    return (
        <>
            {/* {modal && itemSelecionado && (

                <ModalConfirmar

                    openModal={modal}
                    setOpenModal={() => {
                        setModal(false)
                        setProdutoSelecionadoId(null)
                    }}
                    handleConfirmar={handleConfirmarDevolucao}
                    pergunta="Qual produto você deseja fazer a devolução?"

                >

                    <div className="my-4 text-left">
                        <Label htmlFor="estoque-select">Selecione o produto:</Label>
                        <Select
                            onValueChange={(value) => {
                                setProdutoSelecionadoId(Number(value))
                            }}
                        >
                            <SelectTrigger id="estoque-select">
                                <SelectValue placeholder="Selecione um produto..." />
                            </SelectTrigger>
                            <SelectContent>
                                {itemSelecionado.convalescenca_prod?.map((produto: any) => (
                                    <SelectItem
                                        key={produto.id_produto}
                                        value={produto.id_conv_prod}
                                    >
                                        {produto.descricao}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox id="terms"
                            checked={printState.comprovante}
                            onCheckedChange={() => handlePrint('comprovante')} />
                        <Label htmlFor="terms">Imprimir Comprovante</Label>
                    </div>
                </ModalConfirmar>
            )} */}

            {excluir && (
                <ModalConfirmar
                    openModal={excluir}
                    setOpenModal={() => setExcluir(!excluir)}
                    handleConfirmar={() => deletarConv()}
                    pergunta="Realmente deseja deletar esse lançamento?"
                />
            )}

            {modalImprimirBotoes && itemSelecionado && (
                <ModalConfirmar
                    openModal={modalImprimirBotoes}
                    setOpenModal={() => setModalImprimirBotoes(false)}
                    handleConfirmar={handleExecutarImpressao}
                    pergunta={`Realmente deseja imprimir: ${documentoImprimir}?`}
                />
            )}


            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <Tooltip className="z-20" id="toolId" />
                <div className="flex flex-row w-full p-2 border-b items-center">

                    <h1 className="scroll-m-20 text-gray-800 pb-2 text-2xl font-semibold tracking-tight first:mt-0">Controle Convalescente</h1>
                    <div className="flex items-end w-full gap-8">
                        <div className="inline-flex gap-x-6">
                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    checked={pendente}
                                    onCheckedChange={() => { setPendente(!pendente) }}
                                />
                                <Label htmlFor="terms">ENTREGA PENDENTE</Label>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    checked={aberto}
                                    onCheckedChange={() => { setAberto(!aberto) }}
                                />
                                <Label htmlFor="terms">ABERTO</Label>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    checked={entregue}
                                    onCheckedChange={() => { setEntregue(!entregue) }}
                                />
                                <Label htmlFor="terms">ENTREGUE</Label>
                            </div>
                        </div>

                        <div className="flex w-full gap-8">
                            <Button
                                variant="outline"
                                onClick={() => handleImprimirModal('contrato')}
                                className="flex items-center gap-2">
                                <Printer />
                                Contrato
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleImprimirModal('comprovanteGenerico')}
                                className="flex items-center gap-2"
                            >
                                <ReceiptIcon />
                                Comprovante
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                            >
                                <Link
                                    href={`/dashboard/servicos/convalescencia/editar/${linhaSelecionada?.id_conv}`}>
                                    <div className="flex items-center gap-2">
                                        <FileEditIcon /> Editar
                                    </div>
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleExcluir}
                                className="flex items-center gap-2"
                            >
                                <Trash />
                                Excluir
                            </Button>
                        </div>
                        <Button
                            data-tooltip-id="toolId"
                            data-tooltip-content={'Adicionar Novo Registro'}
                        >
                            <Link
                                onClick={() => setarListaConv({
                                    bairro: '',
                                    bairro_r: '',
                                    cep: '',
                                    cep_r: '',
                                    cidade: '',
                                    cidade_r: '',
                                    complemento: '',
                                    complemento_r: '',
                                    contrato: { associado: { nome: '' }, carencia: '', situacao: '' },
                                    convalescenca_prod: [],
                                    cpf_cnpj: '',
                                    data: undefined,
                                    data_inc: undefined,
                                    descontos: undefined,
                                    forma_pag: '',
                                    hora_inc: undefined,
                                    id_associado: undefined,
                                    id_contrato: undefined,
                                    id_contrato_st: '',
                                    id_conv: undefined,
                                    logradouro: '',
                                    logradouro_r: '',
                                    nome: '',
                                    numero: undefined,
                                    numero_r: undefined,
                                    obs: '',
                                    status: '',
                                    subtotal: undefined,
                                    tipo_entrada: '',
                                    total: undefined,
                                    uf: '',
                                    uf_r: '',
                                    usuario: '',
                                    //  editar: false
                                })}
                                className="inline-flex justify-center items-center p-1 px-2 rounded-lg gap-2 text-sm"
                                href='/dashboard/servicos/convalescencia/novoregistro'

                            >
                                <Plus size={36} /> Add
                            </Link>

                        </Button>
                    </div>
                </div>
                <div>
                    <TabelaCompleta
                        columns={columns}
                        data={arrayFiltro}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                </div>

                <div style={{ display: "none" }}>

                    {documentoAtivo  === 'contrato' && itemSelecionado &&(
                        <DocumentTemplateContrato
                            bairro={itemSelecionado?.bairro ?? ""}
                            cidade={itemSelecionado?.cidade ?? ""}                        
                            cpf={itemSelecionado?.cpfcnpj ?? ""}                           
                            uf={itemSelecionado?.uf ?? ""}
                            nome={itemSelecionado?.nome ?? ""} 
                            rg={itemSelecionado?.rg ?? ""}
                            telefone={itemSelecionado?.celular1 ?? ""}
                            contrato={itemSelecionado?.contrato?.id_contrato ?? 0}
                            logradouro={itemSelecionado?.endereco ?? ""}
                            material={itemSelecionado?.convalescenca_prod ?? []}
                            ref={componentRefs.contrato}
                        />
                    )}


                    {documentoAtivo === 'comprovante' && itemSelecionado && (

                        <DocumentTemplateComprovante

                            nome={itemSelecionado?.nome ?? ""}
                            condicao={itemSelecionado?.status ?? ""}
                            material={materialParaImpressao}
                            ref={componentRefs.comprovante}
                        />
                    )}

                    {documentoAtivo === 'comprovanteGenerico' && itemSelecionado && (

                        <DocumentTemplateComprovanteGenerico
                            nome={itemSelecionado?.nome ?? ""}
                            ref={componentRefs.comprovanteGenerico}
                        />
                    )}
                </div>
            </div>
        </>
    )
}