'use client';

import React, { useContext, useEffect, useState } from "react";
import { useActionsSubmit } from "../../_hooks/novo-registro/useActionsSubmit";
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
        enviarNovoRegistro,
        editarRegistro,
    } = useActionsNovoResgistro();

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
            nome: '',
            logradouro: '',
            numero: 0,
            bairro: '',
            cidade: '',
            uf: '',
            status: '',
            subtotal: 0,
            descontos: 0,
            total: 0,
            data_inc: undefined,
            hora_inc: undefined,
            usuario: '',
            obs: '',
            convalescenca_prod: [],
            // ...adicione outros campos obrigatórios de ConvProps se necessário
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
                nome: '',
                logradouro: '',
                numero: 0,
                bairro: '',
                cidade: '',
                uf: '',
                status: '',
                subtotal: 0,
                descontos: 0,
                total: 0,
                data_inc: undefined,
                hora_inc: undefined,
                usuario: '',
                obs: '',
                convalescenca_prod: [],
                // ...adicione outros campos obrigatórios de ConvProps se necessário
            });
        }
    }, [isEditMode, id, methods]);




    // Hook deve ser chamado no topo do componente
    const { handleSubmit } = useActionsSubmit(
        methods.getValues(),
        isEditMode,
        id,
        editarRegistro,
        enviarNovoRegistro,
        
    );

    if (isLoading) {
        return <p>Carregando...</p>;
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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-row p-2 items-center w-full">
                            <h1 className="flex-1 scroll-m-20 text-gray-800 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                                {isEditMode ? 'Editar Convalescença' : 'Nova Convalescença'}
                            </h1>
                            <div className="flex flex-row gap-2 items-center justify-end w-full">
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
                                <Button type="submit">
                                    {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                                </Button>
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