'use client';

import { useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { MdAdd } from "react-icons/md";
import ReactPaginate from 'react-paginate';
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
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

export default function Convalescente() {
    const [dropOpen, setDrop] = useState(false)



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

        // --- Funções de Ação ---
        setarListaConv,
        listarConv,
        deletarConv,
        receberDevolucao

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
        siblingCount: 2 // Equivalente ao seu pageRangeDisplayed={5}
    });


    return (
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
                            {/* <input type="checkbox" checked={pendente} onChange={() => { setPendente(!pendente) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap  text-gray-300">ENTREGA PENDENTE</label> */}
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

                    <form className="flex w-full">
                        <Select>
                            <SelectTrigger className="max-w-48 rounded-r-none">
                                <SelectValue placeholder="Selecione um criterio"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem onClick={() => { setCriterio('Contrato'), setDrop(false) }} value="Contrato">Contrato</SelectItem>
                                <SelectItem onClick={() => { setCriterio('Titular'), setDrop(false) }} value="Titular">Titular</SelectItem>
                                <SelectItem onClick={() => { setCriterio('Usuario'), setDrop(false) }} value="Usuário">Usuário</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex relative w-[350px] ">
                            <Input
                                onChange={e => setInput(e.target.value)}
                                type={criterio === "Contrato" ? "number" : "search"}
                                placeholder="Buscar lançamento"
                                className="rounded-none"
                            />
                            <Button
                                onClick={() => listarConv()}
                                className="rounded-l-none"
                            >
                                <Search />
                            </Button>
                        </div>



                        {/* <button onClick={() => setDrop(!dropOpen)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg focus:outline-none  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">{criterio}
                            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        {dropOpen && (
                            <div className="absolute top-[134px] divide-gray-100 z-20 rounded-lg shadow  bg-gray-700">
                                <ul className="py-2 text-sm text-gray-200">
                                    <li >
                                        <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={() => { setCriterio('Contrato'), setDrop(false) }}>Contrato</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={() => { setCriterio('Titular'), setDrop(false) }}>Titular</a>
                                    </li>

                                    <li>
                                        <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={() => { setCriterio('Usuario'), setDrop(false) }}>Usuário</a>
                                    </li>

                                </ul>
                            </div>
                        )} */}
                        {/* <div className=" relative w-[350px]">
                            {/* <input value={input} onChange={e => setInput(e.target.value)} type={criterio === "Contrato" ? "number" : "search"} autoComplete="off" className="uppercase flex justify-center  p-2.5 w-full z-20 text-sm  rounded-e-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Buscar Lançamento" required /> */}
                        {/* <button onClick={() => listarConv()} type="button" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg></button>
                        </div> */}
                    </form>
                    <Button>
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
                            href='/servicos/convalescencia/novoregistro'>
                            <Plus size={36}/> Add
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
                <TableCaption>A lista</TableCaption>
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
                            <TableCell>{item.convalescenca_prod.some((dados) => dados.status === 'PENDENTE') ?
                                'PENDENTE' : item.convalescenca_prod.some(dados => dados.status === 'ABERTO') ? 'ABERTO' : 'FECHADO'}</TableCell>
                            <TableCell>
                                <div className="flex flex-row w-full gap-2">
                                    <Link
                                        onClick={() => setarListaConv({
                                            ...item, convalescenca_prod: [...item.convalescenca_prod]
                                        })}
                                        data-tooltip-id="toolId"
                                        data-tooltip-content={'Editar Dados'}
                                        className="text-yellow-500 hover:bg-yellow-500 p-1 rounded-lg hover:text-white"
                                        href='/servicos/convalescencia/novoregistro'>
                                        <LuFolderEdit size={18} />
                                    </Link>

                                    <button data-tooltip-id="toolId" data-tooltip-content={'Excluir'} onClick={() => { setExcluir(true); setarListaConv({ id_conv: item.id_conv }) }} className="text-red-500 hover:bg-red-500 p-1 rounded-lg hover:text-white">
                                        <MdDeleteOutline size={18} />
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
    )
}