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

    const [modalDependente, setModalDependente] = useState(false);
    const [modalComprovante, setComprovante] = useState(false);
    const [modalContrato, setModalContrato] = useState(false)
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

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


            {modalComprovante && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800">
                        <button type="button" onClick={() => setComprovante(!modalComprovante)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                            <button type="button" onClick={() => { }} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                <IoIosClose size={30} />
                            </button>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className="flex w-full justify-center items-center">
                                <TbAlertTriangle className='text-gray-400' size={60} />
                            </div>
                            <h3 className="mb-5 text-lg font-normal  text-gray-400">Deseja Confirmar a devolução desse produto?</h3>
                            <div className="flex flex-row gap-6 justify-center ">
                                <button onClick={() => receberDev('FECHADO')} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2  focus:z-10 bg-green-700 text-gray-200 border-gray-500 hover:text-white hover:bg-green-600 focus:ring-gray-600">Sim, imprimir</button>

                                <button onClick={() => setComprovante(false)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2  focus:z-10 bg-red-700 text-gray-200 border-gray-500 hover:text-white hover:bg-red-600 focus:ring-gray-600">Não, cancelar</button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>)}


            {modalContrato && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="flex items-center justify-center p-2 w-full h-full">
                    <div className="relative rounded-lg shadow bg-gray-800">
                        <button type="button" onClick={() => setModalContrato(!modalContrato)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                            <button type="button" onClick={() => { }} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                <IoIosClose size={30} />
                            </button>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <div className="flex w-full justify-center items-center">
                                <TbAlertTriangle className='text-gray-400' size={60} />
                            </div>
                            <h3 className="mb-5 text-lg font-normal  text-gray-400">Deseja Confirmar a Entrega desse produto?</h3>
                            <div className="my-2">
                                <label className="block mb-1 text-sm  font-medium  text-white">Codigo do Produto</label>
                                <select onChange={e => {

                                    setInputs({ ...dataInputs, id_estoque: Number(e.target.value) })
                                }}
                                    className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " >
                                    <option></option>
                                    {
                                        estoque.map((item, index) => {
                                            return (
                                                item.produto === listaMaterial[indexProd].descricao && <option key={index} value={item.id_estoque}>{item.codProd} - {item.estado}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="flex flex-row gap-6 justify-center ">
                                <button onClick={() => receberDev('ABERTO')} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2  focus:z-10 bg-green-700 text-gray-200 border-gray-500 hover:text-white hover:bg-green-600 focus:ring-gray-600">Sim, imprimir</button>

                                <button onClick={() => setModalContrato(false)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2  focus:z-10 bg-red-700 text-gray-200 border-gray-500 hover:text-white hover:bg-red-600 focus:ring-gray-600">Não, cancelar</button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>)}


            {/*visible && <ModalBusca visible={visible} setVisible={()=>setVisible(false)} />*/}
            {/* {modalDependente && dependente && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">

                    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-10 bg-gray-50 ">

                        <div className="fixed flex flex-col p-4 max-h-96  rounded-lg shadow bg-gray-700">
                            <div className="inline-flex border-b-[1px] text-white">
                                <h1>SELECIONE O DEPENDENTE</h1>
                                <button type="button" onClick={() => setModalDependente(false)} className="text-gray-400 bg-transparent rounded-lg text-sm h-4 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                    <IoIosClose size={30} />
                                </button>
                            </div>
                            <ul className="flex flex-col pt-2 overflow-y-auto text-gray-300 gap-2 ">
                                {dadosAssociado?.dependentes.map((item, index) => {
                                    return (
                                        item.excluido !== true && <li onClick={() => { setarListaConv({ nome: item.nome, data: item.data_nasc, id_dependente: item.id_dependente }); setModalDependente(false) }} className="flex cursor-pointer hover:bg-gray-700 bg-gray-600 p-1 pl-2 pr-2 rounded-lg ">
                                            {item.nome}
                                        </li>
                                    )

                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )} */}

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

                </div>

                {/* Menu */}
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
            </div >
        </>
    )
}