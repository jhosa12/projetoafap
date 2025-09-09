'use client';

import {  useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import DocumentTemplate from "@/Documents/convalescenca/contrato/DocumentTemplate";
import ComprovanteDocTemplte from '@/Documents/convalescenca/comprovante/DocumentTemplate'
import { IoPrint } from "react-icons/io5";
import { IoTicket } from "react-icons/io5";
import { TbAlertTriangle } from "react-icons/tb";
import { toast } from "sonner";
import useActionsNovoResgistro from "../../_hooks/useActionsNovoRegistro";


export default function ConvalescenciaNovo() {

    const [usuarioMaterial, setUsuarioMaterial] = useState(true);
    const [material, setMaterialUsuario] = useState(false);
    const [dependente, setDependente] = useState(false);
    const [modalDependente, setModalDependente] = useState(false);
    const [modalComprovante, setComprovante] = useState(false);
    const [modalContrato, setModalContrato] = useState(false)
    const [visible, setVisible] = useState(false)

    const {

        dataInputs,
        estoque,
        listaMaterial,
        indexProd,
        dadosAssociado,
        data,
        listaConv,
        titular,
        selectProdutos,
        componentRefComprovante,
        componentRefContrato,
        isLoading,

        setTitular,
        closeModa,
        setMaterial,
        setIndex,


        setarListaConv,
        imprimirComprovante,
        imprimirContrato,
        setInputs,
        adicionarProduto,
        receberDev,
        carregarDados,
        editarRegistro,
        adicionarNovoRegistro

    } = useActionsNovoResgistro()

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    //  function statusProd(status: string) {
    //   const novoArray = [...listaMaterial]
    //     novoArray[indexProd].status = status
    //     setMaterial(novoArray)
    //      editarRegistro()
    //   if (status === 'FECHADO') { imprimirComprovante() }
    //   else { imprimirContrato() }
    //   }



    /*  async function  atualizarStatus() {
          try {
              await toast.promise(
                  api.put('/convalescencia/editar',{
                      status:'ABERTO'
                  }),
                  {
                      error:'Erro ao Confirmar Entrega',
                      pending:'Alterando Status do Produto',
                      success:'Alterado com sucesso'
                  }
              )
          } catch (error) {
              
          }
          
      }*/

    //function setarMaterialLista(fields: Partial<ListaMaterial>) {
    //     setMaterial((prev: Partial<ListaMaterial>) => {
    //       if (prev) {
    //           return { ...prev, ...fields }
    //       }
    //    else {
    //        return { ...fields }
    //    }

    // })


    //  }

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











            {/*visible && <ModalBusca visible={visible} setVisible={()=>setVisible(false)} />*/}
            {modalDependente && dependente && (
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
            )}
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                <div className="flex flex-row p-2 border-b-[1px] border-gray-600">
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Solicitar Convalescente</h1>

                    <div className="flex flex-row gap-8">

                        <button onClick={() => closeModa({ closeModalPlano: true })} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                            <IoMdSearch size={20} />
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">

                    <ul className="flex flex-wrap w-full text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">


                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(true), setMaterialUsuario(false) }} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Usuário</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(false), setMaterialUsuario(true) }} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Material</button>
                        </li>

                        {!listaConv.editar ? <li className="ml-auto flex items-center mr-2">
                            <button type="button" onClick={() => adicionarNovoRegistro()} className="inline-flex p-2 text-white font-semibold rounded-lg uppercase bg-green-600 gap-1">Salvar<HiOutlineSave size={22} /></button>
                        </li> : <li className="ml-auto flex items-center mr-2">
                            <button type="button" onClick={() => editarRegistro()} className="inline-flex p-2 text-white font-semibold rounded-lg uppercase bg-yellow-600 gap-1">Gravar Alterações<HiOutlineSave size={22} /></button>
                        </li>}
                    </ul>
                    {usuarioMaterial && <>
                        {dadosAssociado?.id_associado && <div className="flex w-full p-2  text-lg  text-white">
                            <h1 className="flex w-full p-1 border-b-[1px] border-gray-500">ASSOCIADO: {dadosAssociado?.contrato.id_contrato} - {dadosAssociado?.nome} / CATEGORIA: {dadosAssociado?.contrato.plano}</h1>
                        </div>}
                        <div className="inline-flex gap-8 pl-4 pt-1">
                            <div className="flex items-center ">
                                <input type="checkbox" checked={titular} onClick={() => { setTitular(!titular), setDependente(false) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">TITULAR</label>
                            </div>
                            <div className="flex items-center ">
                                <input type="checkbox" onClick={() => { setDependente(!dependente), setTitular(false), setModalDependente(true) }} checked={dependente} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">DEPENDENTE</label>
                            </div>
                        </div>

                        <div className="rounded-lg p-6 grid grid-flow-row-dense max-h-[calc(100vh-200px)] grid-cols-5 gap-5">
                            <div className="flex flex-col col-span-1">
                                <label className="block  text-xs font-medium  text-white">Nome do Usuário</label>
                                <input value={listaConv.nome} onChange={e => setarListaConv({ nome: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Data Nasc</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={listaConv.data} onChange={e => e && setarListaConv({ data: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col col-span-1">
                                <label className="block  text-xs font-medium  text-white">CPF</label>
                                <input value={listaConv.cpf_cnpj} onChange={e => setarListaConv({ cpf_cnpj: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Endereço</label>
                                <input value={listaConv.logradouro} onChange={e => setarListaConv({ logradouro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Número</label>
                                <input value={listaConv.numero ?? ''} onChange={e => setarListaConv({ numero: Number(e.target.value) })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Complemento</label>
                                <input value={listaConv.complemento} onChange={e => setarListaConv({ complemento: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Bairro</label>
                                <input value={listaConv.bairro} onChange={e => setarListaConv({ bairro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">CEP</label>
                                <input value={listaConv.cep} onChange={e => setarListaConv({ cep: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-row gap-x-4 col-span-2 ">
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">Cidade</label>
                                    <input value={listaConv.cidade} onChange={e => setarListaConv({ cidade: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">UF</label>
                                    <input value={listaConv.uf} onChange={e => setarListaConv({ uf: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>

                            </div>

                            <div className="flex flex-col text-white col-span-5 ">
                                <h1 className="border-b-[1px] border-gray-500">Endereço de Retirada</h1>

                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Endereço</label>
                                <input value={listaConv.logradouro_r} onChange={e => setarListaConv({ logradouro_r: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Número</label>
                                <input value={listaConv.numero_r ?? ''} onChange={e => setarListaConv({ numero_r: Number(e.target.value) })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-white">Bairro</label>
                                <input value={listaConv.bairro_r} onChange={e => setarListaConv({ bairro_r: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-row gap-x-4 col-span-2 ">
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">Cidade</label>
                                    <input value={listaConv.cidade_r} onChange={e => setarListaConv({ cidade_r: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-white">UF</label>
                                    <input value={listaConv.uf_r} onChange={e => setarListaConv({ uf_r: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                            </div>
                        </div></>}





                    {material && <div className="flex flex-col w-full rounded-lg p-6   gap-5">
                        <div className="flex flex-row text-white gap-6 w-full">

                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Material</label>
                                <select defaultValue={(dataInputs.descricao)} onChange={e => {
                                    const prod = selectProdutos.find(item => item.id_produto === Number(e.target.value))
                                    setInputs({ ...dataInputs, descricao: prod?.descricao, id_produto: Number(e.target.value) })
                                }}
                                    className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " >
                                    <option></option>
                                    {
                                        selectProdutos.map((item, index) => {
                                            return (
                                                <option value={item.id_produto}>{item.descricao}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium  text-white">Codigo do Produto</label>
                                <select onChange={e => {

                                    setInputs({ ...dataInputs, id_estoque: Number(e.target.value) })
                                }}
                                    className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " >
                                    <option></option>
                                    {
                                        estoque.map((item, index) => {
                                            return (
                                                item.produto === dataInputs.descricao && <option value={item.id_estoque}>{item.codProd} - {item.estado}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="flex flex-col w-1/12">
                                <label className="block mb-1 text-sm font-medium  text-white">Quant.</label>
                                <input value={Number(dataInputs.quantidade)} onChange={e => setInputs({ quantidade: Number(e.target.value) })} autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>
                            <div className="flex flex-col w-1/12" >
                                <label className="block mb-1 text-sm font-medium  text-white">Valor</label>
                                <input value={Number(dataInputs.valor)} onChange={(e) => setInputs({ valor: Number(e.target.value) })}
                                    autoComplete='off' type="number" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                            </div>

                            <div className="flex items-end">
                                <button onClick={() => {
                                    if (!dataInputs.descricao) {
                                        toast.info('Selecione o Material');
                                        return;

                                    }
                                    adicionarProduto()

                                    // const novoArray = listaMaterial && [...listaMaterial];
                                    // novoArray.push({ ...dataInputs, status: 'PENDENTE', data: new Date(), id_conv: Number(listaConv.id_conv) })
                                    // setMaterial(novoArray)



                                }
                                }
                                    className="flex bg-blue-600 p-1 pl-2 pr-2 rounded-lg ">Adicionar</button>
                            </div>

                        </div>
                        <div className="flex">
                            <table
                                className="block  overflow-y-auto overflow-x-auto text-sm text-left rtl:text-center border-collapse rounded-lg text-gray-400">
                                <thead className="sticky top-0 text-sm  uppercase bg-gray-700 text-gray-400">
                                    <tr>
                                        <th scope="col" className=" px-2 py-1">
                                            Descrição Item
                                        </th>
                                        <th scope="col" className=" px-2 py-1">
                                            Código do Produto
                                        </th>

                                        <th scope="col" className="px-4 py-1">
                                            Quant.
                                        </th>
                                        <th scope="col" className="px-4 py-1">

                                            Valor Unit.
                                        </th>
                                        <th scope="col" className="px-4 py-1">
                                            Status
                                        </th>

                                        <th scope="col" className="px-4 py-1">
                                            <span >AÇÕES</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaMaterial?.map((item, index) => {
                                        return (<tr key={index} className={`border-b bg-gray-800 border-gray-700`}>
                                            <td className="px-2 py-1">
                                                {item?.descricao}
                                            </td>
                                            <td className="px-2 py-1">
                                                {estoque.map(it => {
                                                    if (item.id_estoque === it.id_estoque) {
                                                        return it.codProd
                                                    }
                                                })}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item?.quantidade}
                                            </td>
                                            <td className="px-4 py-1">
                                                R${item?.valor}
                                            </td>
                                            <td className="px-4 py-1">
                                                {item?.status}
                                            </td>
                                            <td className="px-4 py-1 flex justify-center gap-2 text-center ">
                                                <button onClick={() => {

                                                    const novo = listaMaterial && [...listaMaterial]
                                                    novo?.splice(index, 1)
                                                    setMaterial(novo)
                                                }} className=" flex justify-center items-center rounded-lg  px-1 py-1 text-white hover:bg-red-600"><MdClose /></button>
                                                <button onClick={() => {

                                                    if (item.id_conv_prod && item.status === 'ABERTO') {
                                                        imprimirContrato()
                                                        return;

                                                    }
                                                    if (item.id_conv_prod) {
                                                        setModalContrato(true)
                                                        setIndex(index)
                                                    }
                                                    else {
                                                        toast.warning('SALVE AS ALTERAÇÕES')
                                                        return;
                                                    }
                                                }} className="text-blue-600 p-1  rounded-lg hover:text-white hover:bg-blue-600"><IoPrint size={18} /></button>
                                                <button onClick={() => {
                                                    if (item.status === 'PENDENTE') {
                                                        return
                                                    }
                                                    if (item.id_conv_prod && item.status === 'FECHADO') {
                                                        imprimirComprovante()
                                                        return;
                                                    }
                                                    else if (item.id_conv_prod) {
                                                        setComprovante(true)
                                                        setIndex(index)
                                                    }
                                                    else {
                                                        toast.warning('SALVE AS ALTERAÇÕES')
                                                        return;
                                                    }


                                                }} className="text-yellow-600 p-1 rounded-lg hover:text-white hover:bg-yellow-600"><IoTicket size={18} /></button>
                                            </td>

                                        </tr>)
                                    })}

                                </tbody>

                                <tfoot >
                                    <tr className={`border-b bg-gray-700 border-gray-700  hover:bg-gray-600`}>
                                        <td className="px-4 py-1 text-start font-semibold" colSpan={3}>Total Geral</td>
                                        <td className="px-4 py-1 text-green-500 text-start font-semibold" colSpan={3} >R${ }</td>
                                    </tr>
                                </tfoot>

                            </table>

                        </div>

                        <div style={{ display: 'none' }}>
                            <DocumentTemplate
                                ref={componentRefContrato}
                                nome={listaConv.nome ?? ''}
                                cpf={listaConv.cpf_cnpj ?? ''}
                                rg={listaConv.cpf_cnpj ?? ''}
                                logradouro={listaConv.logradouro ?? ''}
                                bairro={listaConv.bairro ?? ''}
                                cidade={listaConv.cidade ?? ''}
                                uf={listaConv.uf ?? ''}
                                telefone={''}
                                contrato={Number(listaConv.id_contrato)}
                                material={/*listaConv.convalescenca_prod?.descricao ??*/''}

                            />

                        </div>
                        <div style={{ display: 'none' }}>
                            <ComprovanteDocTemplte
                                ref={componentRefComprovante}
                                nome={listaConv.nome ?? ''}
                                condicao=""
                                material={/*listaConv.convalescenca_prod?.descricao??*/''}

                            />
                        </div>
                    </div>
                    }
                </div>
            </div>
        </>
    )
}