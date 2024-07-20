import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient"
import { FormEvent, useContext, useEffect, useState } from "react"
import { LuFolderEdit } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { TbAlertTriangle } from "react-icons/tb";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import ReactPaginate from 'react-paginate';
import { Tooltip } from 'react-tooltip';
import Link from "next/link";
import PrintButtonComprovante from "@/Documents/convalescenca/comprovante/PrintButton";
interface ConvProps {
    id_conv: number,
    id_contrato: number,
    id_associado: number,
    id_contrato_st: string,
    tipo_entrada: string,
    nome: string,
    cpf_cnpj: string,
    data: Date,
    status: string,
    forma_pag: string,
    logradouro: string,
    numero: number,
    complemento: string,
    bairro: string,
    cep: string,
    cidade: string,
    uf: string,
    subtotal: number,
    descontos: number,
    total: number,
    logradouro_r: string,
    numero_r: number,
    complemento_r: string,
    bairro_r: string,
    cep_r: string,
    cidade_r: string,
    uf_r: string,
    data_inc: Date,
    hora_inc: Date,
    usuario: string,
    obs: string,
    contrato: {
        situacao: string,
        carencia: string,
        associado: {
            nome: string
        }

    },
    convalescenca_prod: Array<{
        id_conv_prod: number,
        id_conv: number,
        id_produto: number,
        descricao: string,
        unidade: string,
        grupo: string,
        data: Date,
        data_dev: Date,
        quantidade: number,
        valor: number,
        descontos: number,
        total: number,
        hora: Date,
        cortesia: string,
        retornavel: string,
        status: string
    }>
}

export default function Convalescente() {
    const [arrayConv, setConv] = useState<Array<ConvProps>>([])
    const [arrayFiltro, setFiltro] = useState<Array<ConvProps>>([])
    const [dropOpen, setDrop] = useState(false)
    const [criterio, setCriterio] = useState("Contrato")
    const [input, setInput] = useState('')
    const { listaConv, setarListaConv, usuario } = useContext(AuthContext)
    const [excluir, setExcluir] = useState(false)
    const [aberto, setAberto] = useState(true)
    const [entregue, setEntregue] = useState(true)
    const [pendente, setPendente] = useState(true)
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 16;


    const handlePageClick = (selectdItem: { selected: number }) => {
        setCurrentPage(selectdItem.selected)
    }

    const offset = currentPage * itemsPerPage;
    const currentItems = arrayFiltro.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(arrayFiltro.length / itemsPerPage);




    useEffect(() => {
        try {

            listarConv()

        } catch (error) {


        }
    }, [])
    async function listarConv() {

        if (!input) {
            const response = await api.post("/convalescencia/listar")
            setConv(response.data)


        }
        else if (criterio === 'Contrato') {
            const response = await api.post("/convalescencia/listar", {
                id_contrato: Number(input)
            }
            )
            setConv(response.data)

        }
        else if (criterio === 'Titular') {
            const response = await api.post("/convalescencia/listar", {
                titular: input.toUpperCase()
            })
            setConv(response.data)
        }

        else if (criterio === 'Usuario') {
            const response = await api.post("/convalescencia/listar", {
                nome: input.toUpperCase()
            })
            setConv(response.data)
        }
    }

    async function deletarConv() {
        await toast.promise(
            api.delete("/convalescencia/deletar", {
                data: {
                    id_conv: listaConv.id_conv
                }
            }),
            {
                error: 'Erro ao deletar lançamento',
                pending: 'Efetuando Exclusão',
                success: 'Excluido com sucesso!'

            }
        )
        listarConv()
        setarListaConv({ id_conv: null })
        setExcluir(false)

    }

    async function receberDevolucao(id_conv: number) {

        const response = await toast.promise(
            api.put("/convalescencia/receber",
                {
                    id_conv,
                    status: "FECHADO"
                }
            ),
            {
                error: "Erro na Requisição",
                pending: "Realizando Devolução",
                success: "Produto devolvido com Sucesso"
            }

        )
        console.log(response.data)


        setInput('')
        listarConv()
    }

    useEffect(() => {

        if (arrayConv.length > 0) {
            let novoArray
            if (pendente && entregue && aberto) {
                setFiltro(arrayConv)
            }

            else if (pendente && !aberto && !entregue) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE'))
            }
            else if (aberto && !pendente && !entregue) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'ABERTO'))
            }
            else if (entregue && !pendente && !aberto) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.every(dado => dado.status === 'FECHADO'))
            }
            else if (pendente && aberto && !entregue) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE' || dado.status === 'ABERTO'))
            }
            else if (pendente && entregue && !aberto) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'PENDENTE' || dado.status === 'FECHADO'))
            }
            else if (aberto && entregue && !pendente) {
                novoArray = arrayConv.filter(item => item.convalescenca_prod.some(dado => dado.status === 'FECHADO' || dado.status === 'ABERTO'))
            }


            novoArray && setFiltro(novoArray)

        }


    }, [pendente, entregue, aberto, arrayConv])
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
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
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
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
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
                            descontos: null,
                            forma_pag: '',
                            hora_inc: undefined,
                            id_associado: null,
                            id_contrato: null,
                            id_contrato_st: '',
                            id_conv: null,
                            logradouro: '',
                            logradouro_r: '',
                            nome: '',
                            numero: null,
                            numero_r: null,
                            obs: '',
                            status: '',
                            subtotal: null,
                            tipo_entrada: '',
                            total: null,
                            uf: '',
                            uf_r: '',
                            usuario: '',
                            editar: false
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
                                        {new Date(item.data).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-1 text-yellow-500">
                                        {item.convalescenca_prod.some((dados) => dados.status === 'PENDENTE') ? 'PENDENTE' : item.convalescenca_prod.some(dados => dados.status === 'ABERTO') ? 'ABERTO' : 'FECHADO'}
                                    </td>
                                    <td className="px-8 py-1">
                                        <div className="flex flex-row w-full gap-2">
                                            <Link
                                                onClick={() => setarListaConv({
                                                    ...item, convalescenca_prod: [...item.convalescenca_prod], editar: true
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
                    containerClassName={'pagination inline-flex text-gray-400 gap-4 ml-auto justify-end font-semibold'}
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