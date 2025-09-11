'use client';

import React, { useContext, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { date } from "zod";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { RowSelectionState } from "@tanstack/react-table";

// Importe a função que gera as colunas e o tipo
import { getColumns, Dependente } from "../../_components/convalescentes/colunas-dependentes";
// Importe o componente da tabela
import { TabelaDependentesCompleta } from "../../_components/convalescentes/data-table";
import { AuthContext } from "@/store/AuthContext";
import { GenericoBusca } from "@/components/genericoBusca";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";



export default function ConvalescenciaNovo() {

    const [usuarioMaterial, setUsuarioMaterial] = useState(true);
    const [material, setMaterialUsuario] = useState(false);
    const [dependente, setDependente] = useState(false);
    const [modalDependente, setModalDependente] = useState(false);
    const [modalComprovante, setComprovante] = useState(false);
    const [modalContrato, setModalContrato] = useState(false)
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    // **NOVO**: Estado para guardar a seleção DENTRO do modal
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const { ufs } = useContext(AuthContext)
    const [listaParaBusca, setListaParaBusca] = useState<AssociadoProps[]>([]);
    const [associadoSelecionado, setAssociadoSelecionado] = useState<AssociadoProps | null>(null);


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

    // Filtra os dependentes que não foram excluídos ANTES de passar para a tabela
    const dependentesVisiveis = React.useMemo(
        () => dadosAssociado?.dependentes.filter((d: Dependente) => d.excluido !== true) || [],
        [dadosAssociado]
    )

    // Gera as definições de colunas, passando as funções de ação necessárias
    const columns = React.useMemo(
        () => getColumns({ setarListaConv, setModalDependente }),
        [setarListaConv, setModalDependente]
    )


    const [isDependenteSelecionado, setDependenteSelecionado] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return <p>Carregando...</p>;
    }



    // **NOVO**: Função que será chamada pelo botão "Salvar" do modal
    const handleConfirmarSelecaoDependente = () => {
        // 1. Pega os índices das linhas selecionadas
        const indicesSelecionados = Object.keys(rowSelection).map(Number);

        // 2. Verifica se APENAS UM foi selecionado
        if (indicesSelecionados.length === 1 && dadosAssociado?.dependentes) {
            const indice = indicesSelecionados[0];
            const dependentesVisiveis = dadosAssociado.dependentes.filter(d => !d.excluido);
            const dependenteEscolhido = dependentesVisiveis[indice];

            // 3. Se tivermos um dependente, chame a função do seu hook principal
            if (dependenteEscolhido) {
                setarListaConv({
                    nome: dependenteEscolhido.nome,
                    data: dependenteEscolhido.data_nasc,
                    id_dependente: dependenteEscolhido.id_dependente,
                });

                // 4. Atualiza a UI: marca o checkbox e fecha o modal
                setDependenteSelecionado(true);
                setIsModalOpen(false);
            }
        } else {
            // 5. Mostra um aviso se nenhum ou mais de um for selecionado
            toast.info("Por favor, selecione apenas um dependente.");
        }
    };



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
                <div className="flex flex-row p-2 ">
                    <h1 className="w-full justify-between scroll-m-20 text-gray-800 pb-2 
                    text-2xl font-semibold tracking-tight first:mt-0">
                        Solicitar Convalescente
                    </h1>

                    {/* <div className="flex flex-row gap-8">
                        <GenericoBusca <carregarDados>
                            <Button
                                variant="outline"
                            >
                                <Search />
                                Buscar
                            </Button>
                        </GenericoBusca>
                    </div> */}
                </div>

                {/* Menu */}
                <div className="flex-col w-full mt-2 ">
                    <Tabs defaultValue="usuario" className="w-full">
                        <TabsList className="flex items-center border">
                            <TabsTrigger value="usuario">Nova Solicitação</TabsTrigger>
                            <TabsTrigger value="material">Material</TabsTrigger>
                            <TabsTrigger value="gravar">Gravar Alterações</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[400px] rounded-md">


                            {/* Informações de Usuário */}
                            <TabsContent value="usuario">

                                <Card>
                                    <CardHeader>

                                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                            <form>
                                                <div className="flex justify-start w-full gap-10">
                                                    <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                                                    <DialogTrigger asChild>
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox id="terms"
                                                                checked={isDependenteSelecionado}
                                                                // A lógica de clique é a seguinte:
                                                                onCheckedChange={(checked) => {

                                                                    if (checked) {
                                                                        setIsModalOpen(true)
                                                                    } else {
                                                                        setDependenteSelecionado(false)
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor="terms">DEPENDENTES</Label>
                                                        </div>
                                                    </DialogTrigger>
                                                </div>
                                                <DialogContent className="sm:max-w-4xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Selecione o Dependente</DialogTitle>
                                                        <DialogDescription>
                                                            Selecione o dependente desejado na lista abaixo.
                                                            Clique em 'Salvar Mudanças' para finalizar a seleção.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <TabelaDependentesCompleta
                                                            columns={columns}
                                                            data={dependentesVisiveis}
                                                            rowSelection={rowSelection}
                                                            setRowSelection={setRowSelection}
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancelar</Button>
                                                        </DialogClose>
                                                        <Button
                                                            type="submit"
                                                            onClick={handleConfirmarSelecaoDependente}
                                                        >Salvar Mudanças</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </form>
                                        </Dialog>

                                        <CardDescription>
                                        </CardDescription>
                                    </CardHeader>

                                    {/* Formulário de Usuário */}
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Nome do Usuário</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.nome}
                                                onChange={e => setarListaConv({ nome: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2 ">
                                            <Label htmlFor="tabs-demo-username">Data de Nascimento</Label>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date"
                                                        className="lg:col-span-1 justify-between font-normal text-gray-500"
                                                    >
                                                        {listaConv.data ? listaConv.data.toLocaleDateString() : "Selecione a data"}
                                                        <ChevronDownIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={listaConv.data ?? undefined}
                                                        captionLayout="dropdown"
                                                        onSelect={(date) => {
                                                            if (date) {

                                                                setarListaConv({ data: date });

                                                                setDate(date);
                                                            }
                                                            setOpen(false);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tabs-demo-name">CPF</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.cpf_cnpj}
                                                onChange={e => setarListaConv({ cpf_cnpj: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Endereço</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.logradouro}
                                                onChange={e => setarListaConv({ logradouro: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tabs-demo-name">Número</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.numero ?? ''}
                                                onChange={e => setarListaConv({ numero: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Bairro</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.bairro ?? ''}
                                                onChange={e => setarListaConv({ bairro: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Complemento</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.complemento ?? ''}
                                                onChange={e => setarListaConv({ complemento: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid gap-3 w-64">
                                                <Label htmlFor="tabs-demo-name">CEP</Label>
                                                <Input
                                                    id="tabs-demo-name"
                                                    value={listaConv.cep}
                                                    onChange={e => setarListaConv({ cep: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tabs-demo-name">Cidade</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.cidade}
                                                onChange={e => setarListaConv({ cidade: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="uf-select">UF</Label>
                                            <Select
                                                onValueChange={(valorUf) => {
                                                    setarListaConv({ uf: valorUf })
                                                }}>
                                                <SelectTrigger id="uf-select" className="w-[180px]">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ufs && ufs.length > 0 ? (
                                                        ufs.map((uf) => (
                                                            <SelectItem key={uf.id} value={uf.sigla}>
                                                                {uf.sigla}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        // Mostra uma mensagem de carregamento enquanto os dados não chegam
                                                        <SelectItem value="loading" disabled>
                                                            Carregando UFs...
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>



                                        {/* ------------------- Nova Seção ---------------------- */}



                                        <CardTitle className="text-xl col-span-full mt-4 border-t pt-8 pb-2">
                                            Endereço de Retirada
                                        </CardTitle>

                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Endereço</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.logradouro_r}
                                                onChange={e => setarListaConv({ logradouro_r: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-3 w-64">
                                            <Label htmlFor="tabs-demo-name">Número</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.numero_r ?? ''}
                                                onChange={e => setarListaConv({ numero_r: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid gap-2 lg:col-span-2">
                                            <Label htmlFor="tabs-demo-name">Bairro</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.bairro_r ?? ''}
                                                onChange={e => setarListaConv({ bairro_r: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tabs-demo-name">Cidade</Label>
                                            <Input
                                                id="tabs-demo-name"
                                                value={listaConv.cidade_r}
                                                onChange={e => setarListaConv({ cidade_r: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="uf-select">UF</Label>
                                            <Select
                                                onValueChange={(valorUf) => {
                                                    setarListaConv({ uf: valorUf })
                                                }}>
                                                <SelectTrigger id="uf-select" className="w-[180px]">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ufs && ufs.length > 0 ? (
                                                        ufs.map((uf) => (
                                                            <SelectItem key={uf.id} value={uf.sigla}>
                                                                {uf.sigla}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        // Mostra uma mensagem de carregamento enquanto os dados não chegam
                                                        <SelectItem value="loading" disabled>
                                                            Carregando UFs...
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => adicionarNovoRegistro()} >Salvar</Button>
                                    </CardFooter>
                                </Card>


                            </TabsContent>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>

                        {/* Informações de Material */}
                        <TabsContent value="material">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações</CardTitle>
                                    <CardDescription>

                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-name">Name</Label>
                                        <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-username">Username</Label>
                                        <Input id="tabs-demo-username" defaultValue="@peduarte" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => adicionarNovoRegistro()} >Salvar</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* <ul className="flex flex-wrap w-full text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">


                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(true), setMaterialUsuario(false) }} className="inline-block p-4 font-semibold rounded-ss-lg  bg-gray-800 hover:bg-gray-700 text-blue-500">Usuário</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setUsuarioMaterial(false), setMaterialUsuario(true) }} className="inline-block p-4  hover:bg-gray-700 hover:text-gray-300">Material</button>
                        </li>

                        {!listaConv.editar ? <li className="ml-auto flex items-center mr-2">
                            <button type="button" onClick={() => adicionarNovoRegistro()} className="inline-flex p-2 text-white font-semibold rounded-lg uppercase bg-green-600 gap-1">Salvar<HiOutlineSave size={22} /></button>
                        </li> : <li className="ml-auto flex items-center mr-2">
                            <button type="button" onClick={() => editarRegistro()} className="inline-flex p-2 text-black font-semibold rounded-lg uppercase bg-yellow-600 gap-1">Gravar Alterações<HiOutlineSave size={22} /></button>
                        </li>}
                    </ul> */

                    }
                    {/* {usuarioMaterial && <>
                        {dadosAssociado?.id_associado && <div className="flex w-full p-2  text-lg  text-black">
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
                                <label className="block  text-xs font-medium  text-black">Nome do Usuário</label>
                                <input value={listaConv.nome} onChange={e => setarListaConv({ nome: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Data Nasc</label>
                                <DatePicker dateFormat={"dd/MM/yyyy"} locale={pt} selected={listaConv.data} onChange={e => e && setarListaConv({ data: e })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</DatePicker>
                            </div>
                            <div className="flex flex-col col-span-1">
                                <label className="block  text-xs font-medium  text-black">CPF</label>
                                <input value={listaConv.cpf_cnpj} onChange={e => setarListaConv({ cpf_cnpj: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Endereço</label>
                                <input value={listaConv.logradouro} onChange={e => setarListaConv({ logradouro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Número</label>
                                <input value={listaConv.numero ?? ''} onChange={e => setarListaConv({ numero: Number(e.target.value) })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Complemento</label>
                                <input value={listaConv.complemento} onChange={e => setarListaConv({ complemento: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Bairro</label>
                                <input value={listaConv.bairro} onChange={e => setarListaConv({ bairro: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">CEP</label>
                                <input value={listaConv.cep} onChange={e => setarListaConv({ cep: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-row gap-x-4 col-span-2 ">
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-black">Cidade</label>
                                    <input value={listaConv.cidade} onChange={e => setarListaConv({ cidade: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-black">UF</label>
                                    <input value={listaConv.uf} onChange={e => setarListaConv({ uf: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>

                            </div>

                            <div className="flex flex-col text-black col-span-5 ">
                                <h1 className="border-b-[1px] border-gray-500">Endereço de Retirada</h1>

                            </div>

                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Endereço</label>
                                <input value={listaConv.logradouro_r} onChange={e => setarListaConv({ logradouro_r: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-white border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Número</label>
                                <input value={listaConv.numero_r ?? ''} onChange={e => setarListaConv({ numero_r: Number(e.target.value) })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-col col-span-1 ">
                                <label className="block  text-xs font-medium  text-black">Bairro</label>
                                <input value={listaConv.bairro_r} onChange={e => setarListaConv({ bairro_r: e.target.value })} className="whitespace-nowrap uppercase  py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                            </div>
                            <div className="flex flex-row gap-x-4 col-span-2 ">
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-black">Cidade</label>
                                    <input value={listaConv.cidade_r} onChange={e => setarListaConv({ cidade_r: e.target.value })} className="whitespace-nowrap uppercase py-1 px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block  text-xs font-medium  text-black">UF</label>
                                    <input value={listaConv.uf_r} onChange={e => setarListaConv({ uf_r: e.target.value })} className="whitespace-nowrap uppercase py-1  px-0 w-full text-xs  bg-transparent border-0 border-b-2  appearance-none text-black border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" >{ }</input>
                                </div>
                            </div>
                        </div></>} */}






                </div>
            </div >
        </>
    )
}