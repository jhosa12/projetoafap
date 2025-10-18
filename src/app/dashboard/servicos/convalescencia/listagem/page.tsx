'use client';

import React, { useContext, useEffect, useMemo, useState } from "react"
import { Tooltip } from 'react-tooltip';
import Link from "next/link";
import useActionsListagem from "../../_hooks/listagem/useActionsListagem";
import { Plus, Printer, ReceiptIcon, FileEditIcon, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useConfirmarDevolucao } from "../../_hooks/listagem/useConfirmarDevolucao";
import { useDevolverProduto } from "@/app/dashboard/servicos/_hooks/listagem/useDevolverProduto";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { useImprimirModal } from "@/app/dashboard/servicos/_hooks/listagem/useImprimirModal";
import { useExecutarImpressao } from "@/app/dashboard/servicos/_hooks/listagem/useExecutarImpressao";
import { useEditar } from "@/app/dashboard/servicos/_hooks/listagem/useEditar";
import { useExcluir } from "@/app/dashboard/servicos/_hooks/listagem/useExcluir";
import DocumentTemplateContrato from "@/app/dashboard/servicos/_documents/convalescencia/contrato/DocumentTemplate";
import { AuthContext } from "@/store/AuthContext";
import { useActionsPrintConvalescenca } from "../../_hooks/listagem/useActionsPrintConvalescenca";
import DocumentTemplateComprovante from "../../_documents/convalescencia/comprovante/DocumentTemplate";
import { ConvProps } from "../../_types/convalescente";
import { columns } from "../../_components/convalescentes/colunas-listagem";
import DocumentTemplateComprovanteGenerico from "../../_documents/convalescencia/comprovante/DocumentTemplateGenerico";
import { Docs } from "../../_hooks/listagem/useActionsPrintConvalescenca";
import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ButtonGroup } from "@/components/ui/button-group";
import { DataTable } from "@/components/ui/data-table";

