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
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { ConvProps } from "../../_types/convalescente";
import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos";


export default function ConvalescenciaNovo() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [isDependenteSelecionado, setIsDependenteSelecionado] = useState(false);
    const [usarDadosTitular, setUsarDadosTitular] = useState(true);
    const [listaConv, setarListaConv] = useState<Partial<ConvProps>>({});


    const [modal, setModal] = useState<{ [key: string]: boolean }>({
        busca: false,
        altPlano: false,
        inativar: false,
        impressao: false,
    });

    const params = useParams();
    const router = useRouter();
    const id = params.id as string | undefined;
    const isEditMode = !!id;

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

    // FieldArray para produtos
    const { fields: produtosAdicionados, append, remove } = useFieldArray({
        control: methods.control,
        name: "convalescenca_prod"
    });

    // Carregar dados para edição
    useEffect(() => {
        if (isEditMode && id) {
            (async () => {
                try {
                    const response = await fetch(`/convalescencia/${id}`);
                    if (!response.ok) throw new Error('Erro ao buscar dados');
                    const data = await response.json();
                    methods.reset(data);
                } catch (error) {
                    console.error('Erro ao buscar registro:', error);
                }
            })();
        }
    }, [isEditMode, id, methods]);



    const onSubmit = (data: ConvProps) => {
        // Corrigir campos de data inválidos
        const fixDate = (date: any) => {
            if (!date) return null;
            const d = new Date(date);
            return isNaN(d.getTime()) ? null : d.toISOString();
        };

        const toIntOrNull = (val: any) => {
            if (val === undefined || val === null || val === '') return null;
            const n = Number(val);
            return isNaN(n) ? null : n;
        };

        const payload = {
            ...data,
            numero_r: toIntOrNull((data as any).numero_r),
            data_inc: fixDate(data.data_inc),
            hora_inc: fixDate(data.hora_inc),
            produtosAdicionados
        };
        if (isEditMode && id) {
            editarRegistro(id, payload);
        } else {
            enviarNovoRegistro(payload);
        }
    };

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
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="flex w-full justify-end mb-4">
                            <Button type="submit">
                                {isEditMode ? 'Salvar Alterações' : 'Criar Registro'}
                            </Button>
                        </div>
                        <FormularioConv
                            isEditMode={isEditMode}
                            listarProdutos={listarProdutos}
                            dadosassociado={dadosassociado}
                            ufs={ufs}
                            usarDadosTitular={usarDadosTitular}
                            setUsarDadosTitular={setUsarDadosTitular}
                            isDependenteSelecionado={isDependenteSelecionado}
                            isModalOpen={isModalOpen}
                            rowSelection={rowSelection}
                            setarListaConv={setarListaConv}
                            setIsModalOpen={setIsModalOpen}
                            setDependenteSelecionado={setIsDependenteSelecionado}
                            setRowSelection={setRowSelection}
                        />
                    </form>
                </FormProvider>
            </div >
        </>
    )
}