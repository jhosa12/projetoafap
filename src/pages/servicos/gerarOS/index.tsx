
import { api } from "@/services/apiClient";
import { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext";
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import InputMask from 'react-input-mask'
import { ModalBusca } from "@/components/modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DadosPlano } from "@/components/obito/dadosPlano";
import { DadosFalecido } from "@/components/obito/dadosFalecido";
import { DadosDeclarante } from "@/components/obito/dadosDeclarante";
import { DadosObito } from "@/components/obito/dadosObito";
import { ProdutosServicos } from "@/components/obito/produtosServicos";
import { ItensUsados } from "@/components/obito/itensUsados";
import { DadosVelorio } from "@/components/obito/dadosVelorio";
import DocumentacaoOS from "@/components/obito/documentacao";




interface EstoqueProps {
    id_produto: number,
    id_estoque: number,
    data: Date,
    estado: string,
    produto: string,
    total: number
    fornecedor: string
}

interface ArrayProps {
    id_produto: number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}

interface ListaProdutos {

    id_produto: number,
    descricao: string,
    unidade: string,
    valor_custo: number,
    valor_venda: number,
    quantidade: number,
    margem_lucro: number,
    valor_aluguel: number,
    est_inicial: number,
    est_entradas: number,
    est_saidas: number,
    est_saldo: number,
    situacao: string,
    data_inc: Date,
    grupo: string,
    tipo: string,
    taxa_conval: number,
    estoque: Array<EstoqueProps>
}


export default function GerarOS() {

    const { usuario, setarServico, servico, signOut, data, closeModa, dadosassociado,limparDados, carregarDados } = useContext(AuthContext)
    const [listaProduto, setListaProdutos] = useState<Partial<ArrayProps>>({ descricao_item: "" });
    const [selectProdutos, setselectProdutos] = useState<Array<ListaProdutos>>([]);
    const [total, setTotal] = useState<number>();
    const [titular, setTitular] = useState(false);
    const [dependente, setDependente] = useState(false);
    const [modalDependente, setModalDependente] = useState(false);
    const [componenteMounted, setMounted] = useState(false);
    const [particular, setParticular] = useState(false);
    const [indexTab, setIndex] = useState<number>(0)



   const handleCheckParticular=()=>{
        if(!particular){
            limparDados()
            setarServico({
                id_contrato:undefined,
                id_titular:undefined
            })
            setParticular(true)
            setTitular(false)
            setDependente(false)
        }else{
            setParticular(false)
        }
     
    }
   const handleCheckDependente=()=>{
    if(!dependente){
        if(!dadosassociado?.contrato?.id_contrato){
            toast.info('Realize a busca pelo associado')
            return;
        }else{
            setDependente(true)
            setTitular(false)
            setParticular(false)
            setModalDependente(true)
        }
    }else{
        setDependente(false)
    }

    }


    useEffect(()=>{
        limparDados()
    },[])

    function setarProdutos(fields: Partial<ArrayProps>) {
        setListaProdutos((prev: Partial<ArrayProps>) => {
            if (prev) {
                return { ...prev, ...fields }
            }
            else {
                return { ...fields }
            }

        })

    }
const handleCheckTitular=()=>{
    if (!titular) {
        if(!dadosassociado?.contrato?.id_contrato){
            toast.info('Realize a busca pelo associado!');
            
            return
        }
        else{
        setTitular(true)
        setDependente(false)
        setarServico({
            nome_falecido: dadosassociado?.nome,
            data_nascimento: dadosassociado?.data_nasc,
            end_rua: dadosassociado?.endereco,
            end_bairro: dadosassociado?.bairro,
            end_numero: String(dadosassociado?.numero),
            end_cidade: dadosassociado?.cidade,
            id_contrato:dadosassociado.contrato?.id_contrato,
            id_titular:dadosassociado.id_associado
        })}

    }else setTitular(false)
}
 

    function setarFalecidoDependente({ nome, data_nasc }: { nome: string, data_nasc: Date }) {
        setarServico({
            nome_falecido: nome,
            data_nascimento: data_nasc,
            id_contrato:dadosassociado?.contrato?.id_contrato
        });
        setModalDependente(false);

    }

    useEffect(() => {
        componenteMounted && carregarDados();
        setParticular(false);
        setMounted(true)
    }, [data.id_associado])





    useEffect(() => {
        setListaProdutos({ acrescimo: null, desconto: null, descricao_item: "", quantidade: 1, valor_total: null, valor_unit: null })
        const Total = servico.obito_itens?.reduce((total, item) => total = total + Number(item.valor_total), 0)
        setTotal(Total)

    }, [servico.obito_itens])

    useEffect(() => {
        const user = !!usuario
        if (!user) {
            signOut()
            return;
        }
        //   hr_velorio:new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Fortaleza'})
        try {
            listarProdutos()
            if (!servico.id_obitos) {
                carregarCheckList()
            }
        } catch (err) {
            toast.error('Erro ao Listar CheckList')
        }
    }, [usuario])

    async function listarProdutos() {
        const response = await api.get("/estoque/listar")

        setselectProdutos(response.data.produtos)
        console.log(response.data.produtos)
    }

    async function cadastrarObito() {
        console.log(servico)
        const [hours, minutes] = (servico.hr_velorio ?? '').split(':');
        const newDate = new Date();
        newDate.setHours(parseInt(hours));
        newDate.setMinutes(parseInt(minutes));
        if (!servico.nome_falecido || !servico.rd_nome) {
            toast.info("Preencha todos os campos obrigatórios");
            return;
        }
      
        const response = await toast.promise(
            api.post("/obitos/adicionarObito", {
                ...servico, hr_velorio: newDate, obito_itens: servico.obito_itens, tipo_atendimento: particular ? 'PARTICULAR' : 'ASSOCIADO',falecido:titular?'TITULAR':dependente?'DEPENDENTE':undefined,
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
            }),
            {
                error: 'Erro ao Realizar Cadastro',
                pending: 'Cadastrando óbito',
                success: 'Cadastrado com sucesso!'
            }
        )
        setarServico({ ...servico, id_obitos: response.data })
    }




    async function editarObito() {
        await toast.promise(
            api.put('/obitos/editarObito', {
                ...servico,
                status: servico.listacheckida?.find(item => item.status === false) || servico.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'

            }),
            {
                error: 'Erro ao atualizar os dados',
                pending: 'Atualizando dados',
                success: 'Dados atualizados com sucesso'
            }
        )

    }





    async function carregarCheckList() {
        const response = await api.get("/obitos/listarCheckList")
        setarServico({ ...servico, listacheckida: response.data })
        setarServico({ ...servico, listacheckvolta: response.data })
    }
    function deletarProduto(id_ob_itens: number) {
        console.log(id_ob_itens)
        const response = toast.promise(
            api.delete(`/obitoItens/deletar/${String(id_ob_itens)}`),
            {
                error:'Erro ao deletar dado',
                success:'Dado deletado',
                pending:'Deletando dado....'
                
            }
        )
      
    }

    function alterCheckListIda(index: number) {
        if (servico.listacheckida) {
            const novoArra = [...servico.listacheckida];
            novoArra[index].status = !novoArra[index].status;
            setarServico({ ...servico, listacheckida: novoArra })
        }

    }


    function alterCheckListVolta(index: number) {
        if (servico.listacheckvolta) {
            const novoArray = [...servico.listacheckvolta];
            novoArray[index].status = !novoArray[index].status
            setarServico({ ...servico, listacheckvolta: novoArray })
        }

    }




    useEffect(() => {
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade })
        }
        if (listaProduto.valor_unit && listaProduto.quantidade) {
            setarProdutos({ valor_total: listaProduto.valor_unit * listaProduto.quantidade + (listaProduto.acrescimo ?? 0) - (listaProduto.desconto ?? 0) })
        }
    }, [listaProduto.quantidade, listaProduto.valor_unit, listaProduto.acrescimo, listaProduto.desconto])

    async function lancarCaixa() {
        const descricoes = servico?.obito_itens?.map(item => `${item.descricao_item} QUANT.: ${item.quantidade}  VALOR: R$${item.valor_total}`);
        const descricaoCompleta = descricoes?.join(' / ')
        try {
            await toast.promise(
                api.post("/obitos/lancarCaixa", {
                    conta: "1.03.006",
                    data: new Date(),
                    datalanc: new Date(),
                    conta_n: "1.03.006",
                    descricao: "ENTRADAS DE OUTRAS AGENCIAS AFAP",
                    historico: `REFERENTE A COMPRA DE: ${descricaoCompleta}`,
                    tipo: 'RECEITA',
                    usuario: usuario?.nome,
                    valor: total,
                    ccustos_id: 2
                }),
                {
                    error: 'Erro ao Confirmar Pagamento',
                    pending: 'Realizando Recebimento em Caixa',
                    success: 'Recebido com sucesso'
                }
            )


        } catch (error) {
            console.log(error)

        }

    }
    return (
        <>
           
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
                                {dadosassociado?.dependentes?.map((item, index) => {
                                    return (
                                        item.excluido !== true && <li onClick={() => setarFalecidoDependente({ nome: item.nome, data_nasc: item.data_nasc })} className="flex cursor-pointer hover:bg-gray-700 bg-gray-600 p-1 pl-2 pr-2 rounded-lg ">
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
                    <h1 className="flex w-full  text-gray-300 font-semibold text-2xl ">Gerar Ordem de Serviço</h1>

                    <div className="flex flex-row gap-8">
                        <div className="flex items-center ">
                            <input type="checkbox" checked={particular} onChange={handleCheckParticular} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">PARTICULAR</label>
                        </div>
                        <button onClick={() => closeModa({ closeModalPlano: true })} type="button" className=" border font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                            <IoMdSearch size={20} />
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="flex-col w-full border mt-2 rounded-lg shadow  border-gray-700">

                    <ul className="flex flex-wrap w-full text-sm font-medium text-center  border-b   rounded-t-lg  border-gray-700 text-gray-400 bg-gray-800" role="tablist">

                        {!particular && <li className="me-2">
                            <button type="button" onClick={() => { setIndex(1) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 1 && "text-blue-500"}`}>Plano</button>
                        </li>}
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(2) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 2 && "text-blue-500"}`}>Falecido</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(3) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 3 && "text-blue-500"}`}>Declarante</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(4) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 4 && "text-blue-500"}`}>Dados do Óbito</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(5) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 5 && "text-blue-500"}`}>Produtos e Serviços</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(6) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 6 && "text-blue-500"}`}>Velório</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(7) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 7 && "text-blue-500"}`}>CheckLists</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(8) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 8 && "text-blue-500"}`}>Documentação</button>
                        </li>
                        <li className="me-2">
                            <button type="button" onClick={() => { setIndex(9) }} className={`inline-block p-4   hover:bg-gray-700 hover:text-gray-300 ${indexTab === 9 && "text-blue-500"}`}>Itens Usados</button>
                        </li>
                        <li className="ml-auto flex items-center mr-2">
                            {servico.id_obitos ? <button type="button" onClick={() => editarObito()} className="inline-flex p-2 text-white font-semibold rounded-lg bg-yellow-500 gap-1">Gravar Alterações<HiOutlineSave size={22} /></button> : <button type="button" onClick={() => cadastrarObito()} className="inline-flex p-2 text-white font-semibold rounded-lg bg-green-600 gap-1">Salvar<HiOutlineSave size={22} /></button>}
                        </li>

                    </ul>


                    {indexTab === 1 && !particular && (<DadosPlano dados={{
                        nome: dadosassociado?.nome,
                        categoria: dadosassociado?.contrato?.plano,
                        id_associado: dadosassociado?.id_associado,
                        id_contrato: dadosassociado?.contrato?.id_contrato,
                        situacao: dadosassociado?.contrato?.situacao
                    }}

                    />)}

                    {indexTab === 2 && <>
                        {!particular && <div className="inline-flex gap-8 pl-4 pt-1">
                            <div className="flex items-center ">
                                <input type="checkbox" checked={titular} onClick={handleCheckTitular} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">TITULAR</label>
                            </div>
                            <div className="flex items-center ">
                                <input type="checkbox" onClick={handleCheckDependente} checked={dependente} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">DEPENDENTE</label>
                            </div>
                        </div>}
                        <DadosFalecido servico={servico} setarServico={setarServico} check={particular||titular||dependente?false:true} />

                    </>}



                    {indexTab === 3 && <DadosDeclarante servico={servico} setarServico={setarServico} />}



                    {indexTab === 4 && <DadosObito servico={servico} setarServico={setarServico} />}

                    {indexTab === 5 && <ProdutosServicos
                        deletarProduto={deletarProduto}
                        lancarCaixa={lancarCaixa}
                        listaProduto={listaProduto}
                        obito_itens={servico.obito_itens ?? []}
                        selectProdutos={selectProdutos}
                        setarProdutos={setarProdutos}
                        setarServico={setarServico}
                        total={total ?? 0}
                        id_obito={servico.id_obitos ?? 0}


                    />}


                    {indexTab === 9 && <ItensUsados
                        selectProdutos={selectProdutos}
                        id_obito={Number(servico.id_obitos)}
                        obito_itens={servico.obito_itens ?? []}
                        setarServico={setarServico}
                        atualizarProdutos={listarProdutos}

                    />}



                    {indexTab === 6 && <DadosVelorio servico={servico} setarServico={setarServico} />}

                    {indexTab === 7 && <div className="flex flex-row w-full justify-around rounded-lg p-2   gap-6">    <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
                        <h1 className="border-b-[1px] border-gray-500">Checklist Saída</h1>
                        <ul className="flex flex-col gap-2">
                            {servico.listacheckida?.map((it, index) => {
                                return (
                                    <li className="flex items-center ">
                                        <input checked={it.status} onChange={() => alterCheckListIda(index)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">{it.descricao}</label>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>

                        <div className="flex flex-col overflow-y-auto w-1/3 text-white p-2 gap-2 rounded-md bg-gray-600 mt-1 mb-1 max-h-[calc(100vh-250px)] ">
                            <h1 className="border-b-[1px] border-gray-500">Checklist Retorno</h1>
                            <ul className="flex flex-col gap-2">
                                {servico?.listacheckvolta?.map((item, i) => {
                                    return (
                                        <li className="flex items-center ">
                                            <input checked={item.status} onChange={() => alterCheckListVolta(i)} type="checkbox" value="" className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                                            <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">{item.descricao}</label>
                                        </li>
                                    )
                                })}
                            </ul>

                        </div>


                    </div>
                    }

                    {indexTab===8 && <DocumentacaoOS

                        servico={servico}
                    
                    />}



                </div>

                {data.closeModalPlano && (<ModalBusca />)}


            </div>
        </>
    )
}