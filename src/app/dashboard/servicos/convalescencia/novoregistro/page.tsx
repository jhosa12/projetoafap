'use client';

import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { TbAlertTriangle, TbWheelchair } from "react-icons/tb";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDownIcon, FileText, Search, Shield, User } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FormularioConv from "../../_components/convalescentes/formulario-conv";
import { X } from 'lucide-react';
import { useParams } from "next/navigation";


export default function ConvalescenciaNovo() {

    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        busca: false,
        altPlano: false,
        inativar: false,
        impressao: false,
    });

    const params = useParams()
    const id = params.id as string | undefined;
    const isEditMode = !!id;


    const {


        dataInputs,
        estoque,
        listaMaterial,
        data,
        listaConv,
        titular,
        listarProdutos,
        isLoading,
        produtosAdicionados,
        selecionarProduto,
        setSelecionarProduto,
        setUsarDadosTitular,

        setTitular,
        closeModa,
        setMaterial,
        handleSalvar,
        handleSelecionarProduto,
        handleAdicionarProdutoNaLista,
        usarDadosTitular,
        isDependenteSelecionado,
        isModalOpen,
        rowSelection,
        handleCheckboxTitularChange,
        handleConfirmarSelecaoDependente,
        setIsModalOpen,
        setDependenteSelecionado,
        setRowSelection,

        setarListaConv,
        setInputs,
        adicionarProduto,
        editarRegistro,
        adicionarNovoRegistro,
        deletarProdutoConv


    } = useActionsNovoResgistro()

    const {

        infoEmpresa,
        ufs,
        dadosassociado,
        carregarDados,
        limparDados,


    } = useContext(AuthContext);






    const filtrosDaPagina = [
        { value: "Contrato", label: "Contrato" },
        { value: "Titular", label: "Titular" },
    ];

    useEffect(() => {

        return () => {

            limparDados()
        }
    }, [limparDados])

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <>

            {modal.busca && (
                <ModalBusca
                    carregarDados={carregarDados}
                    selectEmp={infoEmpresa?.id ?? ""}
                    visible={modal.busca}
                    setVisible={() => setModal({ busca: false })}
                    filtros={filtrosDaPagina}
                />
            )}

        
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <div className="flex flex-row p-2 gap-4 items-center">
                    <h1 className="w-full justify-between scroll-m-20 text-gray-800 pb-2 
                    text-2xl font-semibold tracking-tight first:mt-0">
                        Solicitar Convalescente
                    </h1>

                    <div className="flex items-center gap-3 flex-nowrap">

                        {dadosassociado?.id_global ? (

                            <>
                                <Badge variant="outline" className="px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0">
                                    <User className="h-4 w-4 mr-2" />
                                    {dadosassociado.nome}
                                </Badge>

                                <Badge variant="secondary" className="px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Contrato: {dadosassociado.contrato?.id_contrato}
                                </Badge>

                                <Badge variant="outline" className="px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0 border-[#c5942b] text-[#c5942b]">
                                    <Shield className="h-4 w-4 mr-2" />
                                    {dadosassociado.contrato?.plano}
                                </Badge>

                                <Badge
                                    className={cn(
                                        "px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0",
                                        dadosassociado.contrato?.situacao === "ATIVO"
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-red-100 text-red-800 border-red-200"
                                    )}
                                >
                                    {dadosassociado.contrato?.situacao}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                                    onClick={limparDados}
                                >

                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (

                            <Badge variant="destructive" className="px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0">
                                <AlertTriangle className="h-4 w-4 mr-1.5" />
                                Nenhum Titular Selecionado
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-row gap-8">
                        <Button
                            disabled={!infoEmpresa}
                            size={"sm"}
                            onClick={() => setModal({ busca: true })}
                            type="button"
                        >
                            <Search />
                            Buscar
                        </Button>

                    </div>

                    <Button onClick={handleSalvar}>
                        {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                    </Button>

                </div>

                {/* Menu */}
                <FormularioConv
                    listaConv={listaConv}
                    produtosAdicionados={produtosAdicionados}
                    listarProdutos={listarProdutos}
                    setSelecionarProduto={setSelecionarProduto}
                    setUsarDadosTitular={setUsarDadosTitular}
                    selecionarProduto={selecionarProduto}
                    dadosassociado={dadosassociado}
                    ufs={ufs}
                    isEditMode={isEditMode}
                    usarDadosTitular={usarDadosTitular}
                    isDependenteSelecionado={isDependenteSelecionado}
                    isModalOpen={isModalOpen}
                    rowSelection={rowSelection}
                    setarListaConv={setarListaConv}
                    handleAdicionarProdutoNaLista={handleAdicionarProdutoNaLista} // Nome original
                    handleSelecionarProduto={handleSelecionarProduto} // Nome original
                    handleCheckboxTitularChange={handleCheckboxTitularChange}
                    handleConfirmarSelecaoDependente={handleConfirmarSelecaoDependente}
                    setIsModalOpen={setIsModalOpen}
                    setDependenteSelecionado={setDependenteSelecionado}
                    setRowSelection={setRowSelection}
                    deletarProdutoConv={deletarProdutoConv}
                />
            </div >
        </>
    )
}