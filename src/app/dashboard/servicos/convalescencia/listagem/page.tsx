'use client';

import React, { useEffect, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { Tooltip } from 'react-tooltip';
import Link from "next/link";
import useActionsListagem from "../../_hooks/useActionsListagem";
import { format } from "date-fns";
import { Search, Plus } from 'lucide-react';

//Shadcn-ui
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { usePaginatedData, DOTS } from "../../_hooks/useActionsPaginacao";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";

export default function Convalescente() {
    const [dropOpen, setDrop] = useState(false)
    const [modalDependente, setModalDependente] = useState(false);
    const [modalComprovante, setComprovante] = useState(false);
    const [modalContrato, setModalContrato] = useState(false)
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [indexProd, setIndex] = useState<number>(0);


    const {

        produtosAdicionados,
        setProdutosAdicionados,
        listarProdutos,
        listaMaterial,
        setMaterial,
        dataInputs,
        setInputs,
        estoque




    } = useActionsNovoResgistro()

    async function receberDev(status: string) {

        if (status === 'ABERTO') {
            const novoArray = [...listaMaterial]
            novoArray[indexProd].id_estoque = dataInputs.id_estoque
            setMaterial(novoArray)
        }

        toast.promise(
            api.put('/convalescencia/receber', {
                id_conv_prod: listaMaterial[indexProd].id_conv_prod,
                id_estoque: status === 'ABERTO' ? produtosAdicionados[indexProd].id_estoque : undefined,
                status
            }),
            {
                error: 'Erro ao Atualizar Dados',
                loading: 'Atualizando Dados....',
                success: (response) => {
                    const novoArray = [...produtosAdicionados]
                    novoArray[indexProd] = response.data
                    setMaterial(novoArray)

                    return 'Dados Atualizados com sucesso!'
                }

            }



        )



    }

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
        imprimirComprovante,
        imprimirContrato


    } = useActionsListagem()

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


    return (
        <>

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

                        <div className="flex w-full">
                            <Select onValueChange={(value) => {
                                setCriterio(value);
                                setInput('')
                            }
                            }>
                                <SelectTrigger className="max-w-48 rounded-r-none">
                                    <SelectValue placeholder="Selecione um criterio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Contrato">Contrato</SelectItem>
                                    <SelectItem value="Titular">Titular</SelectItem>
                                    <SelectItem value="Usuário">Usuário</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex relative w-[350px] ">
                                <Input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    type={criterio === "Contrato" ? "number" : "search"}
                                    placeholder="Buscar lançamento"
                                    className="rounded-none"
                                />
                            </div>
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
                    {excluir && (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="flex items-center justify-center p-2 w-full h-full">
                            <div className="relative rounded-lg shadow bg-gray-800">
                                <button type="button" onClick={() => setExcluir(!excluir)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                    <button type="button" onClick={() => { }} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                        <IoIosClose size={30} />
                                    </button>
                                </button>
                                <div className="p-4 md:p-5 text-center">
                                    <div className="flex w-full justify-center items-center">
                                        <TbAlertTriangle className='text-gray-400' size={60} />
                                    </div>
                                    <h3 className="mb-5 text-lg font-normal  text-gray-400">Realmente deseja deletar esse lançamento?</h3>

                                    <button onClick={() => deletarConv()} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                        Sim, tenho certeza
                                    </button>
                                    <button onClick={() => setExcluir(!excluir)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contrato</TableHead>
                            <TableHead>Titular</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentPageData?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.id_contrato}</TableCell>
                                <TableCell>{item.contrato?.associado.nome}</TableCell>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell>{item.data ? format(new Date(item.data), 'dd/MM/yyyy') : '--/--/----'}  </TableCell>
                                <TableCell> {
                                    item.status.toUpperCase() === 'PENDENTE'
                                        ? 'PENDENTE'
                                        : item.status.toUpperCase() === 'ABERTO'
                                            ? 'ABERTO'
                                            : 'ENTREGUE'
                                }</TableCell>
                                <TableCell>
                                    <div className="flex flex-row w-full gap-2">
                                        <Link
                                            data-tooltip-id="toolId"
                                            data-tooltip-content={'Editar Dados'}
                                            className="text-yellow-500 hover:bg-yellow-500 p-1 rounded-lg hover:text-white"
                                            href={`/dashboard/servicos/convalescencia/editar/${item.id_conv}`}>
                                            <LuFolderEdit size={18} />
                                        </Link>
                                        <button data-tooltip-id="toolId" data-tooltip-content={'Excluir'} onClick={() => { setExcluir(true); setarListaConv({ id_conv: item.id_conv }) }} className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white">
                                            <MdDeleteOutline size={18} />
                                        </button>
                                        <button
                                            onClick={() => setComprovante({ true })}
                                            type="button"
                                        >
                                            <Search />
                                            Buscar
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex flex-col w-full justify-center p-1 max-h-[calc(100vh-150px)]">
                    <Pagination className="inline-flex text-gray-500 gap-4 mt-4 ml-auto justify-end font-semibold">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); previousPage(); }}
                                    className={isFirstPage ? "pointer-events-none text-gray-400" : undefined}
                                >
                                    Anterior
                                </PaginationPrevious>
                            </PaginationItem>

                            {paginationRange.map((pageNumber, index) => {
                                if (pageNumber === DOTS) {
                                    return <PaginationItem key={`dots-${index}`}><PaginationEllipsis /></PaginationItem>;
                                }
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); goToPage(pageNumber as number); }}
                                            isActive={pageNumber === currentPage}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); nextPage(); }}
                                    className={isLastPage ? "pointer-events-none text-gray-400" : undefined}
                                >
                                    Próximo
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </>
    )
}