export default function Convalescente() {
    // 1. Estados
    const [modal, setModal] = useState(false);
    const [modalImprimirBotoes, setModalImprimirBotoes] = useState(false);
    const [documentoImprimir, setDocumentoImprimir] = useState<Docs | null>(null);
    const [itemSelecionado, setItemSelecionado] = useState<any | null>(null);
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | null>(null);
    const [materialParaImpressao, setMaterialParaImpressao] = useState<any[]>([]);
    const [idContratoParaImpressao, setIdContratoParaImpressao] = useState<number | null>(null);
    const [selecionarImpressaoModal, setSelecionarImpressaoModal] = useState(false);
    const [atualizacao, setAtualizacao] = useState(0);
    const [rowSelection, setRowSelection] = useState({});

    // 2. Contextos
    const router = useRouter();
    const { usuario, infoEmpresa } = useContext(AuthContext);

    // 3. Hooks de ações
    const {
        excluir,
        arrayFiltro,
        setExcluir,
        setarListaConv,
        listarConv,
        deletarConv,
        receberDevolucao,
    } = useActionsListagem();

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
            setModal(false);
            setItemSelecionado(false);
            setProdutoSelecionadoId(null);
            setDocumentoImprimir(null);
        },
    );

    // 4. Handlers customizados
    const handleConfirmarDevolucao = useConfirmarDevolucao();
    const handleDevolverProdutoClick = useDevolverProduto({ setItemSelecionado, setModal });
    const linhaSelecionada: ConvProps | null = React.useMemo(() => {
        const indicesSelecionados = Object.keys(rowSelection);
        if (indicesSelecionados.length !== 1) return null;
        const indice = parseInt(indicesSelecionados[0], 10);
        return arrayFiltro[indice] || null;
    }, [rowSelection, arrayFiltro]);
    const handleImprimirModal = useImprimirModal({
        linhaSelecionada,
        setItemSelecionado,
        setIdContratoParaImpressao,
        setDocumentoImprimir,
        setModalImprimirBotoes,
    });
    const handleExecutarImpressao = useExecutarImpressao({
        documentoImprimir,
        iniciarImpressao,
        setModalImprimirBotoes,
        setRowSelection,
    });
    const handleEditar = useEditar(linhaSelecionada);
    const { handleExcluir, handleConfirmarExclusao } = useExcluir({
        linhaSelecionada,
        setarListaConv,
        setExcluir,
        deletarConv,
        setAtualizacao,
        setRowSelection,
    });

    useEffect(() => {
        listarConv();
    }, [atualizacao]);

    // 5. Constantes utilitárias
    const nomesDocumentos = {
        contrato: 'Contrato',
        comprovanteGenerico: 'Comprovante'
    };
    const getColumns = useMemo(() => columns({
        onDevolverProduto: handleDevolverProdutoClick
    }), [handleDevolverProdutoClick]);


    return (

        <div className="flex flex-col w-full  lg:p-6 gap-4">
            <Tooltip className="z-20" id="toolId" />

            <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
                <h1 className="scroll-m-20 text-gray-800 text-2xl font-semibold tracking-tight whitespace-nowrap">
                    Controle Convalescente
                </h1>

                <div className="flex flex-col md:flex-row w-full md:w-auto items-end gap-4">
                    <ButtonGroup className="ml-auto">
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
                            <ReceiptIcon /> Comprovante
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleEditar}
                            className="flex items-center gap-2"
                        >
                            <FileEditIcon /> Editar
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExcluir}
                            className="flex items-center gap-2"
                        >
                            <span className="flex items-center text-red-600">
                                <Trash className="mr-1 h-4 w-4 text-red-600" />
                                Excluir
                            </span>
                        </Button>
                        <Button
                            data-tooltip-id="toolId"
                            data-tooltip-content={'Adicionar Novo Registro'}
                        >
                            <Link
                                onClick={() => setarListaConv({
                                    id_conv_global: undefined,
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
                    </ButtonGroup>
                </div>
            </div>
            <div className="flex-grow ">
                <DataTable
                    columns={getColumns}
                    data={arrayFiltro}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    maxHeight="max-h-[calc(100vh-250px)]"
                />
            </div>

            <div style={{ display: "none" }}>

                {/* Modais de Confirmação*/}

                {modal && itemSelecionado && (

                    <ModalConfirmar

                        openModal={modal}
                        setOpenModal={() => {
                            setModal(false)
                            setProdutoSelecionadoId(null)
                            setSelecionarImpressaoModal(false)
                        }}
                        handleConfirmar={() => handleConfirmarDevolucao({
                            itemSelecionado,
                            produtoSelecionadoId,
                            setMaterialParaImpressao,
                            receberDevolucao,
                            setAtualizacao,
                            selecionarImpressaoModal,
                            iniciarImpressao,
                        })}
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
                                    {(() => {
                                        const produtosAbertos = itemSelecionado.convalescenca_prod.filter(
                                            (produto: any) => produto.status === "ABERTO"
                                        );

                                        if (produtosAbertos.length > 0) {

                                            return produtosAbertos.map((produto: any) => (
                                                <SelectItem
                                                    key={produto.id_produto}
                                                    value={produto.id_conv_prod}
                                                >
                                                    {produto.descricao}
                                                </SelectItem>
                                            ));
                                        } else {
                                            return (
                                                <p className="px-4 text-red-700">Não possui nenhum produto pendente!</p>
                                            );
                                        }
                                    })()}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox id="terms"
                                checked={selecionarImpressaoModal}
                                onCheckedChange={(checked) => {
                                    console.log("EVENTO: Checkbox clicado! Novo valor recebido:", checked);
                                    setSelecionarImpressaoModal(Boolean(checked))
                                }
                                } />
                            <Label htmlFor="terms">Imprimir Comprovante</Label>
                        </div>
                    </ModalConfirmar>
                )}

                {excluir && (
                    <ModalConfirmar
                        openModal={excluir}
                        setOpenModal={() => setExcluir(!excluir)}
                        handleConfirmar={handleConfirmarExclusao}
                        pergunta="Realmente deseja deletar esse lançamento?"
                    />
                )}

                {modalImprimirBotoes && itemSelecionado && (
                    <ModalConfirmar
                        openModal={modalImprimirBotoes}
                        setOpenModal={() => setModalImprimirBotoes(false)}
                        handleConfirmar={handleExecutarImpressao}
                        pergunta={`Realmente deseja imprimir ${documentoImprimir === 'contrato' ? nomesDocumentos.contrato : nomesDocumentos.comprovanteGenerico}?`}
                    />
                )}

                {/* Documentos para Imprimir */}

                {documentoAtivo === 'contrato' && itemSelecionado && (
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
                        cpf={itemSelecionado.cpf}
                        endereco={itemSelecionado.endereco}
                        itens={itemSelecionado.convalescenca_prod}
                    />
                )}
            </div>
        </div>

    )
}