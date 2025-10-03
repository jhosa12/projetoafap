'use client';

import React, { useContext, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Search, Shield, User } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FormularioConv from "../../_components/convalescentes/formulario-conv";
import { X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { ConvProps } from "../../_types/convalescente";
import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos";
import { api } from "@/lib/axios/apiClient";
import { useSelecionarTitular } from "@/app/dashboard/servicos/_hooks/novo-registro/useSelecionarTitular";
import { ModalBuscaConv } from "../../_components/convalescentes/modal-busca-titular";
import { toast } from "sonner";


export default function ConvalescenciaNovo() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || undefined;
    const isEditMode = !!id;


    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        busca: false,
        altPlano: false,
        inativar: false,
        impressao: false,
    });


    const {

        infoEmpresa,
        ufs,
        dadosassociado,
        carregarDados,
        limparDados,


    } = useContext(AuthContext);

    const {
        listarProdutos,
        isLoading,
        handleSubmit: handleFormSubmit,
    } = useActionsNovoResgistro(isEditMode, id);

    // Filtros da página
    const filtrosDaPagina = [
        { value: "Contrato", label: "Contrato" },
        { value: "Titular", label: "Titular" },
    ];

    useEffect(() => {

        return () => {

            limparDados()
        }
    }, [limparDados])



    // Valores iniciais mínimos para ConvProps
    const methods = useForm<ConvProps>({
        defaultValues: {
            editar: false,
            id_conv: null,
            id_empresa: infoEmpresa?.id || '',
            id_contrato_st: '',
            tipo_convalescente: null,
            tipo_entrada: '',
            nome: '',
            cpf_cnpj: '',
            data: null,
            data_nasc: null,
            status: 'ABERTO',
            forma_pag: '',
            logradouro: '',
            numero: null,
            complemento: '',
            bairro: '',
            cep: '',
            cidade: '',
            uf: '',
            subtotal: null,
            descontos: null,
            total: null,
            logradouro_r: '',
            numero_r: null,
            complemento_r: '',
            bairro_r: '',
            cep_r: '',
            cidade_r: '',
            uf_r: '',
            data_inc: new Date(),
            hora_inc: new Date(),
            usuario: '',
            obs: '',
            convalescenca_prod: [],
            contrato: {},
        },
    });

    // Corrigir uso do hook: agora passa setModal e reset do formulário para reset imediato
    const handleSelecionarTitular = useSelecionarTitular(carregarDados, limparDados, setModal, methods.reset);


    // Carregar dados para edição
    useEffect(() => {
        if (isEditMode && id) {
            (async () => {
                try {
                    const response = await api.get(`/convalescencia/${id}`);
                    // axios retorna os dados em response.data
                    methods.reset(response.data);
                } catch (error) {
                    console.error('Erro ao buscar registro:', error);
                }
            })();
        } else {
            // Limpa o formulário ao criar novo registro
            methods.reset({
                editar: false,
                id_conv: null,
                id_empresa: infoEmpresa?.id || '',
                id_contrato_st: '',
                tipo_convalescente: null,
                tipo_entrada: '',
                nome: '',
                cpf_cnpj: '',
                data: null,
                data_nasc: null,
                status: 'ABERTO',
                forma_pag: '',
                logradouro: '',
                numero: null,
                complemento: '',
                bairro: '',
                cep: '',
                cidade: '',
                uf: '',
                subtotal: null,
                descontos: null,
                total: null,
                logradouro_r: '',
                numero_r: null,
                complemento_r: '',
                bairro_r: '',
                cep_r: '',
                cidade_r: '',
                uf_r: '',
                data_inc: new Date(),
                hora_inc: new Date(),
                usuario: '',
                obs: '',
                convalescenca_prod: [],
                contrato: {},
            });
        }
    }, [isEditMode, id, methods]);






    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-700">Carregando...</h2>
                        <p className="text-sm text-gray-500 mt-1">Aguarde um momento</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>

            {modal.busca && (
                <ModalBuscaConv
                    carregarDados={carregarDados}
                    selectEmp={infoEmpresa?.id ?? ""}
                    visible={modal.busca}
                    setVisible={() => setModal({ ...modal, busca: false })}
                    filtros={filtrosDaPagina}
                    onSelecionar={handleSelecionarTitular}
                />
            )}


            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                        {/* Header separado em duas linhas para evitar quebra */}
                        <div className="flex flex-col gap-4 p-2 w-full">
                            {/* Linha do título */}
                            <div className="flex justify-between items-baseline">
                                <h1 className="scroll-m-20 text-gray-800 text-2xl font-semibold tracking-tight whitespace-nowrap leading-none">
                                    {isEditMode ? 'Editar Convalescência' : 'Nova Convalescência'}
                                </h1>
                                <Button type="submit" className="ml-4 flex-shrink-0">
                                    {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                                </Button>
                            </div>

                            {/* Linha dos badges e botão buscar */}
                            <div className="flex flex-wrap gap-2 items-center justify-start">
                                {!isEditMode && (
                                    <>
                                        {dadosassociado && dadosassociado.id_global && dadosassociado.contrato?.situacao === "ATIVO" ? (
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
                                                        "bg-green-100 text-green-800 border-green-200"
                                                    )}
                                                >
                                                    {dadosassociado.contrato?.situacao}
                                                </Badge>
                                            </>
                                        ) : (
                                            <Badge variant="destructive" className="px-2.5 py-1 text-sm whitespace-nowrap flex-shrink-0">
                                                <AlertTriangle className="h-4 w-4 mr-1.5" />
                                                Nenhum Titular Selecionado
                                            </Badge>
                                        )}
                                        <Button
                                            disabled={!infoEmpresa}
                                            size={"sm"}
                                            onClick={() => setModal({ busca: true })}
                                            type="button"
                                        >
                                            <Search />
                                            Buscar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <FormularioConv
                            isEditMode={isEditMode}
                            listarProdutos={listarProdutos}
                            dadosassociado={dadosassociado}
                            ufs={ufs}
                            isModalOpen={isModalOpen}
                            rowSelection={rowSelection}
                            setIsModalOpen={setIsModalOpen}
                            setRowSelection={setRowSelection}
                        />
                    </form>
                </FormProvider>
            </div>
        </>
    )
}