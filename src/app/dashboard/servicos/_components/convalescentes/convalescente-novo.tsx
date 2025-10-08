'use client';

import React, { Suspense, useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import useActionsNovoResgistro from "../../_hooks/novo-registro/useActionsNovoRegistro";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Search, Shield, User } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FormularioConv from "../../_components/convalescentes/formulario-conv";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider} from "react-hook-form";
import { ConvProps } from "../../_types/convalescente";
import { api } from "@/lib/axios/apiClient";
import { useSelecionarTitular } from "@/app/dashboard/servicos/_hooks/novo-registro/useSelecionarTitular";
import { ModalBuscaConv } from "../../_components/convalescentes/modal-busca-titular";
import { ModalBusca } from "@/components/modals/modalBusca/modalBusca";
import { HeadAssociado } from "../obitos/tabs-modal/head-associado";



export default function ConvalescenciaNovo() {
    const {

        infoEmpresa,
        ufs,
        dadosassociado,
        carregarDados,
        limparDados,


    } = useContext(AuthContext);
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

    useEffect(() => {

        return () => {

            limparDados()
        }
    }, [])

    

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

    



    // Valores iniciais mínimos para ConvProps
    const methods = useForm<ConvProps>({
        defaultValues: {
            editar: false,
            id_conv_global:null,
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
    const {handleSelecionarTitular} = useSelecionarTitular(carregarDados, limparDados, setModal, methods.reset);


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
                id_conv_global:null,
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

            {/* {modal.busca && (
                <ModalBuscaConv
                   // carregarDados={carregarDados}
                    selectEmp={infoEmpresa?.id ?? ""}
                    visible={modal.busca}
                    setVisible={() => setModal({ ...modal, busca: false })}
                    filtros={filtrosDaPagina}
                    onSelecionar={handleSelecionarTitular}
                />
            )} */}

            <ModalBusca
                carregarDados={carregarDados}
                selectEmp={infoEmpresa?.id??''}
                setVisible={() => setModal({ ...modal, busca: false })}
                visible ={modal.busca??false}
            
            />


            <div className="flex flex-col w-full min-h-screen pl-10 pr-10 pt-4 pb-6">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex-1">
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
                                        {dadosassociado && dadosassociado.id_global ? (
                                         <HeadAssociado
                                         associado={dadosassociado.nome}
                                         convalescencia={dadosassociado.contrato?.convalescencia}
                                         id_contrato={dadosassociado.contrato?.id_contrato}
                                         plano={dadosassociado.contrato?.plano}
                                         situacao={dadosassociado.contrato?.situacao}
                                         />
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