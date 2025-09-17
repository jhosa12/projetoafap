'use client'

import React, { useContext, useState } from "react"
import FormularioConv from "../../../_components/convalescentes/formulario-conv";
import { Button } from "@/components/ui/button";
import useActionsNovoResgistro from "../../../_hooks/useActionsNovoRegistro";
import { useParams } from "next/navigation";
import { AuthContext } from "@/store/AuthContext";


export default function EditarConv() {

    const params = useParams()
    const id = params.id as string | undefined;
    const isEditMode = !!id;

    const {


        dataInputs,
        estoque,
        listaMaterial,
        indexProd,
        data,
        listaConv,
        titular,
        listarProdutos,
        componentRefComprovante,
        componentRefContrato,
        isLoading,
        produtosAdicionados,
        selecionarProduto,

        setTitular,
        closeModa,
        setMaterial,
        setIndex,
        handleSalvar,
        handleSelecionarProduto,
        handleAdicionarProdutoNaLista,
        usarDadosTitular,
        setUsarDadosTitular,
        isDependenteSelecionado,
        isModalOpen,
        rowSelection,
        handleCheckboxTitularChange,
        handleConfirmarSelecaoDependente,
        setIsModalOpen,
        setDependenteSelecionado,
        setRowSelection,

        setarListaConv,
        imprimirComprovante,
        imprimirContrato,
        setInputs,
        adicionarProduto,
        receberDev,
        editarRegistro,
        adicionarNovoRegistro,


    } = useActionsNovoResgistro()

    const {

        infoEmpresa,
        ufs,
        dadosassociado,
        carregarDados,


    } = useContext(AuthContext);


    return (
        <>
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                {/* Cabeçalho da página */}
                <div className="flex flex-col p-2 gap-4 items-center">

                    <div className="flex w-full justify-between">
                        <h1 className="w-full justify-between scroll-m-20 text-gray-800 pb-2 
                    text-2xl font-semibold tracking-tight first:mt-0">
                            Registro de Convalescença
                        </h1>

                        <Button onClick={handleSalvar}>
                            {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                        </Button>
                    </div>

                    <FormularioConv

                        listaConv={listaConv}
                        produtosAdicionados={produtosAdicionados}
                        listarProdutos={listarProdutos}
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

                    />
                </div>
            </div>
        </>
    );
}
