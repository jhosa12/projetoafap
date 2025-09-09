'use client';


import { api } from "@/lib/axios/apiClient"
import { useCallback, useEffect, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { MdAdd } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { Tooltip } from 'react-tooltip';
import Link from "next/link";
import { toast } from "sonner";
import { ConvProps } from "../../_types/convalescente";
import useActionsListagem from "../../_hooks/useActionsListagem";
import { format } from "date-fns";

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
        currentItems,
        pageCount,

        // --- Funções para alterar o estado  ---
        setPendente,
        setAberto,
        setEntregue,
        setCriterio,
        setInput,
        setExcluir,

        // --- Funções de Ação ---
        setarListaConv,
        handlePageClick,
        listarConv,
        deletarConv,
        receberDevolucao

    } = useActionsListagem()















    return (
        <div className="flex flex-col w-full pl-10 pr-10 pt-4">
            <Tooltip className="z-20" id="toolId" />
            <div className="flex flex-row w-full p-2 border-b-[1px]  border-gray-600">
                <h1 className="flex w-full items-end  text-gray-300 font-semibold text-2xl ">Controle Convalescente</h1>
                <div className="flex  items-end w-full gap-8">
                    <div className="inline-flex gap-6">
                        <div className="flex items-center ">
                            <input type="checkbox" checked={pendente} onChange={() => { setPendente(!pendente) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap  text-gray-300">ENTREGA PENDENTE</label>
                        </div>
                        <div className="flex items-center ">
                            <input type="checkbox" checked={aberto} onChange={() => { setAberto(!aberto) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">ABERTO</label>
                        </div>
                        <div className="flex items-center ">
                            <input type="checkbox" checked={entregue} onChange={() => { setEntregue(!entregue) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">ENTREGUE</label>
                        </div>

                    </div>

                    <form className="flex w-full">
                        <button onClick={() => setDrop(!dropOpen)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg focus:outline-none  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">{criterio}
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
                        )}
                        <div className=" relative w-[350px]">
                            <input value={input} onChange={e => setInput(e.target.value)} type={criterio === "Contrato" ? "number" : "search"} autoComplete="off" className="uppercase flex justify-center  p-2.5 w-full z-20 text-sm  rounded-e-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " placeholder="Buscar Lançamento" required />
                            <button onClick={() => listarConv()} type="button" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg></button>
                        </div>
                    </form>
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
                        className="inline-flex justify-center items-center text-white bg-green-600 p-1 px-2 rounded-lg"
                        href='/servicos/convalescencia/novoregistro'>
                        <MdAdd size={22} />Add
                    </Link>
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

            <div className="flex flex-col w-full justify-center p-1 max-h-[calc(100vh-150px)]">{/*DIV DA TABELA*/}
                <table
                    className="block overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                    <thead className="sticky  top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th scope="col" className=" px-4 py-1">
                                Contrato
                            </th>

                            <th scope="col" className="px-8 py-1">
                                Titular
                            </th>
                            <th scope="col" className="px-8 py-1">
                                Usuário
                            </th>
                            <th scope="col" className="px-8 py-1">
                                Data
                            </th>
                            <th scope="col" className="px-8 py-1">
                                status
                            </th>
                            <th scope="col" className="px-8 py-1">
                                <span >Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map((item, index) => {
                            return (

                                <tr key={index} className={`border-b  border-gray-700 "bg-gray-600":"bg-gray-800"} hover:bg-gray-600`}>
                                    <td className="px-4 py-1">
                                        {item.id_contrato}
                                    </td>
                                    <td className="px-8 py-1 w-full whitespace-nowrap">
                                        {item.contrato?.associado.nome}
                                    </td>
                                    <td className="px-8 py-1 w-full whitespace-nowrap">
                                        {item.nome}
                                    </td>

                                    <td className="px-8 py-1">
                                        {item.data ? format(new Date(item.data), 'dd/MM/yyyy') : '--/--/----'}                                    </td>
                                    <td className="px-8 py-1 text-yellow-500">
                                        {item.convalescenca_prod.some((dados) => dados.status === 'PENDENTE') ? 'PENDENTE' : item.convalescenca_prod.some(dados => dados.status === 'ABERTO') ? 'ABERTO' : 'FECHADO'}
                                    </td>
                                    <td className="px-8 py-1">
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
                                    </td>

                                </tr>

                            )
                        })}

                    </tbody>



                </table>
                <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Próximo'}
                    breakLabel={'...'}
                    breakClassName="breack-me"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination inline-flex text-gray-400 gap-4 ml-auto justify-end font-semibold  '}
                    activeClassName={'active text-blue-600'}

                />

                <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
        }

        .pagination li {
          margin: 0 5px;
          cursor: pointer;
        }

        .pagination li a {
          text-decoration: none;
          color: #0070f3;
        }

        .pagination li.active a {
          font-weight: bold;
          color: #fff;
        }
      `}</style>


            </div>
        </div>

    )
}